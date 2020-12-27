import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { roomActivePlayersNumberCheck, updateAdmins } from "../RoomTools";
import { setPlayerData } from "../Storage";
import { getUnixTimestamp } from "../Statistics";
import { TeamID } from "../../model/GameObject/TeamID";

export function onPlayerLeaveListener(player: PlayerObject): void {
    // Event called when a player leaves the room.

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
        streakTeamName: window.winningStreak.getName(),
        streakTeamCount: window.winningStreak.getCount()
    };

    window.logger.i(`${player.name}#${player.id} has left.`);

    // check number of players joined and change game mode
    if (window.settings.game.rule.statsRecord === true && roomActivePlayersNumberCheck() >= window.settings.game.rule.requisite.minimumPlayers) {
        if (window.isStatRecord !== true) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.onLeft.startRecord, placeholderLeft), null, 0x00FF00, "normal", 0);
            window.isStatRecord = true;
        }
    } else {
        if (window.isStatRecord !== false) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.onLeft.stopRecord, placeholderLeft), null, 0x00FF00, "normal", 0);
            window.isStatRecord = false;
        }
    }

    window.playerList.get(player.id)!.entrytime.leftDate = getUnixTimestamp(); // save left time
    setPlayerData(window.playerList.get(player.id)!); // save
    window.playerList.delete(player.id); // delete from player list

    if(window.settings.game.rule.autoAdmin === true) { // if auto admin option is enabled
        updateAdmins(); // update admin
    }
}
