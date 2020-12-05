import { PlayerObject } from "../../model/PlayerObject";
import { gameRule } from "../../model/rules/rule";
import { TeamID } from "../../model/TeamID";
import * as BotSettings from "../../resources/settings.json";
import * as LangRes from "../../resources/strings";
import { roomActivePlayersNumberCheck } from "../RoomTools";
import * as Tst from "../Translator";

export function cmdAfk(byPlayer: PlayerObject, message?: string): void {
    var placeholder = {
        targetName: byPlayer.name
        ,ticketTarget: byPlayer.id
        ,targetAfkReason: ''
        ,gameRuleNeedMin: gameRule.requisite.minimumPlayers,
    }
    if (window.playerList.get(byPlayer.id)!.permissions.afkmode === true) {
        if(window.isGamingNow === true && BotSettings.antiAFKAbusing === true) {
            // if inGame, prevent AFK abusing
            window.room.sendAnnouncement(LangRes.antitrolling.afkAbusing.cannotReason, byPlayer.id, 0xFF7777, "normal", 2); //warn
            return; //abort this event
        }

        window.playerList.get(byPlayer.id)!.permissions.afkmode = false; // return to active mode
        window.playerList.get(byPlayer.id)!.permissions.afkreason = ''; // init
        window.playerList.get(byPlayer.id)!.afktrace = { exemption: false, count: 0 }; // reset for afk trace
        
        if(BotSettings.antiAFKFlood === true && window.playerList.get(byPlayer.id)!.permissions.mute === true) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.unAfk, placeholder), byPlayer.id, 0x479947, "normal", 1);
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.muteNotifyWarn, placeholder), byPlayer.id, 0xFF7777, "normal", 2);
        } else {
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.unAfk, placeholder), null, 0x479947, "normal", 1);
        }
    } else {
        window.room.setPlayerTeam(byPlayer.id, TeamID.Spec); // Moves this player to Spectators team.
        window.room.setPlayerAdmin(byPlayer.id, false); // disqulify admin permission
        window.playerList.get(byPlayer.id)!.admin = false;
        window.playerList.get(byPlayer.id)!.permissions.afkmode = true; // set afk mode
        window.playerList.get(byPlayer.id)!.afktrace = { exemption: false, count: 0}; // reset for afk trace

        if(message !== undefined) { // if the reason is not skipped
            window.playerList.get(byPlayer.id)!.permissions.afkreason = message; // set reason
            placeholder.targetAfkReason = message; // update placeholder
        }
        
        if(BotSettings.antiAFKFlood === true && window.playerList.get(byPlayer.id)!.permissions.mute === true) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.setAfk, placeholder), byPlayer.id, 0x479947, "normal", 1);
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.muteNotifyWarn, placeholder), byPlayer.id, 0xFF7777, "normal", 2);
        } else {
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.setAfk, placeholder), null, 0x479947, "normal", 1);
        }
    }
    // check number of players and change game mode
    if (gameRule.statsRecord === true && roomActivePlayersNumberCheck() >= gameRule.requisite.minimumPlayers) {
        if (window.isStatRecord !== true) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.startRecord, placeholder), null, 0x00FF00, "normal", 0);
            window.isStatRecord = true;
        }
    } else {
        if (window.isStatRecord !== false) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.stopRecord, placeholder), null, 0x00FF00, "normal", 0);
            window.isStatRecord = false;
        }
    }
}