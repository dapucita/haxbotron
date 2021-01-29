// Haxbotron
// This is main part of the bot

// import modules
import * as LangRes from "./resource/strings";
import * as eventListener from "./controller/events/eventListeners";
import * as Tst from "./controller/Translator";
import { Player } from "./model/GameObject/Player";
import { Logger } from "./controller/Logger";
import { PlayerObject } from "./model/GameObject/PlayerObject";
import { ScoresObject } from "./model/GameObject/ScoresObject";
import { KickStack } from "./model/GameObject/BallTrace";
import { getUnixTimestamp } from "./controller/Statistics";
import { TeamID } from "./model/GameObject/TeamID";
import { EmergencyTools } from "./model/DevConsole/EmergencyTools";
import { refreshBanVoteCache } from "./model/OperateHelper/Vote";
import { loadStadiumData } from "./resource/stadiumLoader";
import { GameRoomConfig } from "./model/Configuration/GameRoomConfig";

// load initial configurations
initBotScript();
makeRoom();

// set schedulers
var advertisementTimer = setInterval(() => {
    window.gameRoom._room.sendAnnouncement(LangRes.scheduler.advertise, null, 0x777777, "normal", 0); // advertisement

    refreshBanVoteCache(); // update banvote status cache
    if (window.gameRoom.banVoteCache.length >= 1) { // if there are some votes (include top voted players only)
        let placeholderVote = {
            voteList: ''
        }
        for (let i: number = 0; i < window.gameRoom.banVoteCache.length; i++) {
            if (window.gameRoom.playerList.has(window.gameRoom.banVoteCache[i])) {
                placeholderVote.voteList += `${window.gameRoom.playerList.get(window.gameRoom.banVoteCache[i])!.name}#${window.gameRoom.banVoteCache[i]} `;
            }
        }
        window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.scheduler.banVoteAutoNotify, placeholderVote), null, 0x00FF00, "normal", 0); //notify it
    }
}, 60000) // 1min

var scheduledTimer = setInterval(() => {
    const nowTimeStamp: number = getUnixTimestamp(); //get timestamp

    let placeholderScheduler = {
        targetID: 0,
        targetName: '',
    }

    window.gameRoom.playerList.forEach((player: Player) => { // afk detection system & auto unmute system
        // init placeholder
        placeholderScheduler.targetID = player.id;
        placeholderScheduler.targetName = player.name;

        // check muted player and unmute when it's time to unmute
        if (player.permissions.mute === true && nowTimeStamp > player.permissions.muteExpire) {
            player.permissions.mute = false; //unmute
            window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.scheduler.autoUnmute, placeholderScheduler), null, 0x479947, "normal", 0); //notify it
        }

        // when afk too long kick option is enabled, then check sleeping with afk command and kick if afk too long
        if (window.gameRoom.config.settings.afkCommandAutoKick === true && player.permissions.afkmode === true && nowTimeStamp > player.permissions.afkdate + window.gameRoom.config.settings.afkCommandAutoKickAllowMillisecs) {
            window.gameRoom._room.kickPlayer(player.id, Tst.maketext(LangRes.scheduler.afkCommandTooLongKick, placeholderScheduler), false); // kick
        }

        // check afk
        if (window.gameRoom.isGamingNow === true && window.gameRoom.isStatRecord === true) { // if the game is in playing
            if (player.team !== TeamID.Spec) { // if the player is not spectators(include afk mode)
                if (player.afktrace.count >= window.gameRoom.config.settings.afkCountLimit) { // if the player's count is over than limit
                    window.gameRoom._room.kickPlayer(player.id, Tst.maketext(LangRes.scheduler.afkKick, placeholderScheduler), false); // kick
                } else {
                    if (player.afktrace.count >= 1) { // only when the player's count is not 0(in activity)
                        window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.scheduler.afkDetect, placeholderScheduler), player.id, 0xFF7777, "bold", 2); // warning for all
                    }
                    player.afktrace.count++; // add afk detection count
                }
            }
        } else {
            if (player.admin == true) { // if the player is admin
                if (player.afktrace.count >= window.gameRoom.config.settings.afkCountLimit) { // if the player's count is over than limit
                    window.gameRoom._room.kickPlayer(player.id, Tst.maketext(LangRes.scheduler.afkKick, placeholderScheduler), false); // kick
                } else {
                    if (player.afktrace.count >= 1) { // only when the player's count is not 0(in activity)
                        window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.scheduler.afkDetect, placeholderScheduler), player.id, 0xFF7777, "bold", 2); // warning for all
                    }
                    player.afktrace.count++; // add afk detection count
                }
            }
        }
    });
}, 5000); // by 5seconds

// declare functions
function initBotScript(): void {
    const loadedConfig: GameRoomConfig = JSON.parse(localStorage.getItem('initConfig')!);
    localStorage.removeItem('initConfig');

    window.gameRoom = {
        _room: window.HBInit(loadedConfig._config)
        ,config: loadedConfig
        ,link: ''
        ,stadiumData: { default: '', training: '' }
        ,logger: Logger.getInstance() 
        ,isStatRecord: false
        ,isGamingNow: false
        ,isMuteAll: false
        ,playerList: new Map()
        ,ballStack: KickStack.getInstance()
        ,banVoteCache: []
        ,winningStreak: { count: 0, teamID: TeamID.Spec }
        ,antiTrollingOgFloodCount: []
        ,antiTrollingChatFloodCount: []
        ,antiInsufficientStartAbusingCount: []
        ,antiPlayerKickAbusingCount: []
        ,onEmergency: EmergencyTools
        }
    
    // init global properties
    console.log(`Haxbotron loaded bot script. (UID ${window.gameRoom.config._RUID}, TOKEN ${window.gameRoom.config._config.token})`);

    window.gameRoom.stadiumData.default = loadStadiumData(window.gameRoom.config.rules.defaultMapName);
    window.gameRoom.stadiumData.training = loadStadiumData(window.gameRoom.config.rules.readyMapName);

    window.document.title = `Haxbotron ${window.gameRoom.config._RUID}`;
}

function makeRoom(): void {
    window.gameRoom.logger.i(`The game room is opened at ${window.gameRoom.config._LaunchDate.toLocaleString()}.`);

    window.gameRoom.logger.i(`The game mode is '${window.gameRoom.isGamingNow}' now(by default).`);

    window.gameRoom._room.setCustomStadium(window.gameRoom.stadiumData.training);
    window.gameRoom._room.setScoreLimit(window.gameRoom.config.rules.requisite.scoreLimit);
    window.gameRoom._room.setTimeLimit(window.gameRoom.config.rules.requisite.timeLimit);
    window.gameRoom._room.setTeamsLock(window.gameRoom.config.rules.requisite.teamLock);

    // Linking Event Listeners
    window.gameRoom._room.onPlayerJoin = async (player: PlayerObject): Promise<void> => await eventListener.onPlayerJoinListener(player);
    window.gameRoom._room.onPlayerLeave = async (player: PlayerObject): Promise<void> => await eventListener.onPlayerLeaveListener(player);
    window.gameRoom._room.onTeamVictory = async (scores: ScoresObject): Promise<void> => await eventListener.onTeamVictoryListener(scores);
    window.gameRoom._room.onPlayerChat = (player: PlayerObject, message: string): boolean => eventListener.onPlayerChatListener(player, message);
    window.gameRoom._room.onPlayerBallKick = (player: PlayerObject): void => eventListener.onPlayerBallKickListener(player);
    window.gameRoom._room.onTeamGoal = async (team: TeamID): Promise<void> => await eventListener.onTeamGoalListener(team);
    window.gameRoom._room.onGameStart = (byPlayer: PlayerObject): void => eventListener.onGameStartListener(byPlayer);
    window.gameRoom._room.onGameStop = (byPlayer: PlayerObject): void => eventListener.onGameStopListener(byPlayer);
    window.gameRoom._room.onPlayerAdminChange = (changedPlayer: PlayerObject, byPlayer: PlayerObject): void => eventListener.onPlayerAdminChangeListener(changedPlayer, byPlayer);
    window.gameRoom._room.onPlayerTeamChange = (changedPlayer: PlayerObject, byPlayer: PlayerObject): void => eventListener.onPlayerTeamChangeListener(changedPlayer, byPlayer);
    window.gameRoom._room.onPlayerKicked = (kickedPlayer: PlayerObject, reason: string, ban: boolean, byPlayer: PlayerObject): void => eventListener.onPlayerKickedListener(kickedPlayer, reason, ban, byPlayer);
    window.gameRoom._room.onGameTick = (): void => eventListener.onGameTickListener();
    window.gameRoom._room.onGamePause = (byPlayer: PlayerObject): void => eventListener.onGamePauseListener(byPlayer);
    window.gameRoom._room.onGameUnpause = (byPlayer: PlayerObject): void => eventListener.onGameUnpauseListener(byPlayer);
    window.gameRoom._room.onPositionsReset = (): void => eventListener.onPositionsResetListener();
    window.gameRoom._room.onPlayerActivity = (player: PlayerObject): void => eventListener.onPlayerActivityListener(player);
    window.gameRoom._room.onStadiumChange = (newStadiumName: string, byPlayer: PlayerObject): void => eventListener.onStadiumChangeListner(newStadiumName, byPlayer);
    window.gameRoom._room.onRoomLink = (url: string): void => eventListener.onRoomLinkListener(url);
    window.gameRoom._room.onKickRateLimitSet = (min: number, rate: number, burst: number, byPlayer: PlayerObject): void => eventListener.onKickRateLimitSetListener(min, rate, burst, byPlayer);
    // =========================
}
