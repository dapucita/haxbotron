import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import { ScoresObject } from "../../model/GameObject/ScoresObject";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { setPlayerData } from "../Storage";
import { setDefaultStadiums } from "../RoomTools";
import { TeamID } from "../../model/GameObject/TeamID";

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
        streakTeamName: window.winningStreak.getName(),
        streakTeamCount: window.winningStreak.getCount()
    };

    window.isGamingNow = false; // turn off

    if (window.settings.game.rule.statsRecord == true && window.isStatRecord == true) { // records when game mode is for stats recording.
        var gamePlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.team !== TeamID.Spec); // except Spectators players
        var redPlayers: PlayerObject[] = gamePlayers.filter((player: PlayerObject) => player.team === TeamID.Red); // except non Red players
        var bluePlayers: PlayerObject[] = gamePlayers.filter((player: PlayerObject) => player.team === TeamID.Blue); // except non Blue players
        if (scores.red > scores.blue) {
            // if Red wins
            placeholderVictory.teamID = TeamID.Red;
            placeholderVictory.teamName = 'Red';
            window.winningStreak.red++;
            window.winningStreak.blue = 0;
            redPlayers.forEach(function (eachPlayer: PlayerObject) {
                window.playerList.get(eachPlayer.id)!.stats.wins++; //records a win
            });
        } else {
            // if Blue wins
            placeholderVictory.teamID = TeamID.Blue;
            placeholderVictory.teamName = 'Blue';
            window.winningStreak.blue++;
            window.winningStreak.red = 0;
            bluePlayers.forEach(function (eachPlayer: PlayerObject) {
                window.playerList.get(eachPlayer.id)!.stats.wins++; //records a win
            });
        }
        gamePlayers.forEach(function (eachPlayer: PlayerObject) {
            // records a game count
            window.playerList.get(eachPlayer.id)!.stats.totals++;
            setPlayerData(window.playerList.get(eachPlayer.id)!); // updates wins and totals count
        });
        if (window.winningStreak.red >= 3 || window.winningStreak.blue >= 3) {
            placeholderVictory.streakTeamName = window.winningStreak.getName();
            placeholderVictory.streakTeamCount = window.winningStreak.getCount();
            window.room.sendAnnouncement(Tst.maketext(LangRes.onVictory.burning, placeholderVictory), null, 0x00FF00, "bold", 1);
        }
    }
    
    window.logger.i(`The game has ended. Scores ${scores.red}:${scores.blue}.`);
    window.room.sendAnnouncement(Tst.maketext(LangRes.onVictory.victory, placeholderVictory), null, 0x00FF00, "bold", 1);
}
