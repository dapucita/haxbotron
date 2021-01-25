import * as LangRes from "../../resource/strings";
import * as CommandSet from "../../resource/command.json";
import { PlayerObject } from "../../model/GameObject/PlayerObject";

export function cmdHelp(byPlayer: PlayerObject, message?: string): void {
    if(message !== undefined) {
        switch(message) {
            case CommandSet._helpManabout: {
                window.room.sendAnnouncement(LangRes.command.helpman.about, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManhelp: {
                window.room.sendAnnouncement(LangRes.command.helpman.help, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManstats: {
                window.room.sendAnnouncement(LangRes.command.helpman.stats, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManstatsreset: {
                window.room.sendAnnouncement(LangRes.command.helpman.statsreset, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManstreak: {
                window.room.sendAnnouncement(LangRes.command.helpman.streak, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManscout: {
                window.room.sendAnnouncement(LangRes.command.helpman.scout, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManposs: {
                window.room.sendAnnouncement(LangRes.command.helpman.poss, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManafk: {
                window.room.sendAnnouncement(LangRes.command.helpman.afk, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManlist: {
                window.room.sendAnnouncement(LangRes.command.helpman.list, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManfreeze: {
                window.room.sendAnnouncement(LangRes.command.helpman.freeze, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManmute: {
                window.room.sendAnnouncement(LangRes.command.helpman.mute, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManadmin: {
                window.room.sendAnnouncement(LangRes.command.helpadmin, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManvote: {
                window.room.sendAnnouncement(LangRes.command.helpman.vote, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpMantier: {
                window.room.sendAnnouncement(LangRes.command.helpman.tier, byPlayer.id, 0x479947, "normal", 1);
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
