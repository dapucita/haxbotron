// Bot that will injected into puppeteer

// import part
import { RoomConfig } from "./controller/RoomConfig";
import { stadiumText } from "./stadium/huge.hbs";
import { Player } from "./controller/Player";
import { Logger } from "./controller/Logger";
import { PlayerObject } from "./controller/PlayerObject";

// initial settings part
const roomConfig:RoomConfig = {
    roomName: "BOT TESTING ROOM - IN DEVELOPMENT",
    password: "HBTRON",
    maxPlayers: 13,
    // https://www.haxball.com/headlesstoken
    // token: "123123blahblah", //It doesn't need if bot is running on none-headless mode.
    public: true,
    playerName: "Haxbotron"
}
const playerList = new Map();

var logger: Logger = Logger.getInstance();
var room = window.HBInit(roomConfig);
initialiseRoom();

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

        updateAdmins();
    
        // add new player into playerList by creating class instance
        // playerList is an Map object.
        playerList.set(player.id, new Player(player.id, player.name, player.auth, player.conn, player.admin, player.team, player.position, {totals: 0, wins: 0},false));
        // playerList.get(player.id).name; : just usage of playerList

        // send welcome message to new player. other players cannot read this message.
        room.sendChat(`[System] Welcome, ${player.name}#${player.id}!`, player.id);
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
        // This prevents the chat message from reaching other players in the room.
    
        logger.c(`[CHAT] ${player.name} said, "${message}"`);

        return true;
    }

    room.onPlayerTeamChange = function(changedPlayer: PlayerObject, byPlayer: PlayerObject): void {
        // Event called when a player team is changed.
        // byPlayer is the player which caused the event (can be null if the event wasn't caused by a player).
        if(changedPlayer.id == 0) { //if the player changed into othere team is host player(always id 0),
            room.setPlayerTeam(0, 0); //stay host player in Spectators team.
        }
    }

    function updateAdmins(): void { 
        // Get all players except the host (id = 0 is always the host)
        var players = room.getPlayerList().filter((player: PlayerObject) => player.id != 0 );
        if ( players.length == 0 ) return; // No players left, do nothing.
        if ( players.find((player: PlayerObject) => player.admin) != null ) return; // There's an admin left so do nothing.
        room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
    }

    function printPlayerInfo(player: PlayerObject): void {
        logger.c(`[INFO] NAME(${player.name}),ID(${player.id}),CONN(${player.conn},AUTH(${player.auth})`);
    }
}
