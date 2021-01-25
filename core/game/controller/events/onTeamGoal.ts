import * as Tst from "../Translator";
import * as LangRes from "../../resource/strings";
import * as BotSettings from "../../resource/settings.json";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { getUnixTimestamp } from "../Statistics";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { ScoresObject } from "../../model/GameObject/ScoresObject";
import { setBanlistDataToDB } from "../Storage";

export async function onTeamGoalListener(team: TeamID): Promise<void> {
    // Event called when a team scores a goal.
    let scores: ScoresObject | null = window.room.getScores(); //get scores object (it includes time data about seconds elapsed)
    window.logger.i(`Goal time logger (secs):${Math.round(scores?.time || 0)}`);

    var placeholderGoal = { 
        teamID: team,
        teamName: '',
        scorerID: 0,
        scorerName: '',
        assistID: 0,
        assistName: '',
        ogID: 0,
        ogName: '',
        gameRuleName: window.settings.game.rule.ruleName,
        gameRuleDescription: window.settings.game.rule.ruleDescripttion,
        gameRuleLimitTime: window.settings.game.rule.requisite.timeLimit,
        gameRuleLimitScore: window.settings.game.rule.requisite.scoreLimit,
        gameRuleNeedMin: window.settings.game.rule.requisite.minimumPlayers,
        possTeamRed: window.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.winningStreak.teamID),
        streakTeamCount: window.winningStreak.count

    };

    if (team === TeamID.Red) {
        // if red team win
        placeholderGoal.teamName = 'Red';
    } else {
        // if blue team win
        placeholderGoal.teamName = 'Blue';
    }
    // identify who has goaled.
    var touchPlayer: number | undefined = window.ballStack.pop();
    var assistPlayer: number | undefined = window.ballStack.pop();
    window.ballStack.clear(); // clear the stack.
    window.ballStack.initTouchInfo(); // clear touch info
    if (window.isStatRecord == true && touchPlayer !== undefined) { // records when game mode is for stats recording.
        // except spectators and filter who were lose a point
        var losePlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.team !== TeamID.Spec && player.team !== team);
        losePlayers.forEach(function (eachPlayer: PlayerObject) {
            // records a lost point in match record
            window.playerList.get(eachPlayer.id)!.matchRecord.losePoints++;
            //setPlayerData(window.playerList.get(eachPlayer.id)!); // updates lost points count
        });

        // check whether or not it is an OG. and process it!
        if (window.playerList.get(touchPlayer)!.team === team) { // if the goal is normal goal (not OG)
            placeholderGoal.scorerID = window.playerList.get(touchPlayer)!.id;
            placeholderGoal.scorerName = window.playerList.get(touchPlayer)!.name;
            window.playerList.get(touchPlayer)!.matchRecord.goals++; // record goal in match record
            //setPlayerData(window.playerList.get(touchPlayer)!);
            var goalMsg: string = Tst.maketext(LangRes.onGoal.goal, placeholderGoal);
            if (assistPlayer !== undefined && touchPlayer != assistPlayer && window.playerList.get(assistPlayer)!.team === team) {
                // records assist when the player who assists is not same as the player goaled, and is not other team.
                placeholderGoal.assistID = window.playerList.get(assistPlayer)!.id;
                placeholderGoal.assistName = window.playerList.get(assistPlayer)!.name;
                window.playerList.get(assistPlayer)!.matchRecord.assists++; // record assist in match record
                //setPlayerData(window.playerList.get(assistPlayer)!);
                goalMsg = Tst.maketext(LangRes.onGoal.goalWithAssist, placeholderGoal);
            }
            window.room.sendAnnouncement(goalMsg, null, 0x00FF00, "normal", 0);
            window.logger.i(goalMsg);
        } else { // if the goal is OG
            placeholderGoal.ogID = touchPlayer;
            placeholderGoal.ogName = window.playerList.get(touchPlayer)!.name;
            window.playerList.get(touchPlayer)!.matchRecord.ogs++; // record OG in match record
            //setPlayerData(window.playerList.get(touchPlayer)!);
            window.room.sendAnnouncement(Tst.maketext(LangRes.onGoal.og, placeholderGoal), null, 0x00FF00, "normal", 0);
            window.logger.i(`${window.playerList.get(touchPlayer)!.name}#${touchPlayer} made an OG.`);

            if(BotSettings.antiOgFlood === true) { // if anti-OG flood option is enabled
                window.antiTrollingOgFloodCount.push(touchPlayer); // record it

                let ogCountByPlayer: number = 0;
                window.antiTrollingOgFloodCount.forEach((record) =>  { //check how many times OG made by this player
                    if(record === touchPlayer) {
                        ogCountByPlayer++; //count
                    }
                });

                if(ogCountByPlayer >= BotSettings.ogFloodCriterion) { // if too many OGs were made
                    // kick this player
                    const banTimeStamp: number = getUnixTimestamp(); // get current timestamp
                    window.logger.i(`${window.playerList.get(touchPlayer)!.name}#${touchPlayer} was kicked for anti-OGs flood. He made ${ogCountByPlayer} OGs. (conn:${window.playerList.get(touchPlayer)!.conn})`);
                    window.room.kickPlayer(touchPlayer, LangRes.antitrolling.ogFlood.banReason, false); // kick
                    //and add into ban list (not permanent ban, but fixed-term ban)
                    await setBanlistDataToDB({ conn: window.playerList.get(touchPlayer)!.conn, reason: LangRes.antitrolling.ogFlood.banReason, register: banTimeStamp, expire: banTimeStamp+BotSettings.ogFloodBanMillisecs });
                }
            }
            
        }
    }
}
