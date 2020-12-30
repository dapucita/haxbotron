import { getUnixTimestamp } from "../Statistics";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import * as LangRes from "../../resources/strings";
import * as Tst from "../Translator";
import * as BotSettings from "../../resources/settings.json";

export function cmdMute(byPlayer: PlayerObject, message?: string): void {
    if(window.playerList.get(byPlayer.id)!.admin == true) {
        if(message !== undefined && message.charAt(0) == "#") {
            let target: number = parseInt(message.substr(1), 10);
            if(isNaN(target) != true && window.playerList.has(target) == true) {
                var placeholder = {
                    targetName: window.playerList.get(target)!.name
                    ,ticketTarget: target
                }
                if(window.playerList.get(target)!.permissions.mute === true) {
                    window.playerList.get(target)!.permissions.mute = false; //unmute
                    window.room.sendAnnouncement(Tst.maketext(LangRes.command.mute.successUnmute, placeholder), null, 0x479947, "normal", 1);
                } else {
                    const mutedTimeStamp: number = getUnixTimestamp(); //get timestamp
                    if(BotSettings.antiMuteAbusing === true) { //when anti abusing option is enabled, check the condition by compare time
                        if(mutedTimeStamp > window.playerList.get(target)!.permissions.muteExpire + BotSettings.muteAllowIntervalMillisecs) {
                            window.playerList.get(target)!.permissions.mute = true; //mute
                            window.playerList.get(target)!.permissions.muteExpire = mutedTimeStamp + BotSettings.muteDefaultMillisecs; //record mute expiration date by unix timestamp
                            window.room.sendAnnouncement(Tst.maketext(LangRes.command.mute.successMute, placeholder), null, 0x479947, "normal", 1);
                        } else {
                            // if mute again in too short time
                            window.room.sendAnnouncement(Tst.maketext(LangRes.command.mute.muteAbusingWarn, placeholder), byPlayer.id, 0xFF7777, "normal", 2);
                        }
                    } else { //if anti abusing option is disabled, just mute it directly
                        window.playerList.get(target)!.permissions.mute = true; //mute
                        window.playerList.get(target)!.permissions.muteExpire = mutedTimeStamp; //record mute expiration date by unix timestamp
                        window.room.sendAnnouncement(Tst.maketext(LangRes.command.mute.successMute, placeholder), null, 0x479947, "normal", 1);
                    }
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
