import * as LangRes from "../resources/strings";
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
import { cmdSuper } from "./commands/super";

// if given string is command chat, this function returns true, nor false.
export function isCommandString(message: string): boolean {
    if(message.charAt(0) == "!") {
        // If message has '!' as first character in it's string, return true.
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
export function parseCommand(byPlayer:PlayerObject, message: string): void {
    var msgChunk: string[] = getCommandChunk(message);
    switch(msgChunk[0]) {
        case "!help": {
            if(msgChunk[1] !== undefined) {
                cmdHelp(byPlayer, msgChunk[1]);
            } else {
                cmdHelp(byPlayer);
            }
            break;
        }
        case "!about": {
            cmdAbout(byPlayer);
            break;
        }
        case "!stats": {
            if(msgChunk[1] !== undefined) {
                cmdStats(byPlayer, msgChunk[1]);
            } else {
                cmdStats(byPlayer);
            }
            break;
        }
        case "!statsreset": {
            cmdStatsReset(byPlayer);
            break;
        }
        case "!streak": {
            cmdStreak(byPlayer);
            break;
        }
        case "!scout": {
            cmdScout(byPlayer);
            break;
        }
        case "!poss": {
            cmdPoss(byPlayer);
            break;
        }
        case "!afk": {
            if(msgChunk[1] !== undefined) {
                cmdAfk(byPlayer, msgChunk[1]);
            } else {
                cmdAfk(byPlayer);
            }
            break;
        }
        case "!list": {
            if(msgChunk[1] !== undefined) {
                cmdList(byPlayer, msgChunk[1]);
            } else {
                cmdList(byPlayer);
            }
            break;
        }
        case "!freeze": {
            cmdFreeze(byPlayer);
            break;
        }
        case "!mute": {
            if(msgChunk[1] !== undefined) {
                cmdMute(byPlayer, msgChunk[1]);
            } else {
                cmdMute(byPlayer);
            }
            break;
        }
        case "!super": {
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