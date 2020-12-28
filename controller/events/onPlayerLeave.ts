import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import * as BotSettings from "../../resources/settings.json";
import * as Ban from "../Ban";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { roomActivePlayersNumberCheck, updateAdmins } from "../RoomTools";
import { setPlayerData } from "../Storage";
import { getUnixTimestamp } from "../Statistics";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";

export function onPlayerLeaveListener(player: PlayerObject): void {
    // Event called when a player leaves the room.
    let leftTimeStamp: number = getUnixTimestamp();

    if (window.playerList.has(player.id) == false) { // if the player wasn't registered in playerList
        return; // exit this event
    }

    var placeholderLeft = { 
        playerID: player.id,
        playerName: player.name,
        playerStatsTotal: window.playerList.get(player.id)!.stats.totals,
        playerStatsWins: window.playerList.get(player.id)!.stats.wins,
        playerStatsGoals: window.playerList.get(player.id)!.stats.goals,
        playerStatsAssists: window.playerList.get(player.id)!.stats.assists,
        playerStatsOgs: window.playerList.get(player.id)!.stats.ogs,
        playerStatsLosepoints: window.playerList.get(player.id)!.stats.losePoints,
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

    window.logger.i(`${player.name}#${player.id} has left.`);

    // check number of players joined and change game mode
    let activePlayersNumber: number = roomActivePlayersNumberCheck();
    if (window.settings.game.rule.statsRecord === true && activePlayersNumber >= window.settings.game.rule.requisite.minimumPlayers) {
        if (window.isStatRecord === false) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.onLeft.startRecord, placeholderLeft), null, 0x00FF00, "normal", 0);
            window.isStatRecord = true;
        }
        // when auto emcee mode is enabled
        if(window.settings.game.rule.autoOperating === true && window.isGamingNow === true) {
            let specActivePlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && player.team === TeamID.Spec && window.playerList.get(player.id)!.permissions.afkmode === false);
            if(player.team !== TeamID.Spec && specActivePlayers.length >= 1) {
                window.room.setPlayerTeam(specActivePlayers[0].id, player.team); // put new player into the team this player has left
            }
        }
    } else {
        if (window.isStatRecord === true) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.onLeft.stopRecord, placeholderLeft), null, 0x00FF00, "normal", 0);
            window.isStatRecord = false;
            // when auto emcee mode is enabled and lack of players
            if(window.settings.game.rule.autoOperating === true && window.isGamingNow === true) window.room.stopGame(); // stop for start next new game
        }
    }

    // if anti abscond option is enabled
    if(BotSettings.antiGameAbscond === true) {
        // if this player is in match(team player), fixed-term ban this player
        if(player.team !== TeamID.Spec) {
            window.logger.i(`${player.name}#${player.id} has been added in fixed term ban list for abscond.`);
            Ban.bListAdd({ conn: window.playerList.get(player.id)!.conn, reason: LangRes.antitrolling.gameAbscond.banReason, register: leftTimeStamp, expire: leftTimeStamp + BotSettings.gameAbscondBanMillisecs });
        }
    }

    window.playerList.get(player.id)!.entrytime.leftDate = leftTimeStamp; // save left time
    setPlayerData(window.playerList.get(player.id)!); // save
    window.playerList.delete(player.id); // delete from player list

    if(window.settings.game.rule.autoAdmin === true) { // if auto admin option is enabled
        updateAdmins(); // update admin
    }
}
