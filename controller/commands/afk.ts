import { PlayerObject } from "../../model/PlayerObject";
import * as LangRes from "../../resources/strings";
import * as Tst from "../Translator";

export function cmdAfk(byPlayer: PlayerObject, message?: string): void {
    var placeholder = {
        targetName: byPlayer.name
        ,ticketTarget: byPlayer.id
        ,targetAfkReason: ''
    }
    if (window.playerList.get(byPlayer.id).permissions.afkmode == true) {
        window.playerList.get(byPlayer.id).permissions.afkmode = false; // return to active mode
        window.playerList.get(byPlayer.id).permissions.afkreason = ''; // init
        window.playerList.get(byPlayer.id).afktrace = { exemption: false, count: 0 }; // reset for afk trace
        window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.unAfk, placeholder), null, 0x479947, "normal", 1);
    } else {
        window.room.setPlayerTeam(byPlayer.id, 0); // Moves this player to Spectators team.
        window.room.setPlayerAdmin(byPlayer.id, false); // disqulify admin permission
        window.playerList.get(byPlayer.id).admin = false;
        window.playerList.get(byPlayer.id).permissions.afkmode = true; // set afk mode
        window.playerList.get(byPlayer.id).afktrace = { exemption: false, count: 0}; // reset for afk trace
        if(message !== undefined) { // if the reason is not skipped
            window.playerList.get(byPlayer.id).permissions.afkreason = message; // set reason
            placeholder.targetAfkReason = message; // update placeholder
        }
        window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.setAfk, placeholder), null, 0x479947, "normal", 1);
    }
}