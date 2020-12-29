import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import * as BotSettings from "../../resources/settings.json";
import { ScoresObject } from "../../model/GameObject/ScoresObject";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { setPlayerData } from "../Storage";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { shuffleArray } from "../RoomTools";
import { putTeamNewPlayerConditional, roomActivePlayersNumberCheck } from "../../model/OperateHelper/Quorum";

export function onTeamVictoryListener(scores: ScoresObject): void {
    // Event called when a team 'wins'. not just when game ended.
    // records vicotry in stats. total games also counted in this event.
    // Haxball developer Basro said, The game will be stopped automatically after a team victory. (victory -> stop)
    var placeholderVictory = { 
        teamID: TeamID.Spec,
        teamName: '',
        redScore: scores.red,
        blueScore: scores.blue,
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

    let winningMessage: string = '';

    let allActivePlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && window.playerList.get(player.id)!.permissions.afkmode === false); // non afk players
    let teamPlayers: PlayerObject[] = allActivePlayers.filter((player: PlayerObject) => player.team !== TeamID.Spec); // except Spectators players

    let winnerTeamID: TeamID;
    let loserTeamID: TeamID;

    if (scores.red > scores.blue) {
        winnerTeamID = TeamID.Red;
        loserTeamID = TeamID.Blue;
        placeholderVictory.teamName = 'Red';
    } else {
        winnerTeamID = TeamID.Blue;
        loserTeamID = TeamID.Red;
        placeholderVictory.teamName = 'Blue';
    }
    placeholderVictory.teamID = winnerTeamID;
    winningMessage = Tst.maketext(LangRes.onVictory.victory, placeholderVictory);

    window.isGamingNow = false; // turn off

    if (window.settings.game.rule.statsRecord == true && window.isStatRecord == true) { // records when game mode is for stats recording.
        teamPlayers.forEach((eachPlayer: PlayerObject) => {
            if(eachPlayer.team === winnerTeamID) { // if this player is winner
                window.playerList.get(eachPlayer.id)!.stats.wins++; //records a win
            }
            window.playerList.get(eachPlayer.id)!.stats.totals++; // records a game count
            setPlayerData(window.playerList.get(eachPlayer.id)!); // updates stats
        });

        if(winnerTeamID !== window.winningStreak.teamID) {
            // if winner team is changed
            window.winningStreak.count = 1; // init count and set to won one game
        } else {
            window.winningStreak.count++; // increase count
        }
        window.winningStreak.teamID = winnerTeamID; // set winner team id

        // update placeholder
        placeholderVictory.streakTeamName = convertTeamID2Name(window.winningStreak.teamID);
        placeholderVictory.streakTeamCount = window.winningStreak.count;

        window.logger.i(`${placeholderVictory.streakTeamName} team wins streak ${placeholderVictory.streakTeamCount} games.`); // log it

        if(window.winningStreak.count >= 3) {
            winningMessage += '\n' + Tst.maketext(LangRes.onVictory.burning, placeholderVictory);
        }
    }

    // when auto emcee mode is enabled
    if(window.settings.game.rule.autoOperating === true) {
        if(window.winningStreak.count >= BotSettings.rerollWinstreakCriterion) {
            // if winning streak count has reached limit
            if(BotSettings.rerollWinStreak === true && roomActivePlayersNumberCheck() >= window.settings.game.rule.requisite.minimumPlayers ) {
                // if rerolling option is enabled, then reroll randomly
                
                window.winningStreak.count = 0; // init count

                // reroll randomly
                // get new active players list and shuffle it randomly
                let allPlayersList: PlayerObject[] = window.room.getPlayerList();
                let shuffledIDList: number[] = shuffleArray(allPlayersList.map((eachPlayer: PlayerObject) => eachPlayer.id));
                for(let i: number = 0; i < shuffledIDList.length; i++) {
                    if(i < window.settings.game.rule.requisite.eachTeamPlayers * 2 && shuffledIDList[i] !== 0 && window.playerList.get(shuffledIDList[i])!.permissions.afkmode !== true) {
                        putTeamNewPlayerConditional(shuffledIDList[i]); // move to red and blue team until requisite is met
                    } else {
                        window.room.setPlayerTeam(shuffledIDList[i], TeamID.Spec); // or move to spec
                    }
                }

                winningMessage += '\n' + Tst.maketext(LangRes.onVictory.reroll, placeholderVictory);
                window.logger.i(`Whole players are shuffled.`);
            }
        } else {
            // or still under the limit, then change spec and loser team
            teamPlayers.filter((player: PlayerObject) => player.team === loserTeamID).forEach((eachPlayer: PlayerObject) => {
                window.room.setPlayerTeam(eachPlayer.id, TeamID.Spec); // move losers to Spec team
            });
            // get new spec player list
            let specActivePlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && player.team === TeamID.Spec && window.playerList.get(player.id)!.permissions.afkmode === false);
            for(let i: number = 0; i < window.settings.game.rule.requisite.eachTeamPlayers && i < specActivePlayers.length; i++) {
                window.room.setPlayerTeam(specActivePlayers[i].id, loserTeamID); // move Specs to challenger team
            }
        }
    }

    // notify victory
    window.logger.i(`The game has ended. Scores ${scores.red}:${scores.blue}.`);
    window.room.sendAnnouncement(winningMessage, null, 0x00FF00, "bold", 1);
}
