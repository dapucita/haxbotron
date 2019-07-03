// Bot that will injected into puppeteer

// import part
import { RoomConfig } from "./controller/RoomConfig";
import { stadiumText } from "./stadium/huge.hbs";
import { Player } from "./controller/Player";
import { Logger } from "./controller/Logger";
import { PlayerObject } from "./controller/PlayerObject";
import { ScoresObject } from "./controller/ScoresObject";
import { ActionQueue, ActionTicket } from "./controller/Action";
import { Parser } from "./controller/Parser";
import { RStrings } from "./resources/strings"; 


console.log(`[DEBUG] headless token is conveyed via cookie(${getCookieFromHeadless('botToken')})`);

// initial settings part
const roomConfig: RoomConfig = {
    roomName: "BOT TESTING ROOM - IN DEVELOPMENT",
    password: "HBTRON",
    maxPlayers: 13,
    // https://www.haxball.com/headlesstoken
    token: getCookieFromHeadless('botToken'), //If this value doesn't exist, headless host api page will require to solving recaptcha.
    public: true,
    playerName: "Haxbotron"
}
const playerList = new Map();

const actionQueue: ActionQueue<ActionTicket> = ActionQueue.getInstance();
const logger: Logger = Logger.getInstance();
const parser: Parser = Parser.getInstance();

var room = window.HBInit(roomConfig);
initialiseRoom();

setInterval(function():void {
    //Loop timer for processing ActionTicket Queue.
    var timerTicket: ActionTicket|undefined = actionQueue.pop();
    if(timerTicket !== undefined) {
        switch(timerTicket.type) {
            case "selfnotice":
                logger.c(`[QUEUE] type(${timerTicket.type}),owner(${playerList.get(timerTicket.ownerPlayerID).name}#${timerTicket.ownerPlayerID})`);
                room.sendChat(timerTicket.messageString, timerTicket.ownerPlayerID);
                break;
        }
    }
}, 0);

function initialiseRoom(): void {
    // Write initialising processes here.

    // room.setDefaultStadium("Big");
    room.setCustomStadium(stadiumText);
    room.setScoreLimit(3);
    room.setTimeLimit(3);
    room.setTeamsLock(true);

    room.onPlayerJoin = function(player: PlayerObject): void {
        // Event called when a new player joins the room.
    
        // logging into console (debug)
        logger.c(`[JOIN] ${player.name} has joined.`);
        printPlayerInfo(player);

        // add new player into playerList by creating class instance
        // playerList is an Map object.
        playerList.set(player.id, new Player(player, {totals: 0, wins: 0}, { mute: false, afkmode: false, captain: false, super: false }));
        // playerList.get(player.id).name; : just usage of playerList

        updateAdmins();

        // send welcome message to new player. other players cannot read this message.
        room.sendChat(`[System] Welcome, ${player.name}#${player.id}!`, player.id);
        //room.sendChat(RStrings.joinMessage, player.id);
        room.sendChat(`[System] You wins ${playerList.get(player.id).stats.wins} of total ${playerList.get(player.id).stats.totals} games.`, player.id);
    }
    
    room.onPlayerLeave = function(player: PlayerObject): void {
        // Event called when a player leaves the room.
    
        updateAdmins();
        logger.c(`[LEFT] ${player.name} has left.`);
    }
    
    room.onPlayerChat = function(player: PlayerObject, message: string): boolean {
        // Event called when a player sends a chat message.
        // The event function can return false in order to filter the chat message.
        // Then It prevents the chat message from reaching other players in the room.
        if(playerList.get(player.id).permissions.mute == true) {
            logger.c(`[CHAT] ${player.name} said, "${message}", but ignored.`);
            room.sendChat(`[System] You are muted. You can't send message to others.`, player.id);
            return false;
        } else {
            logger.c(`[CHAT] ${player.name} said, "${message}"`);
            var evals: ActionTicket = parser.eval(message, player.id);
            if(evals.type != "none") {
                actionQueue.push(evals);
            }
            return true;
        }
    }

    room.onPlayerTeamChange = function(changedPlayer: PlayerObject, byPlayer: PlayerObject): void {
        // Event called when a player team is changed.
        // byPlayer is the player which caused the event (can be null if the event wasn't caused by a player).
        if(changedPlayer.id == 0) { //if the player changed into othere team is host player(always id 0),
            room.setPlayerTeam(0, 0); //stay host player in Spectators team.
        }
    }

    room.onTeamVictory = function(scores: ScoresObject): void {
        // Event called when a team wins.
        room.sendChat(`[System] The game has ended. Scores ${scores.red}:${scores.blue}!`);
    }

    room.onStadiumChange = function(newStadiumName: string, byPlayer: PlayerObject ): void {
        // Event called when the stadium is changed.
        if(playerList.get(byPlayer.id).permissions.super == true) {
            logger.c(`[MAP] ${newStadiumName} has been loaded by ${byPlayer.name}#${byPlayer.id}.(super:${playerList.get(byPlayer.id).permissions.super})`);
            room.sendChat(`[System] ${newStadiumName} has been a new stadium.`);
        } else {
            // If trying for chaning stadium is rejected, reload default stadium.
            logger.c(`[MAP] ${byPlayer.name}#${byPlayer.id} tried to set a new stadium(${newStadiumName}), but it is rejected.`);
            room.sendChat(`[System] You can't change the stadium.`, byPlayer.id);
            room.setCustomStadium(stadiumText);
        }
    }

    function updateAdmins(): void { 
        // Get all players except the host (id = 0 is always the host)
        var players = room.getPlayerList().filter((player: PlayerObject) => player.id != 0 );
        if ( players.length == 0 ) return; // No players left, do nothing.
        if ( players.find((player: PlayerObject) => player.admin) != null ) return; // There's an admin left so do nothing.
        room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
        playerList.get(players[0].id).permissions.admin = true;
        logger.c(`[INFO] ${playerList.get(players[0].id).name}#${players[0].id} has been admin(value:${playerList.get(players[0].id).permissions.admin}), because there was no admin players.`)
    }

    function printPlayerInfo(player: PlayerObject): void {
        logger.c(`[INFO] NAME(${player.name}),ID(${player.id}),CONN(${player.conn}),AUTH(${player.auth})`);
    }
}

function getCookieFromHeadless(name: string): string {
    var result = new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(document.cookie);
    return result ? result[1] : '';
}
