// Haxbotron
// This is the main part of the bot

// import modules
import * as BotSettings from "./resources/settings.json";
import * as LangRes from "./resources/strings";
import * as eventListener from "./controller/events/eventListeners";
import * as Tst from "./controller/Translator";
import { Player } from "./model/GameObject/Player";
import { Logger } from "./controller/Logger";
import { PlayerObject } from "./model/GameObject/PlayerObject";
import { ScoresObject } from "./model/GameObject/ScoresObject";
import { gameRule } from "./model/GameRules/preset/captain.rule";
import { KickStack } from "./model/GameObject/BallTrace";
import { getUnixTimestamp } from "./controller/Statistics";
import { convertTeamID2Name, TeamID } from "./model/GameObject/TeamID";
import { getCookieFromHeadless } from "./controller/RoomTools";
import { EmergencyTools } from "./model/DevConsole/EmergencyTools";

// load settings
window.settings = {
    room: {
        config: JSON.parse(getCookieFromHeadless('botConfig'))
    },
    game: {
        rule: gameRule
    }
}

// init global properties
console.log(`Haxbotron Bot Entry Point : The authentication token is conveyed via cookie(${window.settings.room.config.token})`);

window.playerList = new Map(); // player list (key: player.id, value: Player), usage: playerList.get(player.id).name

window.winningStreak = { // count of winning streak
    count: 0,
    teamID: 0
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

window.room = window.HBInit(window.settings.room.config);
initialiseRoom();

var advertisementTimer = setInterval(() => {
    window.room.sendAnnouncement(LangRes.scheduler.advertise, null, 0x777777, "normal", 0); // advertisement
}, 60000) // 1min

var scheduledTimer = setInterval(() => {
    const nowTimeStamp: number = getUnixTimestamp(); //get timestamp

    let placeholderScheduler = {
        targetID: 0,
        targetName: '',
    }

    window.playerList.forEach((player: Player) => { // afk detection system & auto unmute system
        // init placeholder
        placeholderScheduler.targetID = player.id;
        placeholderScheduler.targetName = player.name;

        // check muted player and unmute when it's time to unmute
        if(player.permissions.mute === true && nowTimeStamp > player.permissions.muteExpire) {
            player.permissions.mute = false; //unmute
            window.room.sendAnnouncement(Tst.maketext(LangRes.scheduler.autoUnmute, placeholderScheduler), null, 0x479947, "normal", 0); //notify it
        }

        // when afk too long kick option is enabled, then check sleeping with afk command and kick if afk too long
        if(BotSettings.afkCommandAutoKick === true && player.permissions.afkmode === true && nowTimeStamp > player.permissions.afkdate + BotSettings.afkCommandAutoKickAllowMillisecs) {
            window.room.kickPlayer(player.id, Tst.maketext(LangRes.scheduler.afkCommandTooLongKick, placeholderScheduler), false); // kick
        }
        
        // check afk
        if(window.isGamingNow === true) { // if the game is in playing
            if(player.team !== TeamID.Spec) { // if the player is not spectators(include afk mode)
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
}, 5000); // by 5seconds

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

    window.room.setCustomStadium(window.settings.game.rule.readyMap);
    window.room.setScoreLimit(window.settings.game.rule.requisite.scoreLimit);
    window.room.setTimeLimit(window.settings.game.rule.requisite.timeLimit);
    window.room.setTeamsLock(window.settings.game.rule.requisite.teamLock);

    // Linking Event Listeners
    window.room.onPlayerJoin = (player: PlayerObject): void => eventListener.onPlayerJoinListener(player);
    window.room.onPlayerLeave = (player: PlayerObject): void => eventListener.onPlayerLeaveListener(player);
    window.room.onTeamVictory = (scores: ScoresObject): void => eventListener.onTeamVictoryListener(scores);
    window.room.onPlayerChat = (player: PlayerObject, message: string): boolean => eventListener.onPlayerChatListener(player, message);
    window.room.onPlayerBallKick = (player: PlayerObject): void => eventListener.onPlayerBallKickListener(player);
    window.room.onTeamGoal = (team: TeamID): void => eventListener.onTeamGoalListener(team);
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

// on dev-console tools for emergency
window.onEmergency = EmergencyTools;