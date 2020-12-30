import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { TeamID } from "../../model/GameObject/TeamID";
import * as LangRes from "../../resources/strings";
import * as CommandSet from "../../resources/command.json";
import * as Tst from "../Translator";

export function cmdList(byPlayer: PlayerObject, message?: string): void {
    if (message !== undefined) {
        var placeholder = {
            whoisResult: LangRes.command.list._ErrorNoOne
        }
        switch (message) {
            case CommandSet._listSubafk: {
                let players = window.room.getPlayerList().filter((player: PlayerObject) => player.id != 0 && window.playerList.get(player.id)!.permissions.afkmode === true);
                if (players.length >= 1) {
                    placeholder.whoisResult = '💤 '; //init
                    players.forEach((player: PlayerObject) => {
                        placeholder.whoisResult += player.name + '#' + player.id + ', ';
                    });
                }
                window.room.sendAnnouncement(Tst.maketext(LangRes.command.list.whoisList, placeholder), byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._listSubmute: {
                let players = window.room.getPlayerList().filter((player: PlayerObject) => player.id != 0 && window.playerList.get(player.id)!.permissions.mute === true);
                if (players.length >= 1) {
                    placeholder.whoisResult = '🔇 '; //init
                    players.forEach((player: PlayerObject) => {
                        placeholder.whoisResult += player.name + '#' + player.id + ', ';
                    });
                }
                window.room.sendAnnouncement(Tst.maketext(LangRes.command.list.whoisList, placeholder), byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._listSubred: {
                let players = window.room.getPlayerList().filter((player: PlayerObject) => player.id != 0 && player.team === TeamID.Red);
                if (players.length >= 1) {
                    placeholder.whoisResult = ''; //init
                    players.forEach((player: PlayerObject) => {
                        let muteFlag: string = '';
                        let afkFlag: string = '';
                        if (window.playerList.get(player.id)!.permissions.mute === true) {
                            muteFlag = '🔇';
                        }
                        if (window.playerList.get(player.id)!.permissions.afkmode === true) {
                            afkFlag = '💤';
                        }
                        placeholder.whoisResult += player.name + '#' + player.id + muteFlag + afkFlag + ', ';
                    });
                }
                window.room.sendAnnouncement(Tst.maketext(LangRes.command.list.whoisList, placeholder), byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._listSubblue: {
                let players = window.room.getPlayerList().filter((player: PlayerObject) => player.id != 0 && player.team === TeamID.Blue);
                if (players.length >= 1) {
                    placeholder.whoisResult = ''; //init
                    players.forEach((player: PlayerObject) => {
                        let muteFlag: string = '';
                        let afkFlag: string = '';
                        if (window.playerList.get(player.id)!.permissions.mute === true) {
                            muteFlag = '🔇';
                        }
                        if (window.playerList.get(player.id)!.permissions.afkmode === true) {
                            afkFlag = '💤';
                        }
                        placeholder.whoisResult += player.name + '#' + player.id + muteFlag + afkFlag + ', ';
                    });
                }
                window.room.sendAnnouncement(Tst.maketext(LangRes.command.list.whoisList, placeholder), byPlayer.id, 0x479947, "normal", 1);
                break;
            }
            case CommandSet._listSubspec: {
                let players = window.room.getPlayerList().filter((player: PlayerObject) => player.id != 0 && player.team === TeamID.Spec);
                if (players.length >= 1) {
                    placeholder.whoisResult = ''; //init
                    players.forEach((player: PlayerObject) => {
                        let muteFlag: string = '';
                        let afkFlag: string = '';
                        if (window.playerList.get(player.id)!.permissions.mute === true) {
                            muteFlag = '🔇';
                        }
                        if (window.playerList.get(player.id)!.permissions.afkmode === true) {
                            afkFlag = '💤';
                        }
                        placeholder.whoisResult += player.name + '#' + player.id + muteFlag + afkFlag + ', ';
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
