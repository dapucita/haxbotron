// Bot that will injected into puppeteer

// import part
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
    gameRule
} from "./model/rules/captain.rule";
import {
    RStrings
} from "./resources/strings";
import {
    KickStack
} from "./model/BallTrace";


var roomAuthToken: string = getCookieFromHeadless('botToken');

console.log("====");
console.log('\x1b[32m%s\x1b[0m', "H a x b o t r o n"); //green color
console.log("Haxbotron Debugging System on headless chromium");
console.log(`The authentication token is conveyed via cookie(${roomAuthToken})`);
console.log("====");

// initial settings part
const roomConfig: RoomConfig = {
    roomName: "🤖 ĦΘ§Ŧ βΘŦ Ŧξ§Ŧ∫ŊŒ (in Development)",
    password: "hbtron",
    maxPlayers: 13,
    // https://www.haxball.com/headlesstoken
    token: roomAuthToken, //If this value doesn't exist, headless host api page will require to solving recaptcha.
    public: true,
    playerName: "🤖"
}
const playerList = new Map(); // playerList is an Map object. // playerList.get(player.id).name; : usage for playerList

const actionQueue: ActionQueue < ActionTicket > = ActionQueue.getInstance();
const ballStack: KickStack = KickStack.getInstance();

const logger: Logger = Logger.getInstance();
const parser: Parser = Parser.getInstance();

var gameMode: string = "ready"; // "ready", "stats"

var room: any = window.HBInit(roomConfig);
initialiseRoom();

setInterval(function (): void {
    //Loop timer for processing ActionTicket Queue.
    var timerTicket: ActionTicket | undefined = actionQueue.pop();
    if (timerTicket !== undefined) {
        switch (timerTicket.type) {
            case "selfnotice": {
                logger.c(`[QUEUE] type(${timerTicket.type}),owner(${playerList.get(timerTicket.ownerPlayerID).name}#${timerTicket.ownerPlayerID})`);
                room.sendChat(timerTicket.messageString, timerTicket.ownerPlayerID);
                break;
            }
            case "super": {
                logger.c(`[QUEUE] type(${timerTicket.type}),owner(${playerList.get(timerTicket.ownerPlayerID).name}#${timerTicket.ownerPlayerID})`);
                playerList.get(timerTicket.ownerPlayerID).permissions.superadmin = true;
                logger.c(`[SUPER] ${playerList.get(timerTicket.ownerPlayerID).name}#${timerTicket.ownerPlayerID} is super admin now.(super:${playerList.get(timerTicket.ownerPlayerID).permissions['superadmin']})`);
                room.sendChat(timerTicket.messageString, timerTicket.ownerPlayerID);
                break;
            }
            case "debug": {
                logger.c(`[QUEUE] type(${timerTicket.type}),owner(${playerList.get(timerTicket.ownerPlayerID).name}#${timerTicket.ownerPlayerID})`);
                logger.c(`[DEBUG] super:${playerList.get(timerTicket.ownerPlayerID).permissions['superadmin']}`);
                room.sendChat(timerTicket.messageString, timerTicket.ownerPlayerID);
                break;
            }
        }
    }
}, 0);

function initialiseRoom(): void {
    // Write initialising processes here.
    const nowDate: Date = new Date();
    localStorage.setItem('_LaunchTime', nowDate.toString()); // save time the bot launched in localStorage

    logger.c(`[HAXBOTRON] The game room is opened at ${nowDate.toString()}.`);

    gameMode = "ready" // no 'stats' not yet
    logger.c(`[MODE] Game mode is '${gameMode}'(by default).`);

    // room.setDefaultStadium("Big");
    room.setCustomStadium(gameRule.defaultMap);
    room.setScoreLimit(gameRule.requisite.scoreLimit);
    room.setTimeLimit(gameRule.requisite.timeLimit);
    room.setTeamsLock(gameRule.requisite.teamLock);

    room.onPlayerJoin = function (player: PlayerObject): void {
        // Event called when a new player joins the room.

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
                    captain: false,
                    superadmin: loadedData.superadmin
                }));
                if (player.name != loadedData.name) {
                    // if this player changed his/her name
                    // notify that fact to other players only once ( it will never be notified if he/she rejoined next time)
                    room.sendChat(`[System] ${player.name}#${player.id} has changed name from ${loadedData.name}`);
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
                captain: false,
                superadmin: false
            }));

        }

        setPlayerData(playerList.get(player.id)); // register(or update) in localStorage

        updateAdmins();

        // send welcome message to new player. other players cannot read this message.
        room.sendChat(`[System] Welcome, ${player.name}#${player.id}!`, player.id);

        // check number of players joined and change game mode
        if (gameRule.statsRecord == true && roomPlayersNumberCheck() >= gameRule.requisite.minimumPlayers) {
            if(gameMode != "stats") {
                room.sendChat("[System] Enough players has joined, so the game's result will be recorded from now.");
                gameMode = "stats";
            }
        } else {
            if(gameMode != "ready") {
                room.sendChat(`[System] Need more players. The game's result will not be recorded from now. (needs ${gameRule.requisite.minimumPlayers} players at least)`);
                gameMode = "ready";
            }
        }

        setDefaultStadiums(); // check number of players and auto-set stadium
    }

    room.onPlayerLeave = function (player: PlayerObject): void {
        // Event called when a player leaves the room.

        updateAdmins();
        logger.c(`[LEFT] ${player.name} has left.`);

        // check number of players joined and change game mode
        if (gameRule.statsRecord == true && roomPlayersNumberCheck() >= gameRule.requisite.minimumPlayers) {
            if(gameMode != "stats") {
                room.sendChat("[System] Enough players has joined, so the game's result will be recorded from now.");
                gameMode = "stats";
            }
        } else {
            if(gameMode != "ready") {
                room.sendChat(`[System] Need more players. The game's result will not be recorded from now. (needs ${gameRule.requisite.minimumPlayers} players at least)`);
                gameMode = "ready";
            }
        }

        setDefaultStadiums(); // check number of players and auto-set stadium
    }

    room.onPlayerChat = function (player: PlayerObject, message: string): boolean {
        // Event called when a player sends a chat message.
        // The event function can return false in order to filter the chat message.
        // Then It prevents the chat message from reaching other players in the room.
        if (playerList.get(player.id).permissions['mute'] == true) {
            logger.c(`[CHAT] ${player.name} said, "${message}", but ignored.`);
            room.sendChat(`[System] You are muted. You can't send message to others.`, player.id);
            return false;
        } else {
            logger.c(`[CHAT] ${player.name} said, "${message}"`);
            var evals: ActionTicket = parser.eval(message, player.id);
            if (evals.type != "none") {
                actionQueue.push(evals);
                return false; // if the chat message is command chat, filter the chat message to other players.
            }
            return true;
        }
    }

    room.onPlayerTeamChange = function (changedPlayer: PlayerObject, byPlayer: PlayerObject): void {
        // Event called when a player team is changed.
        // byPlayer is the player which caused the event (can be null if the event wasn't caused by a player).
        if (changedPlayer.id == 0) { //if the player changed into other team is host player(always id 0),
            room.setPlayerTeam(0, 0); //stay host player in Spectators team.
        } else {
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
        let msg = `[GAME] The game(mode:${gameMode}) has been started.`;
        if (byPlayer !== null && byPlayer.id != 0) {
            msg += `(by ${byPlayer.name}#${byPlayer.id})`;
        }
        if (gameRule.statsRecord == true && gameMode == "stats") {
            // if the game mode is stats, records the result of this game.
            room.sendChat(`[System] This game's result will be recorded in the statistics system!`);
        } else {
            room.sendChat(`[System] This game's result will not be recorded in the statistics system. (needs ${gameRule.requisite.minimumPlayers} players at least)`);
        }
        logger.c(msg);
    }

    room.onGameStop = function (byPlayer: PlayerObject): void {
        /* Event called when a game stops.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
        let msg = "[GAME] The game has been stopped.";
        if (byPlayer !== null && byPlayer.id != 0) {
            msg += `(by ${byPlayer.name}#${byPlayer.id})`;
        }
        logger.c(msg);
        setDefaultStadiums(); // check number of players and auto-set stadium
    }

    room.onTeamVictory = function (scores: ScoresObject): void {
        // Event called when a team 'wins'. not just when game ended.
        // recors vicotry in stats. total games also counted in this event.
        if (gameRule.statsRecord == true && gameMode == "stats") { // records when game mode is for stats recording.
            var gamePlayers: PlayerObject[] = room.getPlayerList().filter((player: PlayerObject) => player.team != 0); // except Spectators players
            var redPlayers: PlayerObject[] = gamePlayers.filter((player: PlayerObject) => player.team == 1); // except non Red players
            var bluePlayers: PlayerObject[] = gamePlayers.filter((player: PlayerObject) => player.team == 2); // except non Blue players
            if (scores.red > scores.blue) {
                // if Red wins
                redPlayers.forEach(function (eachPlayer: PlayerObject) {
                    playerList.get(eachPlayer.id).stats.wins++; //records a win
                });
            } else {
                // if Blue wins
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
        room.sendChat(`[System] The game has ended. Scores ${scores.red}:${scores.blue}!`);

        setDefaultStadiums(); // check number of players and auto-set stadium
    }

    room.onPlayerKicked = function (kickedPlayer: PlayerObject, reason: string, ban: boolean, byPlayer: PlayerObject): void {
        /* Event called when a player has been kicked from the room. This is always called after the onPlayerLeave event.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
        if (ban == true) {
            // ban
            if (playerList.get(byPlayer.id).permissions['superadmin'] != true) {
                // if the player who acted banning is not super admin
                room.sendChat(`[System] You can't ban other players. Act kicking if you need.`, byPlayer.id);
                room.sendChat(`[System] Banning ${kickedPlayer.name}#${kickedPlayer.id} player is negated.`);
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
        // Event called when the stadium is changed.
        if (playerList.size != 0 && byPlayer.id != 0) { // if size == 0, that means there's no players. byPlayer !=0  means that the map is changed by system, not player.
            if (playerList.get(byPlayer.id).permissions['superadmin'] == true) {
                //There are two ways for access to map value, permissions['superadmin'] and permissions.superadmin.
                logger.c(`[MAP] ${newStadiumName} has been loaded by ${byPlayer.name}#${byPlayer.id}.(super:${playerList.get(byPlayer.id).permissions['superadmin']})`);
                room.sendChat(`[System] ${newStadiumName} has been a new stadium.`);
            } else {
                // If trying for chaning stadium is rejected, reload default stadium.
                logger.c(`[MAP] ${byPlayer.name}#${byPlayer.id} tried to set a new stadium(${newStadiumName}), but it is rejected.(super:${playerList.get(byPlayer.id).permissions['superadmin']})`);
                // logger.c(`[DEBUG] ${playerList.get(byPlayer.id).name}`); for debugging
                room.sendChat(`[System] You can't change the stadium.`, byPlayer.id);
                setDefaultStadiums();
            }
        } else {
            logger.c(`[MAP] ${newStadiumName} has been loaded as default map.`);
        }
    }

    room.onPlayerBallKick = function (player: PlayerObject): void {
        // Event called when a player kicks the ball.
        // records player's id, team when the ball was kicked
        ballStack.push(player.id);
    }

    room.onTeamGoal = function (team: number): void {
        // Event called when a team scores a goal.
        // identify who has goaled.
        var touchPlayer: number | undefined = ballStack.pop();
        var assistPlayer: number | undefined = ballStack.pop();
        ballStack.clear(); // clear the stack.
        if (gameMode == "stats" && touchPlayer !== undefined) { // records when game mode is for stats recording.
            if (playerList.get(touchPlayer).team == team) {
                // if the goal is not OG
                playerList.get(touchPlayer).stats.goals++;
                setPlayerData(playerList.get(touchPlayer));
                var goalMsg: string = `[GOAL] ${playerList.get(touchPlayer).name}#${playerList.get(touchPlayer).id} made a goal!`;
                if (assistPlayer !== undefined && touchPlayer != assistPlayer && playerList.get(assistPlayer).team == team) {
                    // records assist when the player who assists is not same as the player goaled, and is not other team.
                    playerList.get(assistPlayer).stats.assists++;
                    setPlayerData(playerList.get(assistPlayer));
                    goalMsg += ` ${playerList.get(assistPlayer).name}#${playerList.get(assistPlayer).id} assisted the goal.`;
                }
                room.sendChat(goalMsg);
                logger.c(goalMsg);
            } else {
                // if the goal is OG
                playerList.get(touchPlayer).stats.ogs++;
                setPlayerData(playerList.get(touchPlayer));
                room.sendChat(`[GOAL] ${playerList.get(touchPlayer).name}#${playerList.get(touchPlayer).id} made an OG.`);
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
        // DO NOT document.write(). just access on IFrame elements.
        document.title = `🤖 Haxbotron - ${roomConfig.roomName}`; //HTML Title

        //let docIframe = document.getElementsByTagName('iframe');
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
    // Get all players except the host (id = 0 is always the host)
    var players = room.getPlayerList().filter((player: PlayerObject) => player.id != 0);
    if (players.length == 0) return; // No players left, do nothing.
    if (players.find((player: PlayerObject) => player.admin) != null) return; // There's an admin left so do nothing.
    room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
    playerList.get(players[0].id).admin = true;
    logger.c(`[INFO] ${playerList.get(players[0].id).name}#${players[0].id} has been admin(value:${playerList.get(players[0].id).admin},super:${playerList.get(players[0].id).permissions.superadmin}), because there was no admin players.`);
    room.sendChat(`[System] ${playerList.get(players[0].id).name} has been admin.`);
}

function printPlayerInfo(player: PlayerObject): void {
    logger.c(`[INFO] NAME(${player.name}),ID(${player.id}),CONN(${player.conn}),AUTH(${player.auth})`);
}

function roomPlayersNumberCheck(): number {
    // return number of players joined this room
    return room.getPlayerList().filter((player: PlayerObject) => player.id != 0).length;
}

function getPlayerData(playerAuth: string): PlayerStorage | null {
    // load player's data from localStorage
    var jsonData: string | null = localStorage.getItem(playerAuth);
    if (jsonData !== null) {
        var convertedData: PlayerStorage = JSON.parse(jsonData);
        return convertedData;
    } else {
        return null;
    }
}

function setPlayerData(player: Player): void {
    // store player's data in localStorage
    var playerData: PlayerStorage = {
        auth: player.auth, // same meaning as in PlayerObject. It can used for identify each of players.
        conn: player.conn, // same meaning as in PlayerObject.
        name: player.name, // save for compare player's current name and previous name.
        totals: player.stats.totals, // total games include wins
        wins: player.stats.wins, // the game wins
        goals: player.stats.goals, // not contains OGs.
        assists: player.stats.assists, // count for assist goal
        ogs: player.stats.ogs, // it means 'own goal' (in Korean, '자책골')
        losePoints: player.stats.losePoints, // it means the points this player lost (in Korean, '실점')
        mute: player.permissions.mute, // is this player muted?
        superadmin: player.permissions.superadmin // is this player super admin?
    }
    localStorage.setItem(player.auth, JSON.stringify(playerData)); // convert object to json for store in localStorage // for decode: JSON.parse
}