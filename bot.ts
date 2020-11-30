// Haxbotron
// This is the main part of the bot

// import modules
import * as BotSettings from "./resources/settings.json";
import { RoomConfig } from "./model/RoomConfig";
import { Player } from "./model/Player";
import { Logger } from "./controller/Logger";
import { PlayerObject } from "./model/PlayerObject";
import { ScoresObject } from "./model/ScoresObject";
import { gameRule } from "./model/rules/rule";
import { KickStack } from "./model/BallTrace";
import * as LangRes from "./resources/strings";
import * as Ban from "./controller/Ban";
import { BanList } from "./model/BanList";
import * as eventListener from "./controller/events/eventListeners";
import * as Tst from "./controller/Translator";

window.logQueue = []; // init

const botRoomConfig: RoomConfig = JSON.parse(getCookieFromHeadless('botConfig'));

console.log("====");
console.log('\x1b[32m%s\x1b[0m', "H a x b o t r o n"); //green color
console.log("Haxbotron Debugging System on headless browser");
console.log(`The authentication token is conveyed via cookie(${botRoomConfig.token})`);
console.log("====");

window.playerList = new Map(); // playerList:Player[] is an Map object. // playerList.get(player.id).name; : usage for playerList

window.winningStreak = { // count of winning streak
    red: 0, blue: 0,
    getName: function(): string {
        if(this.red >= this.blue) { // include when the value is red 0, blue 0
            return "Red";
        } else {
            return "Blue";
        }
    },
    getCount: function(): number {
        if(this.red >= this.blue) { // include when the value is red 0, blue 0
            return this.red;
        } else {
            return this.blue;
        }
    }
};

window.ballStack = KickStack.getInstance();

window.logger = Logger.getInstance();

window.isStatRecord = false;
window.isGamingNow = false;
window.isMuteAll = false;

window.antiTrollingOgFloodCount = [];
window.antiTrollingChatFloodCount = [];
window.antiInsufficientStartAbusingCount = [];
window.antiPlayerKickAbusingCount = [];

window.room = window.HBInit(botRoomConfig);
initialiseRoom();

var scheduledTimer = setInterval(function(): void {
    var placeholderScheduler = {
        targetID: 0,
        targetName: '',
    }

    if(Math.random() < 0.25) {
        window.room.sendAnnouncement(Tst.maketext(LangRes.scheduler.advertise, placeholderScheduler), null, 0x777777, "normal", 0); // advertisement
    }

    window.playerList.forEach((player: Player) => { // afk detection system
        // init placeholder
        placeholderScheduler.targetID = player.id;
        placeholderScheduler.targetName = player.name;
        // check afk
        if(window.isGamingNow == true) { // if the game is in playing
            if(player.team != 0) { // if the player is not spectators(include afk mode)
                if(player.afktrace.count >= BotSettings.afkCountLimit) { // if the player's count is over than limit
                window.room.kickPlayer(player.id, Tst.maketext(LangRes.scheduler.afkKick, placeholderScheduler), false); // kick
                } else {
                    if(player.afktrace.count >= 1) { // only when the player's count is not 0(in activity)
                    window.room.sendAnnouncement(Tst.maketext(LangRes.scheduler.afkDetect, placeholderScheduler), player.id, 0xFF7777, "bold", 2); // warning for all
                    }
                    player.afktrace.count++; // add afk detection count
                }
            }
        } else {
            if(player.admin == true) { // if the player is admin
                if(player.afktrace.count >= BotSettings.afkCountLimit) { // if the player's count is over than limit
                    window.room.kickPlayer(player.id, Tst.maketext(LangRes.scheduler.afkKick, placeholderScheduler), false); // kick
                } else {
                    if(player.afktrace.count >= 1) { // only when the player's count is not 0(in activity)
                        window.room.sendAnnouncement(Tst.maketext(LangRes.scheduler.afkDetect, placeholderScheduler), player.id, 0xFF7777, "bold", 2); // warning for all
                    }
                    player.afktrace.count++; // add afk detection count
                }
            }
        }
    });
}, 15000); // by 15seconds

function initialiseRoom(): void {
    // Write initialising processes here.
    const nowDate: Date = new Date();
    localStorage.setItem('_LaunchTime', nowDate.toString()); // save time the bot launched in localStorage

    window.logger.i(`The game room is opened at ${nowDate.toString()}.`);

    window.logger.i(`The game mode is '${window.isGamingNow}' now(by default).`);

    // declare function in window object
    window.sendRoomChat = function(msg: string, playerID?: number): void {
        if(playerID !== null) {
            window.room.sendAnnouncement(msg, playerID, 0xFFFF84, "bold", 2);
        } else {
            window.room.sendAnnouncement(msg, null, 0xFFFF84, "bold", 2);
        }
    }

    window.room.setCustomStadium(gameRule.defaultMap);
    window.room.setScoreLimit(gameRule.requisite.scoreLimit);
    window.room.setTimeLimit(gameRule.requisite.timeLimit);
    window.room.setTeamsLock(gameRule.requisite.teamLock);

    // Linking Event Listeners
    window.room.onPlayerJoin = (player: PlayerObject): void => eventListener.onPlayerJoinListener(player);
    window.room.onPlayerLeave = (player: PlayerObject): void => eventListener.onPlayerLeaveListener(player);
    window.room.onTeamVictory = (scores: ScoresObject): void => eventListener.onTeamVictoryListener(scores);
    window.room.onPlayerChat = (player: PlayerObject, message: string): boolean => eventListener.onPlayerChatListener(player, message);
    window.room.onPlayerBallKick = (player: PlayerObject): void => eventListener.onPlayerBallKickListener(player);
    window.room.onTeamGoal = (team: number): void => eventListener.onTeamGoalListener(team);
    window.room.onGameStart = (byPlayer: PlayerObject): void => eventListener.onGameStartListener(byPlayer);
    window.room.onGameStop = (byPlayer: PlayerObject): void => eventListener.onGameStopListener(byPlayer);
    window.room.onPlayerAdminChange = (changedPlayer: PlayerObject, byPlayer: PlayerObject): void => eventListener.onPlayerAdminChangeListener(changedPlayer, byPlayer);
    window.room.onPlayerTeamChange = (changedPlayer: PlayerObject, byPlayer: PlayerObject): void => eventListener.onPlayerTeamChangeListener(changedPlayer, byPlayer);
    window.room.onPlayerKicked = (kickedPlayer: PlayerObject, reason: string, ban: boolean, byPlayer: PlayerObject): void => eventListener.onPlayerKickedListener(kickedPlayer, reason, ban, byPlayer);
    window.room.onGameTick = (): void => eventListener.onGameTickListener();
    window.room.onGamePause = (byPlayer: PlayerObject): void => eventListener.onGamePauseListener(byPlayer);
    window.room.onGameUnpause = (byPlayer: PlayerObject): void => eventListener.onGameUnpauseListener(byPlayer);
    window.room.onPositionsReset = (): void => eventListener.onPositionsResetListener();
    window.room.onPlayerActivity = (player: PlayerObject): void => eventListener.onPlayerActivityListener(player);
    window.room.onStadiumChange = (newStadiumName: string, byPlayer: PlayerObject): void => eventListener.onStadiumChangeListner(newStadiumName, byPlayer);
    window.room.onRoomLink = (url: string): void => eventListener.onRoomLinkListener(url);
    window.room.onKickRateLimitSet = (min: number, rate: number, burst: number, byPlayer: PlayerObject): void => eventListener.onKickRateLimitSetListener(min, rate, burst, byPlayer);
    // =========================
}

function getCookieFromHeadless(name: string): string {
    var result = new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(document.cookie);
    return result ? result[1] : '';
}

// on dev-console tools for emergency
window.onEmergency = {
    list: function(): void { // print list of players joined
        var players = window.room.getPlayerList().filter((player: PlayerObject) => player.id != 0);
        players.forEach((player: PlayerObject) => {
            console.log(`[EMERGENCY.LIST]${player.name}#${player.id} team(${player.team}) admin(${player.admin})`);
        });
    },
    chat: function(msg: string, playerID?: number): void { // send chat
        if(playerID) {
            window.room.sendAnnouncement(msg, playerID, 0xFFFF00, "bold", 2);
            console.log(`[EMERGENCY.CHAT] the message is sent to #${playerID}. message: ${msg}`);
        } else {
            window.room.sendAnnouncement(msg, null, 0xFFFF00, "bold", 2);
            console.log(`[EMERGENCY.CHAT] the message is sent. message: ${msg}`);
        }
    },
    kick: function(playerID: number, msg?: string): void { // kick the player
        if(msg) {
            window.room.kickPlayer(playerID, msg, false);
            console.log(`[EMERGENCY.KICK] #${playerID} is kicked. reason:${msg}`);
        } else {
            window.room.kickPlayer(playerID, 'by haxbotron', false);
            console.log(`[EMERGENCY.BAN] #${playerID} is kicked.`);
        }
    },
    ban: function(playerID: number, msg?: string): void { // ban the player
        if(msg) {
            window.room.kickPlayer(playerID, msg, true);
            console.log(`[EMERGENCY.BAN] #${playerID} is banned. reason:${msg}`);
        } else {
            window.room.kickPlayer(playerID, 'by haxbotron', true);
            console.log(`[EMERGENCY.BAN] #${playerID} is banned.`);
        }
    },
    banclearall: function(): void { // clear all of ban list
        window.room.clearBans();
        Ban.bListClear();
        console.log(`[EMERGENCY.CLEARBANS] ban list is cleared.`);
    },
    banlist: function(): void {
        let bannedList: BanList[] = Ban.bListGetArray();
        bannedList.forEach((item: BanList) => {
            console.log(`[EMERGENCY.BANLIST] (${item.conn})is banned connection. (reason: ${item.reason})`);
        });
    },
    password: function(password?: string): void { // set or clear the password key of the room
        if(password) {
            window.room.setPassword(password);
            console.log(`[EMERGENCY.PASSWORD] password is changed. key:${password}`);
        } else { // can be null
            window.room.setPassword();
            console.log(`[EMERGENCY.PASSWORD] password is cleared.`);
        }
    }
}