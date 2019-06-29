//Bot

import { RoomConfig } from "./controller/RoomConfig";
import { stadiumText } from "./stadium/huge.hbs";
import { Player } from "./controller/Player";

const roomConfig:RoomConfig = {
    roomName: "TEST for Haxball by BOT",
    password: "HBTRON",
    maxPlayers: 13,
    //https://www.haxball.com/headlesstoken
    //token: "123123blahblah", //It doesn't need if bot is running on none-headless mode.
    public: true,
    playerName: "Bot"
}

var room = window.HBInit(roomConfig);

//room.setDefaultStadium("Big");
room.setCustomStadium(stadiumText);
room.setScoreLimit(3);
room.setTimeLimit(3);
room.setTeamsLock(true);

function updateAdmins(): void { 
    // Get all players except the host (id = 0 is always the host)
    var players = room.getPlayerList().filter((player: any) => player.id != 0 );
    if ( players.length == 0 ) return; // No players left, do nothing.
    if ( players.find((player: any) => player.admin) != null ) return; // There's an admin left so do nothing.
    room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
}


room.onPlayerJoin = function(player: any) {
    updateAdmins();
    room.sendChat( player.name + " - This message is sent for welcome you.");
}

room.onPlayerLeave = function(player: any) {
    updateAdmins();
}