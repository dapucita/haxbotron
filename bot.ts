// Haxbotron
// This is the main part of the bot

// import modules
import {
    RoomConfig
} from "./controller/RoomConfig";
import {
    Player
} from "./controller/Player";
import {
    Logger
} from "./controller/Logger";
import {
    PlayerObject,
    PlayerStorage
} from "./controller/PlayerObject";
import {
    ScoresObject
} from "./controller/ScoresObject";
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

window.logQueue = []; // init

const botConfig: RoomConfig = JSON.parse(getCookieFromHeadless('botConfig'));

console.log("====");
console.log('\x1b[32m%s\x1b[0m', "H a x b o t r o n"); //green color
console.log("Haxbotron Debugging System on headless chromium");
console.log(`The authentication token is conveyed via cookie(${botConfig.token})`);
console.log("====");

// initial settings part
const roomConfig: RoomConfig = {
    roomName: botConfig.roomName,
    password: botConfig.password,
    maxPlayers: botConfig.maxPlayers,
    // https://www.haxball.com/headlesstoken
    token: botConfig.token, //If this value doesn't exist, headless host api page will require to solving recaptcha.
    public: botConfig.public,
    playerName: botConfig.playerName
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

var gameMode: string = "ready"; // "ready", "stats"

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
            gameRuleName: gameRule.ruleName,
            gameRuleDescription: gameRule.ruleDescripttion,
            gameRuleLimitTime: gameRule.requisite.timeLimit,
            gameRuleLimitScore: gameRule.requisite.scoreLimit,
            gameRuleNeedMin: gameRule.requisite.minimumPlayers,
            possTeamRed: ballStack.possCalculate(1),
            possTeamBlue: ballStack.possCalculate(2),
            streakTeamName: winningStreak.getName(),
            streakTeamCount: winningStreak.getCount()
        }
        
        switch (timerTicket.type) {
            case "info": {
                if(timerTicket.action) {
                    timerTicket.action(timerTicket.ownerPlayerID, playerList);
                }
                if(timerTicket.messageString) {
                    if(timerTicket.selfnotify == true) {
                        room.sendChat(parser.maketext(timerTicket.messageString, placeholderQueueCommand), timerTicket.ownerPlayerID);
                    } else {
                        room.sendChat(parser.maketext(timerTicket.messageString, placeholderQueueCommand));
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
                        room.sendChat(parser.maketext(timerTicket.messageString, placeholderQueueCommand), timerTicket.ownerPlayerID);
                    } else {
                        room.sendChat(parser.maketext(timerTicket.messageString, placeholderQueueCommand));
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
                        room.sendChat(parser.maketext(timerTicket.messageString, placeholderQueueCommand), timerTicket.ownerPlayerID);
                    } else {
                        room.sendChat(parser.maketext(timerTicket.messageString, placeholderQueueCommand));
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
                        room.sendChat(parser.maketext(timerTicket.messageString, placeholderQueueCommand), timerTicket.ownerPlayerID);
                    } else {
                        room.sendChat(parser.maketext(timerTicket.messageString, placeholderQueueCommand));
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
                        room.sendChat(parser.maketext(timerTicket.messageString, placeholderQueueCommand), timerTicket.ownerPlayerID);
                    } else {
                        room.sendChat(parser.maketext(timerTicket.messageString, placeholderQueueCommand));
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
    room.sendChat(LangRes.announcement.advertise);
}, 90000); // by 1m30s

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
            room.sendChat(msg, playerID);
        } else {
            room.sendChat(msg);
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
            streakTeamCount: winningStreak.getCount()
        };
        
        // logging into console (debug)
        logger.c(`[JOIN] ${player.name} has joined.`);
        printPlayerInfo(player);

        // add the player who joined into playerList by creating class instance
        if (localStorage.getItem(player.auth) !== null) {
            // if this player is not new player
            var loadedData: PlayerStorage | null = getPlayerData(player.auth);
            if (loadedData !== null) {
                playerList.set(player.id, new Player(player, {
                    totals: loadedData.totals,
                    wins: loadedData.wins,
                    goals: loadedData.goals,
                    assists: loadedData.assists,
                    ogs: loadedData.ogs,
                    losePoints: loadedData.losePoints
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
                    room.sendChat(parser.maketext(LangRes.onJoin.changename, placeholderJoin));
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
                losePoints: 0
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
        room.sendChat(parser.maketext(LangRes.onJoin.welcome, placeholderJoin), player.id);

        // check number of players joined and change game mode
        if (gameRule.statsRecord == true && roomPlayersNumberCheck() >= gameRule.requisite.minimumPlayers) {
            if(gameMode != "stats") {
                room.sendChat(parser.maketext(LangRes.onJoin.startRecord, placeholderJoin));
                gameMode = "stats";
            }
        } else {
            if(gameMode != "ready") {
                room.sendChat(parser.maketext(LangRes.onJoin.stopRecord, placeholderJoin));
                gameMode = "ready";
            }
        }

        setDefaultStadiums(); // check number of players and auto-set stadium
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

        updateAdmins();
        logger.c(`[LEFT] ${player.name} has left.`);

        // check number of players joined and change game mode
        if (gameRule.statsRecord == true && roomPlayersNumberCheck() >= gameRule.requisite.minimumPlayers) {
            if(gameMode != "stats") {
                room.sendChat(parser.maketext(LangRes.onLeft.startRecord, placeholderLeft));
                gameMode = "stats";
            }
        } else {
            if(gameMode != "ready") {
                room.sendChat(parser.maketext(LangRes.onLeft.stopRecord, placeholderLeft));
                gameMode = "ready";
            }
        }

        setDefaultStadiums(); // check number of players and auto-set stadium
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

        var msg = `[CHAT] ${player.name} said, "${message}"`;
        var evals: ActionTicket = parser.eval(message, player.id); // evaluate whether the message is command chat
        if (evals.type != "none") { // if the message is command chat (not 'none' type)
            // albeit this player is muted, the player can command by chat.
            actionQueue.push(evals); // and push it it queue.
            return false; // and filter the chat message to other players.
        } else { // if the message is normal chat ('none' type)
            if (playerList.get(player.id).permissions['mute'] == true) { // if the player is muted
                msg += ' but ignored.';
                room.sendChat(parser.maketext(LangRes.onChat.mutedChat, placeholderChat), player.id); // notify that fact
                return false; // and filter the chat message to other players.
            }
        }
        logger.c(msg);
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
            if(byPlayer.id != 0 && playerList.get(changedPlayer.id).permissions.afkmode == true) {
                placeholderTeamChange.targetAfkReason = playerList.get(changedPlayer.id).permissions.afkreason;
                room.setPlayerTeam(changedPlayer.id, 0); // stay the player in Spectators team.
                room.sendChat(parser.maketext(LangRes.onTeamChange.afkPlayer, placeholderTeamChange));
            }
            playerList.get(changedPlayer.id).team = changedPlayer.team;
        }

    }

    room.onPlayerAdminChange = function (changedPlayer: PlayerObject, byPlayer: PlayerObject): void {
        /* Event called when a player's admin rights are changed.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
        if (playerList.size != 0 && playerList.get(changedPlayer.id).admin != true) {
            playerList.get(changedPlayer.id).admin = true;
            if (byPlayer !== null) {
                logger.c(`[INFO] ${changedPlayer.name}#${changedPlayer.id} has been admin(value:${playerList.get(changedPlayer.id).admin},super:${playerList.get(changedPlayer.id).permissions.superadmin}) by ${byPlayer.name}#${byPlayer.id}`);
            }
        }
    }

    room.onGameStart = function (byPlayer: PlayerObject): void {
        /* Event called when a game starts.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
        var placeholderStart = { // Parser.maketext(str, placeholder)
            playerID: byPlayer.id,
            playerName: byPlayer.name,
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

        
        let msg = `[GAME] The game(mode:${gameMode}) has been started.`;
        if (byPlayer !== null && byPlayer.id != 0) {
            msg += `(by ${byPlayer.name}#${byPlayer.id})`;
        }
        if (gameRule.statsRecord == true && gameMode == "stats") {
            // if the game mode is stats, records the result of this game.
            room.sendChat(parser.maketext(LangRes.onStart.startRecord, placeholderStart));
        } else {
            room.sendChat(parser.maketext(LangRes.onStart.stopRecord, placeholderStart));
        }
        logger.c(msg);
    }

    room.onGameStop = function (byPlayer: PlayerObject): void {
        /* Event called when a game stops.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
        var placeholderStop = { // Parser.maketext(str, placeholder)
            playerID: byPlayer.id,
            playerName: byPlayer.name,
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


        let msg = "[GAME] The game has been stopped.";
        if (byPlayer !== null && byPlayer.id != 0) {
            msg += `(by ${byPlayer.name}#${byPlayer.id})`;
        }
        logger.c(msg);
        setDefaultStadiums(); // check number of players and auto-set stadium
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
        }

        ballStack.clear(); // clear the stack.

        logger.c(`[RESULT] The game has ended. Scores ${scores.red}:${scores.blue}.`)
        room.sendChat(parser.maketext(LangRes.onVictory.victory, placeholderVictory));

        setDefaultStadiums(); // check number of players and auto-set stadium
    }

    room.onPlayerKicked = function (kickedPlayer: PlayerObject, reason: string, ban: boolean, byPlayer: PlayerObject): void {
        /* Event called when a player has been kicked from the room. This is always called after the onPlayerLeave event.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
        var placeholderKick = { // Parser.maketext(str, placeholder)
            kickedID : kickedPlayer.id,
            kickedName : kickedPlayer.name,
            kickerID : byPlayer.id,
            kickerName : byPlayer.name,
            reason : reason,
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


        if (byPlayer !== null && byPlayer.id != 0 && ban == true) {
            // ban
            if (playerList.get(byPlayer.id).permissions['superadmin'] != true) {
                // if the player who acted banning is not super admin
                room.sendChat(parser.maketext(LangRes.onKick.cannotBan, placeholderKick), byPlayer.id);
                room.sendChat(parser.maketext(LangRes.onKick.notifyNotBan, placeholderKick));
                room.clearBan(kickedPlayer.id); // Clears the ban for a playerId that belonged to a player that was previously banned.
                logger.c(`[BAN] ${kickedPlayer.name}#${kickedPlayer.id} has been banned by ${byPlayer.name}#${byPlayer.id} (reason:${reason}), but it is negated.`);
            } else {
                logger.c(`[BAN] ${kickedPlayer.name}#${kickedPlayer.id} has been banned by ${byPlayer.name}#${byPlayer.id}. (reason:${reason}).`);
            }
        } else {
            // kick
            logger.c(`[KICK] ${kickedPlayer.name}#${kickedPlayer.id} has been kicked by ${byPlayer.name}#${byPlayer.id}. (reason:${reason})`);
        }
    }

    //room.onStadiumChange = function(newStadiumName: string, byPlayer: PlayerObject ): void {
    room.onStadiumChange = function (newStadiumName: string, byPlayer: PlayerObject) {
        var placeholderStadium = { // Parser.maketext(str, placeholder)
            playerID: byPlayer.id,
            playerName: byPlayer.name,
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
        if (playerList.size != 0 && byPlayer.id != 0) { // if size == 0, that means there's no players. byPlayer !=0  means that the map is changed by system, not player.
            if (playerList.get(byPlayer.id).permissions['superadmin'] == true) {
                //There are two ways for access to map value, permissions['superadmin'] and permissions.superadmin.
                logger.c(`[MAP] ${newStadiumName} has been loaded by ${byPlayer.name}#${byPlayer.id}.(super:${playerList.get(byPlayer.id).permissions['superadmin']})`);
                room.sendChat(parser.maketext(LangRes.onStadium.loadNewStadium, placeholderStadium));
            } else {
                // If trying for chaning stadium is rejected, reload default stadium.
                logger.c(`[MAP] ${byPlayer.name}#${byPlayer.id} tried to set a new stadium(${newStadiumName}), but it is rejected.(super:${playerList.get(byPlayer.id).permissions['superadmin']})`);
                // logger.c(`[DEBUG] ${playerList.get(byPlayer.id).name}`); for debugging
                room.sendChat(parser.maketext(LangRes.onStadium.cannotChange, placeholderStadium), byPlayer.id);
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
                room.sendChat(goalMsg);
                logger.c(goalMsg);
            } else {
                // if the goal is OG
                placeholderGoal.ogID = playerList.get(touchPlayer).id;
                placeholderGoal.ogName = playerList.get(touchPlayer).name;
                playerList.get(touchPlayer).stats.ogs++;
                setPlayerData(playerList.get(touchPlayer));
                room.sendChat(parser.maketext(LangRes.onGoal.og, placeholderGoal));
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

    room.onRoomLink = function (url: string): void {
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
    var players = room.getPlayerList().filter((player: PlayerObject) => player.id != 0);
    if (players.length == 0) return; // If no players left, do nothing.
    if (players.find((player: PlayerObject) => player.admin) != null) return; // Do nothing if any admin player is still left.
    
    placeholderUpdateAdmins.playerID = players[0].id;
    placeholderUpdateAdmins.playerName = playerList.get(players[0].id).name;

    room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
    playerList.get(players[0].id).admin = true;
    logger.c(`[INFO] ${playerList.get(players[0].id).name}#${players[0].id} has been admin(value:${playerList.get(players[0].id).admin},super:${playerList.get(players[0].id).permissions.superadmin}), because there was no admin players.`);
    room.sendChat(parser.maketext(LangRes.funcUpdateAdmins.newAdmin, placeholderUpdateAdmins));
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
    list: function(): void {
        var players = room.getPlayerList().filter((player: PlayerObject) => player.id != 0);
        players.forEach((player: PlayerObject) => {
            console.log(`[EMERGENCY][LIST]${player.name}#${player.id}:team(${player.team}):admin(${player.admin})`);
        });
    },
    chat: function(msg: string, playerID?: number): void {
        if(playerID) {
            room.sendChat(msg, playerID);
        } else {
            room.sendChat(msg);
        }
    },
    kick: function(playerID: number, ban: boolean, msg?: string): void {
        if(msg) {
            room.kickPlayer(playerID, msg, ban);
        } else {
            room.kickPlayer(playerID, 'by haxbotron', ban);
        }
    },
    banclear: function(): void {
        room.clearBans();
    }
}