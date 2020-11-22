import { gameRule } from "../../model/rules/rule";
import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import { setPlayerData } from "../Storage";
import { PlayerObject } from "../../model/PlayerObject";

export function onTeamGoalListener(team: number): void {
    // Event called when a team scores a goal.
    var placeholderGoal = { // Parser.maketext(str, placeholder)
        teamID: team,
        teamName: '',
        scorerID: '',
        scorerName: '',
        assistID: '',
        assistName: '',
        ogID: '',
        ogName: '',
        gameRuleName: gameRule.ruleName,
        gameRuleDescription: gameRule.ruleDescripttion,
        gameRuleLimitTime: gameRule.requisite.timeLimit,
        gameRuleLimitScore: gameRule.requisite.scoreLimit,
        gameRuleNeedMin: gameRule.requisite.minimumPlayers,
        possTeamRed: window.ballStack.possCalculate(1),
        possTeamBlue: window.ballStack.possCalculate(2),
        streakTeamName: window.winningStreak.getName(),
        streakTeamCount: window.winningStreak.getCount()

    };

    if (team == 1) {
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
        if (window.playerList.get(touchPlayer).team == team) {
            // if the goal is not OG
            placeholderGoal.scorerID = window.playerList.get(touchPlayer).id;
            placeholderGoal.scorerName = window.playerList.get(touchPlayer).name;
            window.playerList.get(touchPlayer).stats.goals++;
            setPlayerData(window.playerList.get(touchPlayer));
            var goalMsg: string = Tst.maketext(LangRes.onGoal.goal, placeholderGoal);
            if (assistPlayer !== undefined && touchPlayer != assistPlayer && window.playerList.get(assistPlayer).team == team) {
                // records assist when the player who assists is not same as the player goaled, and is not other team.
                placeholderGoal.assistID = window.playerList.get(assistPlayer).id;
                placeholderGoal.assistName = window.playerList.get(assistPlayer).name;
                window.playerList.get(assistPlayer).stats.assists++;
                setPlayerData(window.playerList.get(assistPlayer));
                goalMsg = Tst.maketext(LangRes.onGoal.goalWithAssist, placeholderGoal);
            }
            window.room.sendAnnouncement(goalMsg, null, 0x00FF00, "normal", 0);
            window.logger.i(goalMsg);
        } else {
            // if the goal is OG
            placeholderGoal.ogID = window.playerList.get(touchPlayer).id;
            placeholderGoal.ogName = window.playerList.get(touchPlayer).name;
            window.playerList.get(touchPlayer).stats.ogs++;
            setPlayerData(window.playerList.get(touchPlayer));
            window.room.sendAnnouncement(Tst.maketext(LangRes.onGoal.og, placeholderGoal), null, 0x00FF00, "normal", 0);
            window.logger.i(`${window.playerList.get(touchPlayer).name}#${window.playerList.get(touchPlayer).id} made an OG.`);
        }
        // except spectators and filter who were lose a point
        var losePlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.team != 0 && player.team != team);
        losePlayers.forEach(function (eachPlayer: PlayerObject) {
            // records a lost point
            window.playerList.get(eachPlayer.id).stats.losePoints++;
            setPlayerData(window.playerList.get(eachPlayer.id)); // updates lost points count
        });
    }
}