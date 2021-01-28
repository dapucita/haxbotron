import * as LangRes from "../../resource/strings";
import * as CommandSet from "../../resource/command.json";
import { PlayerObject } from "../../model/GameObject/PlayerObject";

export function cmdHelp(byPlayer: PlayerObject, message?: string): void {
    if(message !== undefined) {
        switch(message) {
            case CommandSet._helpManabout: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman.about, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManhelp: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman.help, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManstats: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman.stats, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManstatsreset: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman.statsreset, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManstreak: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman.streak, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManscout: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman.scout, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManposs: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman.poss, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManafk: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman.afk, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManlist: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman.list, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManfreeze: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman.freeze, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManmute: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman.mute, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManadmin: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpadmin, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpManvote: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman.vote, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._helpMantier: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman.tier, byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            default: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.helpman._ErrorWrongMan, byPlayer.id, 0xFF7777, "normal", 2);
                break;
            }
        }
    } else {
        window.gameRoom._room.sendAnnouncement(LangRes.command.help, byPlayer.id, 0x479947, "normal", 1);
    }
}
