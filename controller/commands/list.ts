import { PlayerObject } from "../../model/PlayerObject";
import * as LangRes from "../../resources/strings";
import * as Tst from "../Translator";

export function cmdList(byPlayer: PlayerObject, message?: string): void {
    if (message !== undefined) {
        var placeholder = {
            whoisResult: LangRes.command.list._ErrorNoOne
        }
        switch (message) {
            case "mute": {
                let players = window.room.getPlayerList().filter((player: PlayerObject) => player.id != 0 && window.playerList.get(player.id).permissions.mute === true);
                if (players.length >= 1) {
                    placeholder.whoisResult = '🔇 '; //init
                    players.forEach((player: PlayerObject) => {
                        placeholder.whoisResult += player.name + '#' + player.id + ', ';
                    });
                }
                window.room.sendAnnouncement(Tst.maketext(LangRes.command.list.whoisList, placeholder), byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "red": {
                let players = window.room.getPlayerList().filter((player: PlayerObject) => player.id != 0 && player.team == 1);
                if (players.length >= 1) {
                    placeholder.whoisResult = ''; //init
                    players.forEach((player: PlayerObject) => {
                        let muteFlag: string = '';
                        if (window.playerList.get(player.id).permissions.mute == true) {
                            muteFlag = '🔇';
                        }
                        placeholder.whoisResult += player.name + '#' + player.id + muteFlag + ', ';
                    });
                }
                window.room.sendAnnouncement(Tst.maketext(LangRes.command.list.whoisList, placeholder), byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "blue": {
                let players = window.room.getPlayerList().filter((player: PlayerObject) => player.id != 0 && player.team == 2);
                if (players.length >= 1) {
                    placeholder.whoisResult = ''; //init
                    players.forEach((player: PlayerObject) => {
                        let muteFlag: string = '';
                        if (window.playerList.get(player.id).permissions.mute == true) {
                            muteFlag = '🔇';
                        }
                        placeholder.whoisResult += player.name + '#' + player.id + muteFlag + ', ';
                    });
                }
                window.room.sendAnnouncement(Tst.maketext(LangRes.command.list.whoisList, placeholder), byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case "spec": {
                let players = window.room.getPlayerList().filter((player: PlayerObject) => player.id != 0 && player.team == 0);
                if (players.length >= 1) {
                    placeholder.whoisResult = ''; //init
                    players.forEach((player: PlayerObject) => {
                        let muteFlag: string = '';
                        if (window.playerList.get(player.id).permissions.mute == true) {
                            muteFlag = '🔇';
                        }
                        placeholder.whoisResult += player.name + '#' + player.id + muteFlag + ', ';
                    });
                }
                window.room.sendAnnouncement(Tst.maketext(LangRes.command.list.whoisList, placeholder), byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            default: {
                window.room.sendAnnouncement(LangRes.command.list._ErrorNoTeam, byPlayer.id, 0xFF7777, "normal", 2);
                break;
            }
        }
    } else {
        window.room.sendAnnouncement(LangRes.command.list._ErrorNoTeam, byPlayer.id, 0xFF7777, "normal", 2);
    }
}