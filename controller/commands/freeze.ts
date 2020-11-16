import { PlayerObject } from "../../model/PlayerObject";
import * as LangRes from "../../resources/strings";

export function cmdFreeze(byPlayer: PlayerObject): void {
    if(window.playerList.get(byPlayer.id).admin == true) {
        if(window.isMuteAll == true) {
            window.isMuteAll = false; //off
            window.room.sendAnnouncement(LangRes.command.freeze.offFreeze, null, 0x479947, "normal", 1);
        } else {
            window.isMuteAll = true; //on
            window.room.sendAnnouncement(LangRes.command.freeze.onFreeze, null, 0x479947, "normal", 1);
        }
    } else {
        window.room.sendAnnouncement(LangRes.command.freeze._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 2);
    }
}