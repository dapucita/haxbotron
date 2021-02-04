import * as LangRes from "../resource/strings";
import { PlayerObject } from "../model/GameObject/PlayerObject";
import { cmdAbout } from "./commands/about";
import { cmdHelp } from "./commands/help";
import { cmdStats } from "./commands/stats";
import { cmdStreak } from "./commands/streak";
import { cmdStatsReset } from "./commands/statsreset";
import { cmdScout } from "./commands/scout";
import { cmdPoss } from "./commands/poss";
import { cmdAfk } from "./commands/afk";
import { cmdList } from "./commands/list";
import { cmdFreeze } from "./commands/freeze";
import { cmdMute } from "./commands/mute";
import { cmdVote } from "./commands/vote";
import { cmdSuper } from "./commands/super";
import { cmdTier } from "./commands/tier";

// if given string is command chat, this function returns true, nor false.
export function isCommandString(message: string): boolean {
    if(message.charAt(0) == window.gameRoom.config.commands._commandPrefix) {
        // If message has prefix signature (default: !) as first character in it's string, return true.
        return true;
    } else {
        return false;
    }
}

// divide into 3 parts by sperator. !COMMAND FIRST-ARG SECOND-ARG
export function getCommandChunk(message: string): string[] { 
    return message.split(" ", 3);
}

// parse command message and excute it (need to check if it's command)
export function parseCommand(byPlayer: PlayerObject, message: string): void {
    let msgChunk: string[] = getCommandChunk(message);
    let commandSign: string = msgChunk[0].substring(1); // remove prefix character(default: !)
    if(window.gameRoom.config.commands._disabledCommandList?.includes(commandSign) === true) { // if this command is in disabled list
        window.gameRoom._room.sendAnnouncement(LangRes.command._ErrorDisabled, byPlayer.id, 0xFF7777, "normal", 2); // notify
        return; // exit this function
    }
    switch(commandSign) {
        case window.gameRoom.config.commands.help: {
            if(msgChunk[1] !== undefined) {
                cmdHelp(byPlayer, msgChunk[1]);
            } else {
                cmdHelp(byPlayer);
            }
            break;
        }
        case window.gameRoom.config.commands.about: {
            cmdAbout(byPlayer);
            break;
        }
        case window.gameRoom.config.commands.stats: {
            if(msgChunk[1] !== undefined) {
                cmdStats(byPlayer, msgChunk[1]);
            } else {
                cmdStats(byPlayer);
            }
            break;
        }
        case window.gameRoom.config.commands.statsreset: {
            cmdStatsReset(byPlayer);
            break;
        }
        case window.gameRoom.config.commands.streak: {
            cmdStreak(byPlayer);
            break;
        }
        case window.gameRoom.config.commands.scout: {
            cmdScout(byPlayer);
            break;
        }
        case window.gameRoom.config.commands.poss: {
            cmdPoss(byPlayer);
            break;
        }
        case window.gameRoom.config.commands.afk: {
            if(msgChunk[1] !== undefined) {
                cmdAfk(byPlayer, msgChunk[1]);
            } else {
                cmdAfk(byPlayer);
            }
            break;
        }
        case window.gameRoom.config.commands.list: {
            if(msgChunk[1] !== undefined) {
                cmdList(byPlayer, msgChunk[1]);
            } else {
                cmdList(byPlayer);
            }
            break;
        }
        case window.gameRoom.config.commands.freeze: {
            cmdFreeze(byPlayer);
            break;
        }
        case window.gameRoom.config.commands.mute: {
            if(msgChunk[1] !== undefined) {
                cmdMute(byPlayer, msgChunk[1]);
            } else {
                cmdMute(byPlayer);
            }
            break;
        }
        case window.gameRoom.config.commands.vote: {
            if(msgChunk[1] !== undefined) {
                cmdVote(byPlayer, msgChunk[1]);
            } else {
                cmdVote(byPlayer);
            }
            break;
        }
        case window.gameRoom.config.commands.tier: {
            cmdTier(byPlayer);
            break;
        }
        case window.gameRoom.config.commands.super: {
            if(msgChunk[1] !== undefined) {
                if(msgChunk[2] !== undefined) {
                    cmdSuper(byPlayer, msgChunk[1], msgChunk[2]);
                } else {
                    cmdSuper(byPlayer, msgChunk[1]);
                }
            } else {
                cmdSuper(byPlayer);
            }
            break;
        }
        default: {
            window.gameRoom._room.sendAnnouncement(LangRes.command._ErrorWrongCommand, byPlayer.id, 0xFF7777, "normal", 2);
            break;
        }
    }
}
