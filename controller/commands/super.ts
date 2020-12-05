import { PlayerObject } from "../../model/PlayerObject";
import * as LangRes from "../../resources/strings";
import { superAdminLogin } from "../SuperAdmin";
import * as Ban from "../Ban";

export function cmdSuper(byPlayer: PlayerObject, message?: string, submessage?: string): void {
    if (message !== undefined) {
        switch (message) {
            case "login": {
                if (window.playerList.get(byPlayer.id)!.permissions.superadmin == false) { // only when not yet loginned
                    if (submessage !== undefined) { // key check and login
                        if (superAdminLogin(submessage) == true) { // if login key is matched
                            window.playerList.get(byPlayer.id)!.permissions.superadmin = true; // set super admin
                            //setPlayerData(playerList.get(playerID)); // update
                            window.room.sendAnnouncement(LangRes.command.super.loginSuccess, byPlayer.id, 0x479947, "normal", 2);
                        } else {
                            window.room.sendAnnouncement(LangRes.command.super.loginFail, byPlayer.id, 0xFF7777, "normal", 2);
                        }
                    } else {
                        window.room.sendAnnouncement(LangRes.command.super.loginFailNoKey, byPlayer.id, 0xFF7777, "normal", 2);
                    }
                } else {
                    window.room.sendAnnouncement(LangRes.command.super._ErrorLoginAlready, byPlayer.id, 0xFF7777, "normal", 2);
                }

                break;
            }

            case "logout": {
                if (window.playerList.get(byPlayer.id)!.permissions.superadmin == true) { // only when loginned
                    window.playerList.get(byPlayer.id)!.permissions.superadmin = false; // disqualify super admin
                    //setPlayerData(playerList.get(playerID)); // update
                    window.room.sendAnnouncement(LangRes.command.super.logoutSuccess, byPlayer.id, 0x479947, "normal", 2);
                } else {
                    window.room.sendAnnouncement(LangRes.command.super._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 2);
                }

                break;
            }

            case "thor": {
                if (window.playerList.get(byPlayer.id)!.permissions.superadmin == true) {
                    window.room.setPlayerAdmin(byPlayer.id, true); // first, give admin
                    window.playerList.get(byPlayer.id)!.admin = true;
                    if (submessage !== undefined && submessage == 'deprive') { // get admin list except this super admin 
                        let players = window.room.getPlayerList().filter((player: PlayerObject) => player.id != 0 && player.id != byPlayer.id && player.admin == true);
                        if (players.length == 0) { // If no players left, do nothing.
                            window.room.sendAnnouncement(LangRes.command.super.thor.noAdmins, byPlayer.id, 0xFF7777, "normal", 2);
                            return;
                        } else {
                            window.room.sendAnnouncement(LangRes.command.super.thor.deprive, byPlayer.id, 0x479947, "normal", 2);
                            players.forEach((player: PlayerObject) => { // disqualify admin permission
                                window.room.setPlayerAdmin(player.id, false);
                                window.playerList.get(player.id)!.admin = false;
                            });
                        }
                    } else {
                        window.room.sendAnnouncement(LangRes.command.super.thor.complete, byPlayer.id, 0x479947, "normal", 2);
                    }
                } else {
                    window.room.sendAnnouncement(LangRes.command.super._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 2);
                }

                break;
            }

            case "kick": {
                if (window.playerList.get(byPlayer.id)!.permissions.superadmin == true) { // only when loginned
                    if (submessage !== undefined && submessage.charAt(0) == "#") {
                        let target: number = parseInt(submessage.substr(1), 10);
                        if (isNaN(target) != true && window.playerList.has(target) == true) {
                            window.room.kickPlayer(target, LangRes.command.super.kick.kickMsg, false); // kick
                            window.room.sendAnnouncement(LangRes.command.super.kick.kickSuccess, byPlayer.id, 0x479947, "normal", 2);
                        } else {
                            window.room.sendAnnouncement(LangRes.command.super.kick.noID, byPlayer.id, 0xFF7777, "normal", 2);
                        }
                    } else {
                        window.room.sendAnnouncement(LangRes.command.super.kick.noID, byPlayer.id, 0xFF7777, "normal", 2);
                    }
                } else {
                    window.room.sendAnnouncement(LangRes.command.super._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 2);
                }

                break;
            }

            case "ban": {
                if (window.playerList.get(byPlayer.id)!.permissions.superadmin == true) { // only when loginned
                    if (submessage !== undefined && submessage.charAt(0) == "#") {
                        let target: number = parseInt(submessage.substr(1), 10);
                        if (isNaN(target) != true && window.playerList.has(target) == true) {
                            window.room.kickPlayer(target, LangRes.command.super.ban.banMsg, true); // kick
                            window.room.sendAnnouncement(LangRes.command.super.ban.banSuccess, byPlayer.id, 0x479947, "normal", 2);
                        } else {
                            window.room.sendAnnouncement(LangRes.command.super.ban.noID, byPlayer.id, 0xFF7777, "normal", 2);
                        }
                    } else {
                        window.room.sendAnnouncement(LangRes.command.super.ban.noID, byPlayer.id, 0xFF7777, "normal", 2);
                    }
                } else {
                    window.room.sendAnnouncement(LangRes.command.super._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 2);
                }

                break;
            }

            case "banclear": {
                if (window.playerList.get(byPlayer.id)!.permissions.superadmin == true) { // only when loginned
                    if (submessage !== undefined && submessage == "all") {
                        window.room.clearBans();
                        Ban.bListClear();
                        window.room.sendAnnouncement(LangRes.command.super.banclear.complete, byPlayer.id, 0x479947, "normal", 2);
                    } else {
                        window.room.sendAnnouncement(LangRes.command.super.banclear.noTarget, byPlayer.id, 0xFF7777, "normal", 2);
                    }
                } else {
                    window.room.sendAnnouncement(LangRes.command.super._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 2);
                }
                break;
            }

            default: {
                window.room.sendAnnouncement(LangRes.command.super._ErrorWrongCommand, byPlayer.id, 0xFF7777, "normal", 2);
                break;
            }
        }
    } else {
        window.room.sendAnnouncement(LangRes.command.super.defaultMessage, byPlayer.id, 0xFF7777, "normal", 2);
    }
}