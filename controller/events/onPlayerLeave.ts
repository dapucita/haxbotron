import { PlayerObject } from "../../model/PlayerObject";
import { gameRule } from "../../model/rules/rule";
import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import { roomPlayersNumberCheck, updateAdmins } from "../RoomTools";
import * as Ban from "../Ban";
import { setPlayerData } from "../Storage";
import { getUnixTimestamp } from "../Statistics";

export function onPlayerLeaveListener(player: PlayerObject): void {
    // Event called when a player leaves the room.

    if (window.playerList.has(player.id) == false) { // if the player wasn't registered in playerList
        return; // exit this event
    }

    var placeholderLeft = { // Parser.maketext(str, placeholder)
        playerID: player.id,
        playerName: player.name,
        playerStatsTotal: window.playerList.get(player.id).stats.totals,
        playerStatsWins: window.playerList.get(player.id).stats.wins,
        playerStatsGoals: window.playerList.get(player.id).stats.goals,
        playerStatsAssists: window.playerList.get(player.id).stats.assists,
        playerStatsOgs: window.playerList.get(player.id).stats.ogs,
        playerStatsLosepoints: window.playerList.get(player.id).stats.losePoints,
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

    window.logger.i(`${player.name}#${player.id} has left.`);

    // check number of players joined and change game mode
    if (gameRule.statsRecord == true && roomPlayersNumberCheck() >= gameRule.requisite.minimumPlayers) {
        if (window.isStatRecord != true) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.onLeft.startRecord, placeholderLeft), null, 0x00FF00, "normal", 0);
            window.isStatRecord = true;
        }
    } else {
        if (window.isStatRecord != false) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.onLeft.stopRecord, placeholderLeft), null, 0x00FF00, "normal", 0);
            window.isStatRecord = false;
        }
    }

    window.playerList.get(player.id).entrytime.leftDate = getUnixTimestamp(); // save left time
    setPlayerData(window.playerList.get(player.id)); // save
    window.playerList.delete(player.id); // delete from player list

    updateAdmins(); // update admin
}