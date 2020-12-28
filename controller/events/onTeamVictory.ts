import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import * as BotSettings from "../../resources/settings.json";
import { ScoresObject } from "../../model/GameObject/ScoresObject";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { setPlayerData } from "../Storage";
import { TeamID } from "../../model/GameObject/TeamID";
import { roomActivePlayersNumberCheck, shuffleArray } from "../RoomTools";

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

    window.isGamingNow = false; // turn off

    if (window.settings.game.rule.statsRecord == true && window.isStatRecord == true) { // records when game mode is for stats recording.
        teamPlayers.forEach((eachPlayer: PlayerObject) => {
            if(eachPlayer.team === winnerTeamID) { // if this player is winner
                window.playerList.get(eachPlayer.id)!.stats.wins++; //records a win
            }
            window.playerList.get(eachPlayer.id)!.stats.totals++; // records a game count
            setPlayerData(window.playerList.get(eachPlayer.id)!); // updates stats
        });

        if (scores.red > scores.blue) { // update streak count
            window.winningStreak.red++;
            window.winningStreak.blue = 0;
        } else {
            window.winningStreak.blue++;
            window.winningStreak.red = 0;
        }
        
        if (window.winningStreak.red >= 3 || window.winningStreak.blue >= 3) {
            placeholderVictory.streakTeamName = window.winningStreak.getName();
            placeholderVictory.streakTeamCount = window.winningStreak.getCount();
            window.room.sendAnnouncement(Tst.maketext(LangRes.onVictory.burning, placeholderVictory), null, 0x00FF00, "bold", 1);
        }
    }

    window.logger.i(`The game has ended. Scores ${scores.red}:${scores.blue}.`);
    window.room.sendAnnouncement(Tst.maketext(LangRes.onVictory.victory, placeholderVictory), null, 0x00FF00, "bold", 1);

    // when auto emcee mode is enabled
    if(window.settings.game.rule.autoOperating === true) {
        if(window.winningStreak.red >= BotSettings.rerollWinstreakCriterion || window.winningStreak.blue >= BotSettings.rerollWinstreakCriterion) {
            // if winning streak count has reached limit
            if(BotSettings.rerollWinStreak === true && roomActivePlayersNumberCheck() >= window.settings.game.rule.requisite.minimumPlayers ) {
                // if rerolling option is enabled, then reroll randomly
                window.winningStreak.red = 0; // init streak count
                window.winningStreak.blue = 0;

                // reroll randomly
                teamPlayers.forEach((eachPlayer: PlayerObject) => {
                    window.room.setPlayerTeam(eachPlayer.id, TeamID.Spec); // move all team players to spec
                });
                // get new spec player list
                let specActivePlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && player.team === TeamID.Spec && window.playerList.get(player.id)!.permissions.afkmode === false);
                let shuffledIDList: number[] = shuffleArray(specActivePlayers.map((eachPlayer: PlayerObject) => eachPlayer.id));
                window.room.reorderPlayers(shuffledIDList, true); // shuffle and reordering to top
                for(let i: number = 0; i < window.settings.game.rule.requisite.eachTeamPlayers; i++) {
                    window.room.setPlayerTeam(shuffledIDList[i], TeamID.Red); // move spec to Red team
                    window.room.setPlayerTeam(shuffledIDList[i+window.settings.game.rule.requisite.eachTeamPlayers], TeamID.Blue); // move spec to Blue team
                }
                window.room.sendAnnouncement(Tst.maketext(LangRes.onVictory.reroll, placeholderVictory), null, 0x00FF00, "bold", 1);
            }
        } else {
            // or still under the limit, then change spec and loser team
            teamPlayers.filter((player: PlayerObject) => player.team === loserTeamID).forEach((eachPlayer: PlayerObject) => {
                window.room.setPlayerTeam(eachPlayer.id, TeamID.Spec); // move losers to Spec team
            });
            // get new spec player list
            let specActivePlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && player.team === TeamID.Spec && window.playerList.get(player.id)!.permissions.afkmode === false);
            for(let i: number = 0; i < window.settings.game.rule.requisite.eachTeamPlayers; i++) {
                window.room.setPlayerTeam(specActivePlayers[i].id, loserTeamID); // move Specs to challenger team
            }
        }
    }
}
