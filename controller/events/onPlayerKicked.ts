import { PlayerObject } from "../../model/PlayerObject";
import { gameRule } from "../../model/rules/rule";
import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import * as Ban from "../Ban";
import * as BotSettings from "../../resources/settings.json";
import { getUnixTimestamp } from "../Statistics";

export function onPlayerKickedListener(kickedPlayer: PlayerObject, reason: string, ban: boolean, byPlayer: PlayerObject): void {
    /* Event called when a player has been kicked from the room. This is always called after the onPlayerLeave event.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
    let kickedTime: number = getUnixTimestamp();
    var placeholderKick = { 
        kickedID: kickedPlayer.id,
        kickedName: kickedPlayer.name,
        kickerID: 0,
        kickerName: '',
        reason: 'by bot',
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
    if (reason !== null) {
        placeholderKick.reason = reason;
    }
    if (byPlayer !== null && byPlayer.id != 0) {
        placeholderKick.kickerID = byPlayer.id;
        placeholderKick.kickerName = byPlayer.name;
        if (ban == true) { // ban
            if (window.playerList.get(byPlayer.id).permissions.superadmin == false) { // FIXME: Error caught-TypeError: Cannot read property 'permissions' of undefined 
                // if the player who acted banning is not super admin
                window.room.sendAnnouncement(Tst.maketext(LangRes.onKick.cannotBan, placeholderKick), byPlayer.id, 0xFF0000, "bold", 2);
                window.room.sendAnnouncement(Tst.maketext(LangRes.onKick.notifyNotBan, placeholderKick), null, 0xFF0000, "bold", 1);
                window.room.clearBan(kickedPlayer.id); // Clears the ban for a playerId that belonged to a player that was previously banned.
                window.logger.i(`${kickedPlayer.name}#${kickedPlayer.id} has been banned by ${byPlayer.name}#${byPlayer.id} (reason:${placeholderKick.reason}), but it is negated.`);
                if(BotSettings.antiBanNoPermission === true) {
                    // if this player has banned other player without permission (when is not superadmin)
                    window.room.kickPlayer(byPlayer.id, LangRes.antitrolling.banNoPermission.banReason, false); // auto kick (fixed-term ban)
                    Ban.bListAdd({ conn: byPlayer.conn, reason: LangRes.antitrolling.banNoPermission.banReason, register: kickedTime, expire: kickedTime + BotSettings.banNoPermissionBanMillisecs }); // register into ban list
                }
            } else { // if by super admin player
                Ban.bListAdd({ conn: kickedPlayer.conn, reason: placeholderKick.reason, register: kickedTime, expire: -1 }); // register into ban list
                window.logger.i(`${kickedPlayer.name}#${kickedPlayer.id} has been banned by ${byPlayer.name}#${byPlayer.id}. (reason:${placeholderKick.reason}).`);
            }
        } else {
            // kick
            window.logger.i(`${kickedPlayer.name}#${kickedPlayer.id} has been kicked by ${byPlayer.name}#${byPlayer.id}. (reason:${placeholderKick.reason})`);
        }
    } else {
        if (ban == true) { // ban
            Ban.bListAdd({ conn: kickedPlayer.conn, reason: placeholderKick.reason, register: kickedTime, expire: -1 }); // register into ban list
        }
        window.logger.i(`${kickedPlayer.name}#${kickedPlayer.id} has been kicked. (ban:${ban},reason:${placeholderKick.reason})`);
    }
}