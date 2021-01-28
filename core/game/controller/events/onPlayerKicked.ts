import * as Tst from "../Translator";
import * as LangRes from "../../resource/strings";
import * as BotSettings from "../../resource/settings.json";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { getUnixTimestamp } from "../Statistics";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { setBanlistDataToDB } from "../Storage";

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
        gameRuleName: window.gameRoom.config.rules.ruleName,
        gameRuleLimitTime: window.gameRoom.config.rules.requisite.timeLimit,
        gameRuleLimitScore: window.gameRoom.config.rules.requisite.scoreLimit,
        gameRuleNeedMin: window.gameRoom.config.rules.requisite.minimumPlayers,
        possTeamRed: window.gameRoom.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.gameRoom.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.gameRoom.winningStreak.teamID),
        streakTeamCount: window.gameRoom.winningStreak.count
    };
    if (reason !== null) {
        placeholderKick.reason = reason;
    }
    if (byPlayer !== null && byPlayer.id != 0) {
        placeholderKick.kickerID = byPlayer.id;
        placeholderKick.kickerName = byPlayer.name;
        if (ban == true) { // ban
            if (window.gameRoom.playerList.get(byPlayer.id)!.permissions.superadmin == false) { // FIXME: Error caught when banned myself-TypeError: Cannot read property 'permissions' of undefined 
                // if the player who acted banning is not super admin
                window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.onKick.cannotBan, placeholderKick), byPlayer.id, 0xFF0000, "bold", 2);
                window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.onKick.notifyNotBan, placeholderKick), null, 0xFF0000, "bold", 1);
                window.gameRoom._room.clearBan(kickedPlayer.id); // Clears the ban for a playerId that belonged to a player that was previously banned.
                window.gameRoom.logger.i(`${kickedPlayer.name}#${kickedPlayer.id} has been banned by ${byPlayer.name}#${byPlayer.id} (reason:${placeholderKick.reason}), but it is negated.`);
                if (BotSettings.antiBanNoPermission === true) {
                    // if this player has banned other player without permission (when is not superadmin)
                    //byPlayer.conn doens't works so use windows.playerList
                    setBanlistDataToDB({ conn: window.gameRoom.playerList.get(byPlayer.id)!.conn, reason: LangRes.antitrolling.banNoPermission.banReason, register: kickedTime, expire: kickedTime + BotSettings.banNoPermissionBanMillisecs }); // register into ban list
                    window.gameRoom._room.kickPlayer(byPlayer.id, LangRes.antitrolling.banNoPermission.banReason, false); // auto kick (fixed-term ban)
                }
            } else { // if by super admin player
                setBanlistDataToDB({ conn: kickedPlayer.conn, reason: placeholderKick.reason, register: kickedTime, expire: -1 }); // register into ban list
                window.gameRoom.logger.i(`${kickedPlayer.name}#${kickedPlayer.id} has been banned by ${byPlayer.name}#${byPlayer.id}. (reason:${placeholderKick.reason}).`);
            }
        } else { // kick
            window.gameRoom.logger.i(`${kickedPlayer.name}#${kickedPlayer.id} has been kicked by ${byPlayer.name}#${byPlayer.id}. (reason:${placeholderKick.reason})`);

            //check kick limitation
            if (BotSettings.antiPlayerKickAbusing === true) {
                // find exist record or create
                let fieldIndex: number = window.gameRoom.antiPlayerKickAbusingCount.findIndex(field => field.id === byPlayer.id);
                if (fieldIndex === -1) {
                    window.gameRoom.antiPlayerKickAbusingCount.push({ id: byPlayer.id, count: 0, register: kickedTime }); //create
                } else {
                    if (kickedTime - window.gameRoom.antiPlayerKickAbusingCount[fieldIndex].register < BotSettings.playerKickIntervalMillisecs) { //if abusing
                        window.gameRoom.antiPlayerKickAbusingCount[fieldIndex].count++; //update
                    } else {
                        window.gameRoom.antiPlayerKickAbusingCount[fieldIndex].count = 0; //clear count
                    }
                    window.gameRoom.antiPlayerKickAbusingCount[fieldIndex].register = kickedTime;
                    //check limit
                    if (window.gameRoom.antiPlayerKickAbusingCount[fieldIndex].count > BotSettings.playerKickAllowLimitation) {
                        setBanlistDataToDB({ conn: window.gameRoom.playerList.get(byPlayer.id)!.conn, reason: LangRes.antitrolling.kickAbusing.banReason, register: kickedTime, expire: kickedTime + BotSettings.playerKickAbusingBanMillisecs }); // register into ban list
                        window.gameRoom._room.kickPlayer(byPlayer.id, LangRes.antitrolling.kickAbusing.banReason, false); // auto kick (fixed-term ban)
                    } else {
                        window.gameRoom._room.sendAnnouncement(LangRes.antitrolling.kickAbusing.abusingWarning, byPlayer.id, 0xFF0000, "bold", 2); //warn
                    }
                }
            }
        }
    } else {
        if (ban == true) { // ban
            setBanlistDataToDB({ conn: kickedPlayer.conn, reason: placeholderKick.reason, register: kickedTime, expire: -1 }); // register into ban list
        }
        window.gameRoom.logger.i(`${kickedPlayer.name}#${kickedPlayer.id} has been kicked. (ban:${ban},reason:${placeholderKick.reason})`);
    }
}
