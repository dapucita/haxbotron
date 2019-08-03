// Haxbotron
// This is the main part of the bot

// import modules
import * as BotSettings from "./resources/settings.json";
import {
    RoomConfig
} from "./model/RoomConfig";
import {
    Player
} from "./model/Player";
import {
    Logger
} from "./controller/Logger";
import {
    PlayerObject,
    PlayerStorage,
} from "./model/PlayerObject";
import {
    ScoresObject
} from "./model/ScoresObject";
import {
    ActionQueue,
    ActionTicket
} from "./controller/Action";
import {
    Parser
} from "./controller/Parser";
import {
    getPlayerData, setPlayerData
} from "./controller/Storage";
import {
    gameRule
} from "./model/rules/captain.rule";
import {
    KickStack
} from "./model/BallTrace";
import * as StatCalc from "./controller/Statistics";
import * as LangRes from "./resources/strings";
import { Ban } from "./controller/Ban";

window.logQueue = []; // init

const botConfig: RoomConfig = JSON.parse(getCookieFromHeadless('botConfig'));

console.log("====");
console.log('\x1b[32m%s\x1b[0m', "H a x b o t r o n"); //green color
console.log("Haxbotron Debugging System on headless browser");
console.log(`The authentication token is conveyed via cookie(${botConfig.token})`);
console.log("====");

// initial settings part
const roomConfig: RoomConfig = {
    roomName: botConfig.roomName,
    password: botConfig.password,
    maxPlayers: botConfig.maxPlayers,
    // https://www.haxball.com/headlesstoken
    token: botConfig.token, // If this value doesn't exist, headless host api page will require to solving recaptcha.
    public: botConfig.public,
    playerName: botConfig.playerName,
    noPlayer: botConfig.noPlayer // If set to true the room player list will be empty, the playerName setting will be ignored.
}
const playerList = new Map(); // playerList:Player is an Map object. // playerList.get(player.id).name; : usage for playerList
const winningStreak = { // count of winning streak
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

const actionQueue: ActionQueue < ActionTicket > = ActionQueue.getInstance();
const ballStack: KickStack = KickStack.getInstance();

const logger: Logger = Logger.getInstance();
const parser: Parser = Parser.getInstance();
const banList: Ban = Ban.getInstance();

banList.init();

var gameMode: string = "ready"; // "ready", "stats"
var isGamingNow: boolean = false; // true : in gaming
var muteMode: boolean = false; // true for mute all players

var room: any = window.HBInit(roomConfig);
initialiseRoom();

var parsingTimer = setInterval(function (): void {
    //Loop timer for processing ActionTicket Queue.
    var timerTicket: ActionTicket | undefined = actionQueue.pop();
    if (timerTicket !== undefined) {
        var placeholderQueueCommand = { // Parser.maketext(str, placeholder)
            _LaunchTime: localStorage.getItem('_LaunchTime'),
            ticketOwner: timerTicket.ownerPlayerID,
            ticketTarget: timerTicket.targetPlayerID,
            targetTeamID: timerTicket.targetTeamID,
            targetName: playerList.get(timerTicket.targetPlayerID).name,
            targetAfkReason: playerList.get(timerTicket.targetPlayerID).permissions.afkreason,
            targetStatsTotal: playerList.get(timerTicket.targetPlayerID).stats.totals,
            targetStatsWins: playerList.get(timerTicket.targetPlayerID).stats.wins,
            targetStatsGoals: playerList.get(timerTicket.targetPlayerID).stats.goals,
            targetStatsAssists: playerList.get(timerTicket.targetPlayerID).stats.assists,
            targetStatsOgs: playerList.get(timerTicket.targetPlayerID).stats.ogs,
            targetStatsLosepoints: playerList.get(timerTicket.targetPlayerID).stats.losePoints,
            targetStatsWinRate: StatCalc.calcWinsRate(playerList.get(timerTicket.targetPlayerID).stats.totals, playerList.get(timerTicket.targetPlayerID).stats.wins),
            targetStatsPassSuccess: StatCalc.calcPassSuccessRate(playerList.get(timerTicket.targetPlayerID).stats.balltouch, playerList.get(timerTicket.targetPlayerID).stats.passed),
            gameRuleName: gameRule.ruleName,
            gameRuleDescription: gameRule.ruleDescripttion,
            gameRuleLimitTime: gameRule.requisite.timeLimit,
            gameRuleLimitScore: gameRule.requisite.scoreLimit,
            gameRuleNeedMin: gameRule.requisite.minimumPlayers,
            possTeamRed: ballStack.possCalculate(1),
            possTeamBlue: ballStack.possCalculate(2),
            streakTeamName: winningStreak.getName(),
            streakTeamCount: winningStreak.getCount(),
            whoisResult: ''
        }
        
        switch (timerTicket.type) {
            case "info": {
                if(timerTicket.action) {
                    timerTicket.action(timerTicket.ownerPlayerID, playerList);
                }
                if(timerTicket.messageString) {
                    if(timerTicket.selfnotify == true) {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), timerTicket.ownerPlayerID, 0x00FF00, "normal", 0);
                    } else {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), null, 0x00FF00, "normal", 0);
                    }
                }
                break;
            }
            case "freeze": {
                if(timerTicket.action) {
                    let tmpMuteMode: boolean|null = timerTicket.action(timerTicket.ownerPlayerID, playerList, muteMode);
                    if(tmpMuteMode !== null) {
                        muteMode = tmpMuteMode;
                    }
                }
                if(timerTicket.messageString) {
                    if(timerTicket.selfnotify == true) {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), timerTicket.ownerPlayerID, 0x00FF00, "normal", 0);
                    } else {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), null, 0x00FF00, "normal", 0);
                    }
                }
                break;
            }
            case "whois": {
                if(timerTicket.action) {
                    placeholderQueueCommand.whoisResult = timerTicket.action(timerTicket.ownerPlayerID, playerList, room);
                }
                if(timerTicket.messageString) {
                    if(timerTicket.selfnotify == true) {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), timerTicket.ownerPlayerID, 0x00FF00, "normal", 0);
                    } else {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), null, 0x00FF00, "normal", 0);
                    }
                }
                break;
            }
            case "stats": {
                if(timerTicket.action) {
                    timerTicket.action(timerTicket.ownerPlayerID, playerList);
                }
                if(timerTicket.messageString) {
                    if(timerTicket.selfnotify == true) {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), timerTicket.ownerPlayerID, 0x00FF00, "normal", 0);
                    } else {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), null, 0x00FF00, "normal", 0);
                    }
                }
                break;
            }
            case "status": {
                if(timerTicket.action) {
                    timerTicket.action(timerTicket.ownerPlayerID, playerList, room);
                }
                if(timerTicket.messageString) {
                    placeholderQueueCommand.targetAfkReason = playerList.get(timerTicket.targetPlayerID).permissions.afkreason; // update
                    if(timerTicket.selfnotify == true) {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), timerTicket.ownerPlayerID, 0x00FF00, "normal", 0);
                    } else {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), null, 0x00FF00, "normal", 0);
                    }
                }
                break;
            }
            case "super": {
                if(timerTicket.action) {
                    timerTicket.action(timerTicket.ownerPlayerID, playerList, room);
                }
                if(timerTicket.messageString) {
                    if(timerTicket.selfnotify == true) {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), timerTicket.ownerPlayerID, 0x00FF00, "normal", 0);
                    } else {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), null, 0x00FF00, "normal", 0);
                    }
                }
                break;
            }
            case "_ErrorWrongCommand": {
                if(timerTicket.action) {
                    timerTicket.action(timerTicket.ownerPlayerID, playerList, room);
                }
                if(timerTicket.messageString) {
                    if(timerTicket.selfnotify == true) {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), timerTicket.ownerPlayerID, 0x00FF00, "normal", 0);
                    } else {
                        room.sendAnnouncement(parser.maketext(timerTicket.messageString, placeholderQueueCommand), null, 0x00FF00, "normal", 0);
                    }
                }
                break;
            }
            default: {
                logger.c("[QUEUE] Warning: not implemented type of ticket.");
                break;
            }
        }
    }
}, 0);

var scheduledTimer = setInterval(function(): void {
    var placeholderScheduler = {
        targetID: 0,
        targetName: '',
    }

    if(Math.random() < 0.25) {
        room.sendAnnouncement(parser.maketext(LangRes.scheduler.advertise, placeholderScheduler), null, 0x777777, "normal", 0); // advertisement
    }

    playerList.forEach((player: Player) => { // afk detection system
        // init placeholder
        placeholderScheduler.targetID = player.id;
        placeholderScheduler.targetName = player.name;
        // check afk
        if(isGamingNow == true) { // if the game is in playing
            if(player.team != 0) { // if the player is not spectators(include afk mode)
                if(player.afktrace.count >= BotSettings.afkCountLimit) { // if the player's count is over than limit
                    room.kickPlayer(player.id, parser.maketext(LangRes.scheduler.afkKick, placeholderScheduler), false); // kick
                } else {
                    if(player.afktrace.count >= 1) { // only when the player's count is not 0(in activity)
                        room.sendAnnouncement(parser.maketext(LangRes.scheduler.afkDetect, placeholderScheduler), null, 0xFF0000, "bold", 1); // warning for all
                    }
                    player.afktrace.count++; // add afk detection count
                }
            }
        } else {
            if(player.admin == true) { // if the player is admin
                if(player.afktrace.count >= BotSettings.afkCountLimit) { // if the player's count is over than limit
                    room.kickPlayer(player.id, parser.maketext(LangRes.scheduler.afkKick, placeholderScheduler), false); // kick
                } else {
                    if(player.afktrace.count >= 1) { // only when the player's count is not 0(in activity)
                        room.sendAnnouncement(parser.maketext(LangRes.scheduler.afkDetect, placeholderScheduler), null, 0xFF0000, "bold", 1); // warning for all
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

    logger.c(`[HAXBOTRON] The game room is opened at ${nowDate.toString()}.`);

    gameMode = "ready" // no 'stats' not yet
    logger.c(`[MODE] Game mode is '${gameMode}'(by default).`);

    // declare function in window object
    window.sendRoomChat = function(msg: string, playerID?: number): void {
        if(playerID !== null) {
            room.sendAnnouncement(msg, playerID, 0xFFFF00, "bold", 2);
        } else {
            room.sendAnnouncement(msg, null, 0xFFFF00, "bold", 2);
        }
    }

    // room.setDefaultStadium("Big");
    room.setCustomStadium(gameRule.defaultMap);
    room.setScoreLimit(gameRule.requisite.scoreLimit);
    room.setTimeLimit(gameRule.requisite.timeLimit);
    room.setTeamsLock(gameRule.requisite.teamLock);

    room.onPlayerJoin = function (player: PlayerObject): void {
    // Event called when a new player joins the room.
        var placeholderJoin = { // Parser.maketext(str, placeholder)
            playerID: player.id,
            playerName: player.name,
            playerNameOld: player.name,
            playerStatsTotal: 0,
            playerStatsWins: 0,
            playerStatsGoals: 0,
            playerStatsAssists: 0,
            playerStatsOgs: 0,
            playerStatsLosepoints: 0,
            gameRuleName: gameRule.ruleName,
            gameRuleDescription: gameRule.ruleDescripttion,
            gameRuleLimitTime: gameRule.requisite.timeLimit,
            gameRuleLimitScore: gameRule.requisite.scoreLimit,
            gameRuleNeedMin: gameRule.requisite.minimumPlayers,
            possTeamRed: ballStack.possCalculate(1),
            possTeamBlue: ballStack.possCalculate(2),
            streakTeamName: winningStreak.getName(),
            streakTeamCount: winningStreak.getCount(),
            banListReason: ''
        };

        if(banList.isBan(player.conn)) {
            placeholderJoin.banListReason = banList.getReason(player.conn);
            logger.c(`[JOIN] ${player.name}#${player.id} was joined but kicked for registered in ban list. (conn:${player.conn},reason:${placeholderJoin.banListReason})`);
            room.kickPlayer(player.id, parser.maketext(LangRes.onJoin.banList, placeholderJoin), true); // ban
            return;
        }

        // if this player has already joinned by other connection
        playerList.forEach((eachPlayer: Player) => {
            if(eachPlayer.conn == player.conn) {
                logger.c(`[JOIN] ${player.name} was joined but kicked for double joinning.(origin:${eachPlayer.name}#${eachPlayer.id},conn:${player.conn})`);
                room.kickPlayer(player.id, parser.maketext(LangRes.onJoin.doubleJoinningKick, placeholderJoin), false); // kick
                room.sendAnnouncement(parser.maketext(LangRes.onJoin.doubleJoinningMsg, placeholderJoin), null, 0xFF0000, "normal", 0); // notify
                return; // exit from this join event
            }
        });
        
        // logging into console (debug)
        logger.c(`[JOIN] ${player.name} has joined.`);
        printPlayerInfo(player);

        // add the player who joined into playerList by creating class instance
        if (localStorage.getItem(player.auth) !== null) {
            // if this player is not new player
            var loadedData: PlayerStorage | null = getPlayerData(player.auth);
            if (loadedData !== null) {
                if(loadedData.balltouch === null) { // init for old players who don't have balltouch, pass value.
                    loadedData.balltouch = 0;
                    loadedData.passed = 0;
                }
                playerList.set(player.id, new Player(player, {
                    totals: loadedData.totals,
                    wins: loadedData.wins,
                    goals: loadedData.goals,
                    assists: loadedData.assists,
                    ogs: loadedData.ogs,
                    losePoints: loadedData.losePoints,
                    balltouch: loadedData.balltouch,
                    passed: loadedData.passed
                }, {
                    mute: loadedData.mute,
                    afkmode: false,
                    afkreason: '',
                    captain: false,
                    superadmin: false
                }));

                // update player information in placeholder
                placeholderJoin.playerStatsAssists = loadedData.assists;
                placeholderJoin.playerStatsGoals = loadedData.goals;
                placeholderJoin.playerStatsLosepoints = loadedData.losePoints;
                placeholderJoin.playerStatsOgs = loadedData.ogs;
                placeholderJoin.playerStatsTotal = loadedData.totals;
                placeholderJoin.playerStatsWins = loadedData.wins;

                if (player.name != loadedData.name) {
                    // if this player changed his/her name
                    // notify that fact to other players only once ( it will never be notified if he/she rejoined next time)
                    placeholderJoin.playerNameOld = loadedData.name
                    room.sendAnnouncement(parser.maketext(LangRes.onJoin.changename, placeholderJoin), null, 0x00FF00, "normal", 0);
                }
            }
        } else {
            // if new player
            // create a Player Object
            playerList.set(player.id, new Player(player, {
                totals: 0,
                wins: 0,
                goals: 0,
                assists: 0,
                ogs: 0,
                losePoints: 0,
                balltouch: 0,
                passed: 0
            }, {
                mute: false,
                afkmode: false,
                afkreason: '',
                captain: false,
                superadmin: false
            }));
        }

        setPlayerData(playerList.get(player.id)); // register(or update) in localStorage

        updateAdmins(); // check there are any admin players, if not make an admin player.

        // send welcome message to new player. other players cannot read this message.
        room.sendAnnouncement(parser.maketext(LangRes.onJoin.welcome, placeholderJoin), player.id, 0x00FF00, "normal", 0);

        // check number of players joined and change game mode
        if (gameRule.statsRecord == true && roomPlayersNumberCheck() >= gameRule.requisite.minimumPlayers) {
            if(gameMode != "stats") {
                room.sendAnnouncement(parser.maketext(LangRes.onJoin.startRecord, placeholderJoin), null, 0x00FF00, "normal", 0);
                gameMode = "stats";
            }
        } else {
            if(gameMode != "ready") {
                room.sendAnnouncement(parser.maketext(LangRes.onJoin.stopRecord, placeholderJoin), null, 0x00FF00, "normal", 0);
                gameMode = "ready";
            }
        }

        //setDefaultStadiums(); // check number of players and auto-set stadium
    }

    room.onPlayerLeave = function (player: PlayerObject): void {
        // Event called when a player leaves the room.

        var placeholderLeft = { // Parser.maketext(str, placeholder)
            playerID: player.id,
            playerName: player.name,
            playerStatsTotal: playerList.get(player.id).stats.totals,
            playerStatsWins: playerList.get(player.id).stats.wins,
            playerStatsGoals: playerList.get(player.id).stats.goals,
            playerStatsAssists: playerList.get(player.id).stats.assists,
            playerStatsOgs: playerList.get(player.id).stats.ogs,
            playerStatsLosepoints: playerList.get(player.id).stats.losePoints,
            gameRuleName: gameRule.ruleName,
            gameRuleDescription: gameRule.ruleDescripttion,
            gameRuleLimitTime: gameRule.requisite.timeLimit,
            gameRuleLimitScore: gameRule.requisite.scoreLimit,
            gameRuleNeedMin: gameRule.requisite.minimumPlayers,
            possTeamRed: ballStack.possCalculate(1),
            possTeamBlue: ballStack.possCalculate(2),
            streakTeamName: winningStreak.getName(),
            streakTeamCount: winningStreak.getCount()
        };

        logger.c(`[LEFT] ${player.name} has left.`);

        // check number of players joined and change game mode
        if (gameRule.statsRecord == true && roomPlayersNumberCheck() >= gameRule.requisite.minimumPlayers) {
            if(gameMode != "stats") {
                room.sendAnnouncement(parser.maketext(LangRes.onLeft.startRecord, placeholderLeft), null, 0x00FF00, "normal", 0);
                gameMode = "stats";
            }
        } else {
            if(gameMode != "ready") {
                room.sendAnnouncement(parser.maketext(LangRes.onLeft.stopRecord, placeholderLeft), null, 0x00FF00, "normal", 0);
                gameMode = "ready";
            }
        }
        playerList.delete(player.id); // delete from player list
        //setDefaultStadiums(); // check number of players and auto-set stadium
        updateAdmins();
    }

    room.onPlayerChat = function (player: PlayerObject, message: string): boolean {
        // Event called when a player sends a chat message.
        // The event function can return false in order to filter the chat message.
        // Then It prevents the chat message from reaching other players in the room.

        var placeholderChat = { // Parser.maketext(str, placeholder)
            playerID: player.id,
            playerName: player.name,
            gameRuleName: gameRule.ruleName,
            gameRuleDescription: gameRule.ruleDescripttion,
            gameRuleLimitTime: gameRule.requisite.timeLimit,
            gameRuleLimitScore: gameRule.requisite.scoreLimit,
            gameRuleNeedMin: gameRule.requisite.minimumPlayers,
            possTeamRed: ballStack.possCalculate(1),
            possTeamBlue: ballStack.possCalculate(2),
            streakTeamName: winningStreak.getName(),
            streakTeamCount: winningStreak.getCount()
        };

        logger.c(`[CHAT] ${player.name} said, "${message}"`);
        var evals: ActionTicket = parser.eval(message, player.id); // evaluate whether the message is command chat
        if (evals.type != "none") { // if the message is command chat (not 'none' type)
            // albeit this player is muted, the player can command by chat.
            actionQueue.push(evals); // and push it it queue.
            return false; // and filter the chat message to other players.
        } else { // if the message is normal chat ('none' type)
            if(player.admin == true) { // if the player is admin
                return true; // send chat regardless of mute
            }
            if (muteMode == true || playerList.get(player.id).permissions['mute'] == true) { // if the player is muted
                room.sendAnnouncement(parser.maketext(LangRes.onChat.mutedChat, placeholderChat), player.id, 0xFF0000, "bold", 1); // notify that fact
                return false; // and filter the chat message to other players.
            }
        }
        return true;
    }

    room.onPlayerTeamChange = function (changedPlayer: PlayerObject, byPlayer: PlayerObject): void {
        // Event called when a player team is changed.
        // byPlayer is the player which caused the event (can be null if the event wasn't caused by a player).
        var placeholderTeamChange = { // Parser.maketext(str, placeholder)
            targetPlayerID: changedPlayer.id,
            targetPlayerName: changedPlayer.name,
            targetAfkReason: ''
        }
        if (changedPlayer.id == 0) { // if the player changed into other team is host player(always id 0),
            room.setPlayerTeam(0, 0); // stay host player in Spectators team.
        } else {
            if(byPlayer !== null && byPlayer.id != 0 && playerList.get(changedPlayer.id).permissions.afkmode == true) {
                placeholderTeamChange.targetAfkReason = playerList.get(changedPlayer.id).permissions.afkreason;
                room.setPlayerTeam(changedPlayer.id, 0); // stay the player in Spectators team.
                room.sendAnnouncement(parser.maketext(LangRes.onTeamChange.afkPlayer, placeholderTeamChange), null, 0xFF0000, "normal", 0);
            }/* else {
                if(changedPlayer.team == 0 && changedPlayer.admin != true){
                    playerList.get(changedPlayer.id).afktrace.exemption = true;
                } else {
                    playerList.get(changedPlayer.id).afktrace.exemption = false;
                } 
            } */
            playerList.get(changedPlayer.id).team = changedPlayer.team;
        }

    }

    room.onPlayerAdminChange = function (changedPlayer: PlayerObject, byPlayer: PlayerObject): void {
        /* Event called when a player's admin rights are changed.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
        var placeholderAdminChange = { // Parser.maketext(str, placeholder)
            playerID: changedPlayer.id,
            playerName: changedPlayer.name
        }
        if(changedPlayer.admin == true) { // if this event means that the player has been admin
            if (playerList.get(changedPlayer.id).permissions.afkmode == true) {
                // if changedPlayer is in afk mode, reject
                room.setPlayerAdmin(changedPlayer.id, false);
                room.sendAnnouncement(parser.maketext(LangRes.onAdminChange.afknoadmin, placeholderAdminChange), 0xFF0000, "normal", 2);
                return;
            } else {
                // make this player admin
                playerList.get(changedPlayer.id).admin = true;
                if (byPlayer !== null) {
                    logger.c(`[INFO] ${changedPlayer.name}#${changedPlayer.id} has been admin(super:${playerList.get(changedPlayer.id).permissions.superadmin}) by ${byPlayer.name}#${byPlayer.id}`);
                }
                return;
            }
        }
        updateAdmins(); // check when the last admin player disqulified by self
    }

    room.onGameStart = function (byPlayer: PlayerObject): void {
        /* Event called when a game starts.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
        var placeholderStart = { // Parser.maketext(str, placeholder)
            playerID: 0,
            playerName: '',
            gameRuleName: gameRule.ruleName,
            gameRuleDescription: gameRule.ruleDescripttion,
            gameRuleLimitTime: gameRule.requisite.timeLimit,
            gameRuleLimitScore: gameRule.requisite.scoreLimit,
            gameRuleNeedMin: gameRule.requisite.minimumPlayers,
            possTeamRed: ballStack.possCalculate(1),
            possTeamBlue: ballStack.possCalculate(2),
            streakTeamName: winningStreak.getName(),
            streakTeamCount: winningStreak.getCount()
        };

        isGamingNow = true; // turn on

        let msg = `[GAME] The game(mode:${gameMode}) has been started.`;
        if (byPlayer !== null && byPlayer.id != 0) {
            placeholderStart.playerID = byPlayer.id;
            placeholderStart.playerName = byPlayer.name;
            msg += `(by ${byPlayer.name}#${byPlayer.id})`;
        }
        if (gameRule.statsRecord == true && gameMode == "stats") {
            // if the game mode is stats, records the result of this game.
            room.sendAnnouncement(parser.maketext(LangRes.onStart.startRecord, placeholderStart), null, 0x00FF00, "normal", 0);
        } else {
            room.sendAnnouncement(parser.maketext(LangRes.onStart.stopRecord, placeholderStart), null, 0x00FF00, "normal", 0);
        }
        logger.c(msg);
    }

    room.onGameStop = function (byPlayer: PlayerObject): void {
        /* Event called when a game stops.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
        var placeholderStop = { // Parser.maketext(str, placeholder)
            playerID: 0,
            playerName: '',
            gameRuleName: gameRule.ruleName,
            gameRuleDescription: gameRule.ruleDescripttion,
            gameRuleLimitTime: gameRule.requisite.timeLimit,
            gameRuleLimitScore: gameRule.requisite.scoreLimit,
            gameRuleNeedMin: gameRule.requisite.minimumPlayers,
            possTeamRed: ballStack.possCalculate(1),
            possTeamBlue: ballStack.possCalculate(2),
            streakTeamName: winningStreak.getName(),
            streakTeamCount: winningStreak.getCount()
        };
        if(byPlayer !== null) {
            placeholderStop.playerID = byPlayer.id;
            placeholderStop.playerName = byPlayer.name;
        }

        isGamingNow = false; // turn off

        let msg = "[GAME] The game has been stopped.";
        if (byPlayer !== null && byPlayer.id != 0) {
            msg += `(by ${byPlayer.name}#${byPlayer.id})`;
        }
        logger.c(msg);
        setDefaultStadiums(); // check number of players and auto-set stadium

        ballStack.initTouchInfo(); // clear touch info
        ballStack.clear(); // clear the stack.
        ballStack.possClear(); // clear possession count
    }

    room.onTeamVictory = function (scores: ScoresObject): void {
        // Event called when a team 'wins'. not just when game ended.
        // recors vicotry in stats. total games also counted in this event.
        var placeholderVictory = { // Parser.maketext(str, placeholder)
            teamID: 0,
            teamName: '',
            redScore: scores.red,
            blueScore: scores.blue,
            gameRuleName: gameRule.ruleName,
            gameRuleDescription: gameRule.ruleDescripttion,
            gameRuleLimitTime: gameRule.requisite.timeLimit,
            gameRuleLimitScore: gameRule.requisite.scoreLimit,
            gameRuleNeedMin: gameRule.requisite.minimumPlayers,
            possTeamRed: ballStack.possCalculate(1),
            possTeamBlue: ballStack.possCalculate(2),
            streakTeamName: winningStreak.getName(),
            streakTeamCount: winningStreak.getCount()
        };

        isGamingNow = false; // turn off

        if (gameRule.statsRecord == true && gameMode == "stats") { // records when game mode is for stats recording.
            var gamePlayers: PlayerObject[] = room.getPlayerList().filter((player: PlayerObject) => player.team != 0); // except Spectators players
            var redPlayers: PlayerObject[] = gamePlayers.filter((player: PlayerObject) => player.team == 1); // except non Red players
            var bluePlayers: PlayerObject[] = gamePlayers.filter((player: PlayerObject) => player.team == 2); // except non Blue players
            if (scores.red > scores.blue) {
                // if Red wins
                placeholderVictory.teamID = 1;
                placeholderVictory.teamName = 'Red';
                winningStreak.red++;
                winningStreak.blue = 0;
                redPlayers.forEach(function (eachPlayer: PlayerObject) {
                    playerList.get(eachPlayer.id).stats.wins++; //records a win
                });
            } else {
                // if Blue wins
                placeholderVictory.teamID = 2;
                placeholderVictory.teamName = 'Blue';
                winningStreak.blue++;
                winningStreak.red = 0;
                bluePlayers.forEach(function (eachPlayer: PlayerObject) {
                    playerList.get(eachPlayer.id).stats.wins++; //records a win
                });
            }
            gamePlayers.forEach(function (eachPlayer: PlayerObject) {
                // records a game count
                playerList.get(eachPlayer.id).stats.totals++;
                setPlayerData(playerList.get(eachPlayer.id)); // updates wins and totals count
            });
            if(winningStreak.red >= 3 || winningStreak.blue >= 3) {
                room.sendAnnouncement(parser.maketext(LangRes.onVictory.burning, placeholderVictory), null, 0x00FF00, "bold", 1);
            }
        }

        ballStack.initTouchInfo(); // clear touch info
        ballStack.clear(); // clear the stack.
        ballStack.possClear(); // clear possession count

        logger.c(`[RESULT] The game has ended. Scores ${scores.red}:${scores.blue}.`);
        room.sendAnnouncement(parser.maketext(LangRes.onVictory.victory, placeholderVictory), null, 0x00FF00, "bold", 1);

        setDefaultStadiums(); // check number of players and auto-set stadium
    }

    room.onPlayerKicked = function (kickedPlayer: PlayerObject, reason: string, ban: boolean, byPlayer: PlayerObject): void {
        /* Event called when a player has been kicked from the room. This is always called after the onPlayerLeave event.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
        var placeholderKick = { // Parser.maketext(str, placeholder)
            kickedID : kickedPlayer.id,
            kickedName : kickedPlayer.name,
            kickerID : 0,
            kickerName : '',
            reason : '',
            gameRuleName: gameRule.ruleName,
            gameRuleDescription: gameRule.ruleDescripttion,
            gameRuleLimitTime: gameRule.requisite.timeLimit,
            gameRuleLimitScore: gameRule.requisite.scoreLimit,
            gameRuleNeedMin: gameRule.requisite.minimumPlayers,
            possTeamRed: ballStack.possCalculate(1),
            possTeamBlue: ballStack.possCalculate(2),
            streakTeamName: winningStreak.getName(),
            streakTeamCount: winningStreak.getCount()
        };
        if(reason !== null) {
            placeholderKick.reason = reason;
        }
        if(byPlayer !== null && byPlayer.id != 0) {
            placeholderKick.kickerID = byPlayer.id;
            placeholderKick.kickerName = byPlayer.name;
            if(ban == true) { // ban
                if (playerList.get(byPlayer.id).permissions.superadmin != true) { // FIXME: Error caught-TypeError: Cannot read property 'permissions' of undefined 
                    // if the player who acted banning is not super admin
                    room.sendAnnouncement(parser.maketext(LangRes.onKick.cannotBan, placeholderKick), byPlayer.id, 0xFF0000, "bold", 2);
                    room.sendAnnouncement(parser.maketext(LangRes.onKick.notifyNotBan, placeholderKick), null, 0xFF0000, "bold", 2);
                    room.clearBan(kickedPlayer.id); // Clears the ban for a playerId that belonged to a player that was previously banned.
                    logger.c(`[BAN] ${kickedPlayer.name}#${kickedPlayer.id} has been banned by ${byPlayer.name}#${byPlayer.id} (reason:${reason}), but it is negated.`);
                } else {
                    logger.c(`[BAN] ${kickedPlayer.name}#${kickedPlayer.id} has been banned by ${byPlayer.name}#${byPlayer.id}. (reason:${reason}).`);
                    banList.setBan({conn: kickedPlayer.conn, reason: reason});
                }
            } else {
                // kick
                logger.c(`[KICK] ${kickedPlayer.name}#${kickedPlayer.id} has been kicked by ${byPlayer.name}#${byPlayer.id}. (reason:${reason})`);
            }
        } else {
            logger.c(`[KICK] ${kickedPlayer.name}#${kickedPlayer.id} has been kicked. (ban:${ban},reason:${reason})`);
        }
    }

    //room.onStadiumChange = function(newStadiumName: string, byPlayer: PlayerObject ): void {
    room.onStadiumChange = function (newStadiumName: string, byPlayer: PlayerObject) {
        var placeholderStadium = { // Parser.maketext(str, placeholder)
            playerID: 0,
            playerName: '',
            stadiumName: newStadiumName,
            gameRuleName: gameRule.ruleName,
            gameRuleDescription: gameRule.ruleDescripttion,
            gameRuleLimitTime: gameRule.requisite.timeLimit,
            gameRuleLimitScore: gameRule.requisite.scoreLimit,
            gameRuleNeedMin: gameRule.requisite.minimumPlayers,
            possTeamRed: ballStack.possCalculate(1),
            possTeamBlue: ballStack.possCalculate(2),
            streakTeamName: winningStreak.getName(),
            streakTeamCount: winningStreak.getCount()
        };

        
        // Event called when the stadium is changed.
        if (byPlayer !== null && playerList.size != 0 && byPlayer.id != 0) { // if size == 0, that means there's no players. byPlayer !=0  means that the map is changed by system, not player.
            placeholderStadium.playerID = byPlayer.id;
            placeholderStadium.playerName = byPlayer.name;
            if (playerList.get(byPlayer.id).permissions['superadmin'] == true) {
                //There are two ways for access to map value, permissions['superadmin'] and permissions.superadmin.
                logger.c(`[MAP] ${newStadiumName} has been loaded by ${byPlayer.name}#${byPlayer.id}.(super:${playerList.get(byPlayer.id).permissions['superadmin']})`);
                room.sendAnnouncement(parser.maketext(LangRes.onStadium.loadNewStadium, placeholderStadium),null , 0x00FF00, "normal", 0);
            } else {
                // If trying for chaning stadium is rejected, reload default stadium.
                logger.c(`[MAP] ${byPlayer.name}#${byPlayer.id} tried to set a new stadium(${newStadiumName}), but it is rejected.(super:${playerList.get(byPlayer.id).permissions['superadmin']})`);
                // logger.c(`[DEBUG] ${playerList.get(byPlayer.id).name}`); for debugging
                room.sendAnnouncement(parser.maketext(LangRes.onStadium.cannotChange, placeholderStadium), byPlayer.id, 0xFF0000, "bold", 2);
                setDefaultStadiums();
            }
        } else {
            logger.c(`[MAP] ${newStadiumName} has been loaded as default map.`);
        }
    }

    room.onPlayerBallKick = function (player: PlayerObject): void {
        // Event called when a player kicks the ball.
        // records player's id, team when the ball was kicked
        var placeholderBall = { // Parser.maketext(str, placeholder)
            playerID: player.id,
            playerName: player.name,
            gameRuleName: gameRule.ruleName,
            gameRuleDescription: gameRule.ruleDescripttion,
            gameRuleLimitTime: gameRule.requisite.timeLimit,
            gameRuleLimitScore: gameRule.requisite.scoreLimit,
            gameRuleNeedMin: gameRule.requisite.minimumPlayers,
            possTeamRed: ballStack.possCalculate(1),
            possTeamBlue: ballStack.possCalculate(2),
            streakTeamName: winningStreak.getName(),
            streakTeamCount: winningStreak.getCount()
        };

        playerList.get(player.id).stats.balltouch++; // add count of ball touch
        
        if(ballStack.passJudgment(player.team) == true && playerList.has(ballStack.getLastTouchPlayerID()) == true) {
            playerList.get(ballStack.getLastTouchPlayerID()).stats.passed++;
        }

        ballStack.touchTeamSubmit(player.team);
        ballStack.touchPlayerSubmit(player.id); // refresh who touched the ball in last

        ballStack.push(player.id);
        ballStack.possCount(player.team); // 1: red team, 2: blue team
    }

    room.onTeamGoal = function (team: number): void {
        // Event called when a team scores a goal.
        var placeholderGoal = { // Parser.maketext(str, placeholder)
            teamID: team,
            teamName: '',
            scorerID: '',
            scorerName: '',
            assistID: '',
            assistName: '',
            ogID: '',
            ogName: '',
            gameRuleName: gameRule.ruleName,
            gameRuleDescription: gameRule.ruleDescripttion,
            gameRuleLimitTime: gameRule.requisite.timeLimit,
            gameRuleLimitScore: gameRule.requisite.scoreLimit,
            gameRuleNeedMin: gameRule.requisite.minimumPlayers,
            possTeamRed: ballStack.possCalculate(1),
            possTeamBlue: ballStack.possCalculate(2),
            streakTeamName: winningStreak.getName(),
            streakTeamCount: winningStreak.getCount()
        };

        if(team == 1) { 
            // if red team win
            placeholderGoal.teamName = 'Red';
        } else {
            // if blue team win
            placeholderGoal.teamName = 'Blue';
        }
        // identify who has goaled.
        var touchPlayer: number | undefined = ballStack.pop();
        var assistPlayer: number | undefined = ballStack.pop();
        ballStack.clear(); // clear the stack.
        ballStack.initTouchInfo(); // clear touch info
        if (gameMode == "stats" && touchPlayer !== undefined) { // records when game mode is for stats recording.
            if (playerList.get(touchPlayer).team == team) {
                // if the goal is not OG
                placeholderGoal.scorerID = playerList.get(touchPlayer).id;
                placeholderGoal.scorerName = playerList.get(touchPlayer).name;
                playerList.get(touchPlayer).stats.goals++;
                setPlayerData(playerList.get(touchPlayer));
                var goalMsg: string = parser.maketext(LangRes.onGoal.goal, placeholderGoal);
                if (assistPlayer !== undefined && touchPlayer != assistPlayer && playerList.get(assistPlayer).team == team) {
                    // records assist when the player who assists is not same as the player goaled, and is not other team.
                    placeholderGoal.assistID = playerList.get(assistPlayer).id;
                    placeholderGoal.assistName = playerList.get(assistPlayer).name;
                    playerList.get(assistPlayer).stats.assists++;
                    setPlayerData(playerList.get(assistPlayer));
                    goalMsg = parser.maketext(LangRes.onGoal.goalWithAssist, placeholderGoal);
                }
                room.sendAnnouncement(goalMsg, null, 0x00FF00, "normal", 0);
                logger.c(goalMsg);
            } else {
                // if the goal is OG
                placeholderGoal.ogID = playerList.get(touchPlayer).id;
                placeholderGoal.ogName = playerList.get(touchPlayer).name;
                playerList.get(touchPlayer).stats.ogs++;
                setPlayerData(playerList.get(touchPlayer));
                room.sendAnnouncement(parser.maketext(LangRes.onGoal.og, placeholderGoal), null, 0x00FF00, "normal", 0);
                logger.c(`[GOAL] ${playerList.get(touchPlayer).name}#${playerList.get(touchPlayer).id} made an OG.`);
            }
            // except spectators and filter who were lose a point
            var losePlayers: PlayerObject[] = room.getPlayerList().filter((player: PlayerObject) => player.team != 0 && player.team != team);
            losePlayers.forEach(function (eachPlayer: PlayerObject) {
                // records a lost point
                playerList.get(eachPlayer.id).stats.losePoints++;
                setPlayerData(playerList.get(eachPlayer.id)); // updates lost points count
            });
        }
    }

    room.onGamePause = function(byPlayer : PlayerObject): void {
        isGamingNow = false; // turn off
    }

    room.onGameUnpause = function(byPlayer : PlayerObject): void {
        isGamingNow = true; // turn on
    }

    room.onPlayerActivity = function(player : PlayerObject): void {
        // Event called when a player gives signs of activity, such as pressing a key.
        // This is useful for detecting inactive players.
        playerList.get(player.id).afktrace.count = 0;
    }

    room.onRoomLink = function(url: string): void {
        // Event called when the room link is created.
        // this bot application provides some informations by DOM control.
        
        /* the example for how to access on IFrame in haxball headless page
        // access on 'a href' tag in the iframe and get the room link (url)
        var roomLinkIframe: any = document.getElementsByTagName('iframe');
        var roomLinkElement: any = roomLinkIframe[0].contentDocument.getElementById('roomlink').getElementsByTagName('p');
        var roomLinkValue: any = roomLinkElement[0].getElementsByTagName('a');
        console.log(roomLinkValue[0].href); // room link (url)
        */
        window.roomURIlink = url;
        logger.c(`[ROOM] This room has a link : ${window.roomURIlink}`);
    }

    room.onKickRateLimitSet = function(min: number, rate: number, burst: number, byPlayer : PlayerObject): void {
        // Event called when the kick rate is set.
        let byPlayerInfo = '';
        if(byPlayer !== null) {
            byPlayerInfo = byPlayer.name + '#' + byPlayer.id;
        }
        logger.c(`[LIMIT] the kick rate is changed. (min:${min},rate:${rate},burst:${burst}) (by ` + byPlayerInfo + ')');
    }
}

function setDefaultStadiums(): void {
    // set stadium maps as default setting
    if(gameRule.statsRecord == true && gameMode == "stats") {
        room.setCustomStadium(gameRule.defaultMap); // if game mode is 'stats'
    } else {
        room.setCustomStadium(gameRule.readyMap); // if game mode is 'ready'
    }
}

function getCookieFromHeadless(name: string): string {
    var result = new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(document.cookie);
    return result ? result[1] : '';
}

function updateAdmins(): void {
    var placeholderUpdateAdmins = { // Parser.maketext(str, placeholder)
        playerID: 0,
        playerName: '',
        gameRuleName: gameRule.ruleName,
        gameRuleDescription: gameRule.ruleDescripttion,
        gameRuleLimitTime: gameRule.requisite.timeLimit,
        gameRuleLimitScore: gameRule.requisite.scoreLimit,
        gameRuleNeedMin: gameRule.requisite.minimumPlayers,
        possTeamRed: ballStack.possCalculate(1),
        possTeamBlue: ballStack.possCalculate(2),
        streakTeamName: winningStreak.getName(),
        streakTeamCount: winningStreak.getCount()
    };

    // Get all players except the host (id = 0 is always the host)
    var players = room.getPlayerList().filter((player: PlayerObject) => player.id != 0 && playerList.get(player.id).permissions.afkmode != true); // only no afk mode players
    if (players.length == 0) return; // If no players left, do nothing.
    if (players.find((player: PlayerObject) => player.admin) != null) return; // Do nothing if any admin player is still left.
    
    placeholderUpdateAdmins.playerID = players[0].id;
    placeholderUpdateAdmins.playerName = playerList.get(players[0].id).name;

    room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
    playerList.get(players[0].id).admin = true;
    logger.c(`[INFO] ${playerList.get(players[0].id).name}#${players[0].id} has been admin(value:${playerList.get(players[0].id).admin},super:${playerList.get(players[0].id).permissions.superadmin}), because there was no admin players.`);
    room.sendAnnouncement(parser.maketext(LangRes.funcUpdateAdmins.newAdmin, placeholderUpdateAdmins), null, 0x00FF00, "normal", 0);
}

function printPlayerInfo(player: PlayerObject): void {
    logger.c(`[INFO] NAME(${player.name}),ID(${player.id}),CONN(${player.conn}),AUTH(${player.auth})`);
}

function roomPlayersNumberCheck(): number {
    // return number of players joined this room
    return room.getPlayerList().filter((player: PlayerObject) => player.id != 0).length;
}

// on dev-console tools for emergency
window.onEmergency = {
    list: function(): void { // print list of players joined
        var players = room.getPlayerList().filter((player: PlayerObject) => player.id != 0);
        players.forEach((player: PlayerObject) => {
            console.log(`[EMERGENCY][LIST]${player.name}#${player.id}:team(${player.team}):admin(${player.admin})`);
        });
    },
    chat: function(msg: string, playerID?: number): void { // send chat
        if(playerID) {
            room.sendAnnouncement(msg, playerID, 0xFFFF00, "bold", 2);
        } else {
            room.sendAnnouncement(msg, null, 0xFFFF00, "bold", 2);
        }
    },
    kick: function(playerID: number, msg?: string): void { // kick the player
        if(msg) {
            room.kickPlayer(playerID, msg, false);
        } else {
            room.kickPlayer(playerID, 'by haxbotron', false);
        }
    },
    ban: function(playerID: number, msg?: string): void { // ban the player
        if(msg) {
            room.kickPlayer(playerID, msg, true);
        } else {
            room.kickPlayer(playerID, 'by haxbotron', true);
        }
    },
    banclear: function(): void { // clear all of ban list
        room.clearBans();
    }
}