import { ScoresObject } from "../../model/ScoresObject";
import { PlayerObject } from "../../model/PlayerObject";
import { gameRule } from "../../model/rules/rule";
import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import { setPlayerData } from "../Storage";
import { setDefaultStadiums } from "../RoomTools";

export function onTeamVictoryListener(scores: ScoresObject): void {
    // Event called when a team 'wins'. not just when game ended.
    // recors vicotry in stats. total games also counted in this event.
    var placeholderVictory = { // Parser.maketext(str, placeholder)
        teamID: 0,
        teamName: '',
        redScore: scores.red,
        blueScore: scores.blue,
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

    window.isGamingNow = false; // turn off

    if (gameRule.statsRecord == true && window.isStatRecord == true) { // records when game mode is for stats recording.
        var gamePlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.team != 0); // except Spectators players
        var redPlayers: PlayerObject[] = gamePlayers.filter((player: PlayerObject) => player.team == 1); // except non Red players
        var bluePlayers: PlayerObject[] = gamePlayers.filter((player: PlayerObject) => player.team == 2); // except non Blue players
        if (scores.red > scores.blue) {
            // if Red wins
            placeholderVictory.teamID = 1;
            placeholderVictory.teamName = 'Red';
            window.winningStreak.red++;
            window.winningStreak.blue = 0;
            redPlayers.forEach(function (eachPlayer: PlayerObject) {
                window.playerList.get(eachPlayer.id).stats.wins++; //records a win
            });
        } else {
            // if Blue wins
            placeholderVictory.teamID = 2;
            placeholderVictory.teamName = 'Blue';
            window.winningStreak.blue++;
            window.winningStreak.red = 0;
            bluePlayers.forEach(function (eachPlayer: PlayerObject) {
                window.playerList.get(eachPlayer.id).stats.wins++; //records a win
            });
        }
        gamePlayers.forEach(function (eachPlayer: PlayerObject) {
            // records a game count
            window.playerList.get(eachPlayer.id).stats.totals++;
            setPlayerData(window.playerList.get(eachPlayer.id)); // updates wins and totals count
        });
        if (window.winningStreak.red >= 3 || window.winningStreak.blue >= 3) {
            placeholderVictory.streakTeamName = window.winningStreak.getName();
            placeholderVictory.streakTeamCount = window.winningStreak.getCount();
            window.room.sendAnnouncement(Tst.maketext(LangRes.onVictory.burning, placeholderVictory), null, 0x00FF00, "bold", 1);
        }
    }

    window.ballStack.initTouchInfo(); // clear touch info
    window.ballStack.clear(); // clear the stack.
    window.ballStack.possClear(); // clear possession count

    window.logger.i(`The game has ended. Scores ${scores.red}:${scores.blue}.`);
    window.room.sendAnnouncement(Tst.maketext(LangRes.onVictory.victory, placeholderVictory), null, 0x00FF00, "bold", 1);

    setDefaultStadiums(); // check number of players and auto-set stadium
}