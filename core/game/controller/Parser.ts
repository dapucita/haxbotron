import * as LangRes from "../resource/strings";
import * as CommandSet from "../resource/command.json";
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
    if(message.charAt(0) == CommandSet._commandPrefix) {
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
    if(CommandSet._disabledCommandList.includes(commandSign) === true) { // if this command is in disabled list
        window.room.sendAnnouncement(LangRes.command._ErrorDisabled, byPlayer.id, 0xFF7777, "normal", 2); // notify
        return; // exit this function
    }
    switch(commandSign) {
        case CommandSet.help: {
            if(msgChunk[1] !== undefined) {
                cmdHelp(byPlayer, msgChunk[1]);
            } else {
                cmdHelp(byPlayer);
            }
            break;
        }
        case CommandSet.about: {
            cmdAbout(byPlayer);
            break;
        }
        case CommandSet.stats: {
            if(msgChunk[1] !== undefined) {
                cmdStats(byPlayer, msgChunk[1]);
            } else {
                cmdStats(byPlayer);
            }
            break;
        }
        case CommandSet.statsreset: {
            cmdStatsReset(byPlayer);
            break;
        }
        case CommandSet.streak: {
            cmdStreak(byPlayer);
            break;
        }
        case CommandSet.scout: {
            cmdScout(byPlayer);
            break;
        }
        case CommandSet.poss: {
            cmdPoss(byPlayer);
            break;
        }
        case CommandSet.afk: {
            if(msgChunk[1] !== undefined) {
                cmdAfk(byPlayer, msgChunk[1]);
            } else {
                cmdAfk(byPlayer);
            }
            break;
        }
        case CommandSet.list: {
            if(msgChunk[1] !== undefined) {
                cmdList(byPlayer, msgChunk[1]);
            } else {
                cmdList(byPlayer);
            }
            break;
        }
        case CommandSet.freeze: {
            cmdFreeze(byPlayer);
            break;
        }
        case CommandSet.mute: {
            if(msgChunk[1] !== undefined) {
                cmdMute(byPlayer, msgChunk[1]);
            } else {
                cmdMute(byPlayer);
            }
            break;
        }
        case CommandSet.vote: {
            if(msgChunk[1] !== undefined) {
                cmdVote(byPlayer, msgChunk[1]);
            } else {
                cmdVote(byPlayer);
            }
            break;
        }
        case CommandSet.tier: {
            cmdTier(byPlayer);
            break;
        }
        case CommandSet.super: {
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
            window.room.sendAnnouncement(LangRes.command._ErrorWrongCommand, byPlayer.id, 0xFF7777, "normal", 2);
            break;
        }
    }
}
