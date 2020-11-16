import { PlayerObject } from "../../model/PlayerObject";
import * as LangRes from "../../resources/strings";
import * as Tst from "../Translator";

export function cmdMute(byPlayer: PlayerObject, message?: string): void {
    if(window.playerList.get(byPlayer.id).admin == true) {
        if(message !== undefined && message.charAt(0) == "#") {
            let target: number = parseInt(message.substr(1), 10);
            if(isNaN(target) != true && window.playerList.has(target) == true) {
                var placeholder = {
                    targetName: window.playerList.get(target).name
                    ,ticketTarget: target
                }
                if(window.playerList.get(target).permissions.mute == true) {
                    window.playerList.get(target).permissions.mute = false;
                    window.room.sendAnnouncement(Tst.maketext(LangRes.command.mute.successUnmute, placeholder), null, 0x479947, "normal", 1);
                } else {
                    window.playerList.get(target).permissions.mute = true;
                    window.room.sendAnnouncement(Tst.maketext(LangRes.command.mute.successMute, placeholder), null, 0x479947, "normal", 1);
                }
            } else {
                window.room.sendAnnouncement(LangRes.command.mute._ErrorNoPlayer, byPlayer.id, 0xFF7777, "normal", 2);
            }
        } else {
            window.room.sendAnnouncement(LangRes.command.mute._ErrorNoPlayer, byPlayer.id, 0xFF7777, "normal", 2);
        }
    } else {
        window.room.sendAnnouncement(LangRes.command.mute._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 2);
    }
}