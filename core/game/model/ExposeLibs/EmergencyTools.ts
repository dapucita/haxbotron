import { BanList } from "../PlayerBan/BanList";
import { PlayerObject } from "../GameObject/PlayerObject";

// on dev-console tools for emergency
export const EmergencyTools = {
    list: function(): void { // print list of players joined
        var players = window.gameRoom._room.getPlayerList().filter((player: PlayerObject) => player.id != 0);
        players.forEach((player: PlayerObject) => {
            console.log(`[EMERGENCY.LIST]${player.name}#${player.id} team(${player.team}) admin(${player.admin})`);
        });
    },
    chat: function(msg: string, playerID?: number): void { // send chat
        if(playerID) {
            window.gameRoom._room.sendAnnouncement(msg, playerID, 0xFFFF00, "bold", 2);
            console.log(`[EMERGENCY.CHAT] the message is sent to #${playerID}. message: ${msg}`);
        } else {
            window.gameRoom._room.sendAnnouncement(msg, null, 0xFFFF00, "bold", 2);
            console.log(`[EMERGENCY.CHAT] the message is sent. message: ${msg}`);
        }
    },
    kick: function(playerID: number, msg?: string): void { // kick the player
        if(msg) {
            window.gameRoom._room.kickPlayer(playerID, msg, false);
            console.log(`[EMERGENCY.KICK] #${playerID} is kicked. reason:${msg}`);
        } else {
            window.gameRoom._room.kickPlayer(playerID, 'by haxbotron', false);
            console.log(`[EMERGENCY.BAN] #${playerID} is kicked.`);
        }
    },
    ban: function(playerID: number, msg?: string): void { // ban the player
        if(msg) {
            window.gameRoom._room.kickPlayer(playerID, msg, true);
            console.log(`[EMERGENCY.BAN] #${playerID} is banned. reason:${msg}`);
        } else {
            window.gameRoom._room.kickPlayer(playerID, 'by haxbotron', true);
            console.log(`[EMERGENCY.BAN] #${playerID} is banned.`);
        }
    },
    /*
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
    */
    password: function(password?: string): void { // set or clear the password key of the room
        if(password) {
            window.gameRoom._room.setPassword(password);
            console.log(`[EMERGENCY.PASSWORD] password is changed. key:${password}`);
        } else { // can be null
            window.gameRoom._room.setPassword(null);
            console.log(`[EMERGENCY.PASSWORD] password is cleared.`);
        }
    }
}