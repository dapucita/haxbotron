import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { gameRule } from "../../model/GameRules/captain.rule";
import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import * as Ban from "../Ban";
import * as BotSettings from "../../resources/settings.json";
import { getUnixTimestamp } from "../Statistics";
import { AdminKickTrace } from "../../model/PlayerBan/AdminKickTrace";
import { TeamID } from "../../model/GameObject/TeamID";

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
        possTeamRed: window.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.ballStack.possCalculate(TeamID.Blue),
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
            if (window.playerList.get(byPlayer.id)!.permissions.superadmin == false) { // FIXME: Error caught when banned myself-TypeError: Cannot read property 'permissions' of undefined 
                // if the player who acted banning is not super admin
                window.room.sendAnnouncement(Tst.maketext(LangRes.onKick.cannotBan, placeholderKick), byPlayer.id, 0xFF0000, "bold", 2);
                window.room.sendAnnouncement(Tst.maketext(LangRes.onKick.notifyNotBan, placeholderKick), null, 0xFF0000, "bold", 1);
                window.room.clearBan(kickedPlayer.id); // Clears the ban for a playerId that belonged to a player that was previously banned.
                window.logger.i(`${kickedPlayer.name}#${kickedPlayer.id} has been banned by ${byPlayer.name}#${byPlayer.id} (reason:${placeholderKick.reason}), but it is negated.`);
                if (BotSettings.antiBanNoPermission === true) {
                    // if this player has banned other player without permission (when is not superadmin)
                    //byPlayer.conn doens't works so use windows.playerList
                    Ban.bListAdd({ conn: window.playerList.get(byPlayer.id)!.conn, reason: LangRes.antitrolling.banNoPermission.banReason, register: kickedTime, expire: kickedTime + BotSettings.banNoPermissionBanMillisecs }); // register into ban list
                    window.room.kickPlayer(byPlayer.id, LangRes.antitrolling.banNoPermission.banReason, false); // auto kick (fixed-term ban)
                }
            } else { // if by super admin player
                Ban.bListAdd({ conn: kickedPlayer.conn, reason: placeholderKick.reason, register: kickedTime, expire: -1 }); // register into ban list
                window.logger.i(`${kickedPlayer.name}#${kickedPlayer.id} has been banned by ${byPlayer.name}#${byPlayer.id}. (reason:${placeholderKick.reason}).`);
            }
        } else { // kick
            window.logger.i(`${kickedPlayer.name}#${kickedPlayer.id} has been kicked by ${byPlayer.name}#${byPlayer.id}. (reason:${placeholderKick.reason})`);

            //check kick limitation
            if (BotSettings.antiPlayerKickAbusing === true) {
                // find exist record or create
                let fieldIndex: number = window.antiPlayerKickAbusingCount.findIndex(field => field.id === byPlayer.id);
                if (fieldIndex === -1) {
                    window.antiPlayerKickAbusingCount.push({ id: byPlayer.id, count: 0, register: kickedTime }); //create
                } else {
                    if (kickedTime - window.antiPlayerKickAbusingCount[fieldIndex].register < BotSettings.playerKickIntervalMillisecs) { //if abusing
                        window.antiPlayerKickAbusingCount[fieldIndex].count++; //update
                    } else {
                        window.antiPlayerKickAbusingCount[fieldIndex].count = 0; //clear count
                    }
                    window.antiPlayerKickAbusingCount[fieldIndex].register = kickedTime;
                    //check limit
                    if (window.antiPlayerKickAbusingCount[fieldIndex].count > BotSettings.playerKickAllowLimitation) {
                        Ban.bListAdd({ conn: window.playerList.get(byPlayer.id)!.conn, reason: LangRes.antitrolling.kickAbusing.banReason, register: kickedTime, expire: kickedTime + BotSettings.playerKickAbusingBanMillisecs }); // register into ban list
                        window.room.kickPlayer(byPlayer.id, LangRes.antitrolling.kickAbusing.banReason, false); // auto kick (fixed-term ban)
                    } else {
                        window.room.sendAnnouncement(LangRes.antitrolling.kickAbusing.abusingWarning, byPlayer.id, 0xFF0000, "bold", 2); //warn
                    }
                }
            }
        }
    } else {
        if (ban == true) { // ban
            Ban.bListAdd({ conn: kickedPlayer.conn, reason: placeholderKick.reason, register: kickedTime, expire: -1 }); // register into ban list
        }
        window.logger.i(`${kickedPlayer.name}#${kickedPlayer.id} has been kicked. (ban:${ban},reason:${placeholderKick.reason})`);
    }
}