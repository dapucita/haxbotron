import { getUnixTimestamp } from "../Statistics";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import * as LangRes from "../../resource/strings";
import * as Tst from "../Translator";

export function cmdMute(byPlayer: PlayerObject, message?: string): void {
    if(window.gameRoom.playerList.get(byPlayer.id)!.admin == true) {
        if(message !== undefined && message.charAt(0) == "#") {
            let target: number = parseInt(message.substr(1), 10);
            if(isNaN(target) != true && window.gameRoom.playerList.has(target) == true) {
                var placeholder = {
                    targetName: window.gameRoom.playerList.get(target)!.name
                    ,ticketTarget: target
                }
                if(window.gameRoom.playerList.get(target)!.permissions.mute === true) {
                    window.gameRoom.playerList.get(target)!.permissions.mute = false; //unmute
                    window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.command.mute.successUnmute, placeholder), null, 0x479947, "normal", 1);
                } else {
                    const mutedTimeStamp: number = getUnixTimestamp(); //get timestamp
                    if(window.gameRoom.config.settings.antiMuteAbusing === true) { //when anti abusing option is enabled, check the condition by compare time
                        if(mutedTimeStamp > window.gameRoom.playerList.get(target)!.permissions.muteExpire + window.gameRoom.config.settings.muteAllowIntervalMillisecs) {
                            window.gameRoom.playerList.get(target)!.permissions.mute = true; //mute
                            window.gameRoom.playerList.get(target)!.permissions.muteExpire = mutedTimeStamp + window.gameRoom.config.settings.muteDefaultMillisecs; //record mute expiration date by unix timestamp
                            window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.command.mute.successMute, placeholder), null, 0x479947, "normal", 1);
                        } else {
                            // if mute again in too short time
                            window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.command.mute.muteAbusingWarn, placeholder), byPlayer.id, 0xFF7777, "normal", 2);
                        }
                    } else { //if anti abusing option is disabled, just mute it directly
                        window.gameRoom.playerList.get(target)!.permissions.mute = true; //mute
                        window.gameRoom.playerList.get(target)!.permissions.muteExpire = mutedTimeStamp; //record mute expiration date by unix timestamp
                        window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.command.mute.successMute, placeholder), null, 0x479947, "normal", 1);
                    }
                }

                window._emitSIOPlayerStatusChangeEvent(byPlayer.id);
            } else {
                window.gameRoom._room.sendAnnouncement(LangRes.command.mute._ErrorNoPlayer, byPlayer.id, 0xFF7777, "normal", 2);
            }
        } else {
            window.gameRoom._room.sendAnnouncement(LangRes.command.mute._ErrorNoPlayer, byPlayer.id, 0xFF7777, "normal", 2);
        }
    } else {
        window.gameRoom._room.sendAnnouncement(LangRes.command.mute._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 2);
    }
}
