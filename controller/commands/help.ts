import { PlayerObject } from "../../model/GameObject/PlayerObject";
import * as LangRes from "../../resources/strings";

export function cmdHelp(byPlayer: PlayerObject, message?: string): void {
    if(message !== undefined) {
        switch(message) {
            case "about": {
                window.room.sendAnnouncement(LangRes.command.helpman.about, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "help": {
                window.room.sendAnnouncement(LangRes.command.helpman.help, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "stats": {
                window.room.sendAnnouncement(LangRes.command.helpman.stats, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "statsreset": {
                window.room.sendAnnouncement(LangRes.command.helpman.statsreset, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "streak": {
                window.room.sendAnnouncement(LangRes.command.helpman.streak, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "scout": {
                window.room.sendAnnouncement(LangRes.command.helpman.scout, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "poss": {
                window.room.sendAnnouncement(LangRes.command.helpman.poss, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "afk": {
                window.room.sendAnnouncement(LangRes.command.helpman.afk, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "list": {
                window.room.sendAnnouncement(LangRes.command.helpman.list, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "freeze": {
                window.room.sendAnnouncement(LangRes.command.helpman.freeze, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "mute": {
                window.room.sendAnnouncement(LangRes.command.helpman.mute, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "admin": {
                window.room.sendAnnouncement(LangRes.command.helpadmin, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            default: {
                window.room.sendAnnouncement(LangRes.command.helpman._ErrorWrongMan, byPlayer.id, 0xFF7777, "normal", 2);
                break;
            }
        }
    } else {
        window.room.sendAnnouncement(LangRes.command.help, byPlayer.id, 0x479947, "normal", 1);
    }
}