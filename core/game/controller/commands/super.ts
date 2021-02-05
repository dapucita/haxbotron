import * as LangRes from "../../resource/strings";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { superAdminLogin } from "../SuperAdmin";

export async function cmdSuper(byPlayer: PlayerObject, message?: string, submessage?: string): Promise<void> {
    if (message !== undefined) {
        switch (message) {
            case window.gameRoom.config.commands._superSublogin: {
                if (window.gameRoom.playerList.get(byPlayer.id)!.permissions.superadmin == false) { // only when not yet loginned
                    if (submessage !== undefined) { // key check and login
                        if (await superAdminLogin(submessage) === true) { // if login key is matched
                            window.gameRoom.playerList.get(byPlayer.id)!.permissions.superadmin = true; // set super admin
                            //setPlayerData(playerList.get(playerID)); // update
                            window.gameRoom._room.sendAnnouncement(LangRes.command.super.loginSuccess, byPlayer.id, 0x479947, "normal", 2);
                            window.gameRoom.logger.i('super', `${byPlayer.name}#${byPlayer.id} did successfully login to super admin with the key. (KEY ${submessage})`);
                        } else {
                            window.gameRoom.playerList.get(byPlayer.id)!.permissions.malActCount++; // add malicious behaviour count
                            window.gameRoom._room.sendAnnouncement(LangRes.command.super.loginFail, byPlayer.id, 0xFF7777, "normal", 2);
                            window.gameRoom.logger.i('super', `${byPlayer.name}#${byPlayer.id} has failed login to super admin and logged as malicious behaviour. (KEY ${submessage})`);
                        
                            if(window.gameRoom.playerList.get(byPlayer.id)!.permissions.malActCount >= window.gameRoom.config.settings.maliciousBehaviourBanCriterion) {
                                // This player will be permanently banned if it fails to exceed limit.
                                window.gameRoom._room.kickPlayer(byPlayer.id, LangRes.antitrolling.malAct.banReason, true); // ban
                            }
                        }
                    } else {
                        window.gameRoom._room.sendAnnouncement(LangRes.command.super.loginFailNoKey, byPlayer.id, 0xFF7777, "normal", 2);
                    }
                } else {
                    window.gameRoom._room.sendAnnouncement(LangRes.command.super._ErrorLoginAlready, byPlayer.id, 0xFF7777, "normal", 2);
                }

                break;
            }

            case window.gameRoom.config.commands._superSublogout: {
                if (window.gameRoom.playerList.get(byPlayer.id)!.permissions.superadmin == true) { // only when loginned
                    window.gameRoom.playerList.get(byPlayer.id)!.permissions.superadmin = false; // disqualify super admin
                    //setPlayerData(playerList.get(playerID)); // update
                    window.gameRoom._room.sendAnnouncement(LangRes.command.super.logoutSuccess, byPlayer.id, 0x479947, "normal", 2);
                    window.gameRoom.logger.i('super', `${byPlayer.name}#${byPlayer.id} did logout from super admin.`);
                } else {
                    window.gameRoom._room.sendAnnouncement(LangRes.command.super._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 2);
                }

                break;
            }

            case window.gameRoom.config.commands._superSubthor: {
                if (window.gameRoom.playerList.get(byPlayer.id)!.permissions.superadmin == true) {
                    window.gameRoom._room.setPlayerAdmin(byPlayer.id, true); // first, give admin
                    window.gameRoom.playerList.get(byPlayer.id)!.admin = true;
                    if (submessage !== undefined && submessage == window.gameRoom.config.commands._superSubthordeprive) { // get admin list except this super admin 
                        let players = window.gameRoom._room.getPlayerList().filter((player: PlayerObject) => player.id != 0 && player.id != byPlayer.id && player.admin == true);
                        if (players.length == 0) { // If no players left, do nothing.
                            window.gameRoom._room.sendAnnouncement(LangRes.command.super.thor.noAdmins, byPlayer.id, 0xFF7777, "normal", 2);
                            return;
                        } else {
                            window.gameRoom._room.sendAnnouncement(LangRes.command.super.thor.deprive, byPlayer.id, 0x479947, "normal", 2);
                            players.forEach((player: PlayerObject) => { // disqualify admin permission
                                window.gameRoom._room.setPlayerAdmin(player.id, false);
                                window.gameRoom.playerList.get(player.id)!.admin = false;
                            });
                        }
                    } else {
                        window.gameRoom._room.sendAnnouncement(LangRes.command.super.thor.complete, byPlayer.id, 0x479947, "normal", 2);
                    }
                } else {
                    window.gameRoom._room.sendAnnouncement(LangRes.command.super._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 2);
                }

                break;
            }

            case window.gameRoom.config.commands._superSubkick: {
                if (window.gameRoom.playerList.get(byPlayer.id)!.permissions.superadmin == true) { // only when loginned
                    if (submessage !== undefined && submessage.charAt(0) == "#") {
                        let target: number = parseInt(submessage.substr(1), 10);
                        if (isNaN(target) != true && window.gameRoom.playerList.has(target) == true) {
                            window.gameRoom._room.kickPlayer(target, LangRes.command.super.kick.kickMsg, false); // kick
                            window.gameRoom._room.sendAnnouncement(LangRes.command.super.kick.kickSuccess, byPlayer.id, 0x479947, "normal", 2);
                        } else {
                            window.gameRoom._room.sendAnnouncement(LangRes.command.super.kick.noID, byPlayer.id, 0xFF7777, "normal", 2);
                        }
                    } else {
                        window.gameRoom._room.sendAnnouncement(LangRes.command.super.kick.noID, byPlayer.id, 0xFF7777, "normal", 2);
                    }
                } else {
                    window.gameRoom._room.sendAnnouncement(LangRes.command.super._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 2);
                }

                break;
            }

            case window.gameRoom.config.commands._superSubban: {
                if (window.gameRoom.playerList.get(byPlayer.id)!.permissions.superadmin == true) { // only when loginned
                    if (submessage !== undefined && submessage.charAt(0) == "#") {
                        let target: number = parseInt(submessage.substr(1), 10);
                        if (isNaN(target) != true && window.gameRoom.playerList.has(target) == true) {
                            window.gameRoom._room.kickPlayer(target, LangRes.command.super.ban.banMsg, true); // kick
                            window.gameRoom._room.sendAnnouncement(LangRes.command.super.ban.banSuccess, byPlayer.id, 0x479947, "normal", 2);
                        } else {
                            window.gameRoom._room.sendAnnouncement(LangRes.command.super.ban.noID, byPlayer.id, 0xFF7777, "normal", 2);
                        }
                    } else {
                        window.gameRoom._room.sendAnnouncement(LangRes.command.super.ban.noID, byPlayer.id, 0xFF7777, "normal", 2);
                    }
                } else {
                    window.gameRoom._room.sendAnnouncement(LangRes.command.super._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 2);
                }

                break;
            }
            /*
            case window.gameRoom.config.commands._superSubbanclear: {
                if (window.playerList.get(byPlayer.id)!.permissions.superadmin == true) { // only when loginned
                    if (submessage !== undefined && submessage == window.gameRoom.config.commands._superSubbanclearall) {
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

            case window.gameRoom.config.commands._superSubbanlist: {
                if (window.playerList.get(byPlayer.id)!.permissions.superadmin == true) { // only when loginned
                    let placeholder = {
                        whoisResult: LangRes.command.super.banlist._ErrorNoOne
                    }
                    let bannedPlayerList: BanList[] = Ban.bListGetArray();
                    if (bannedPlayerList.length >= 1) {
                        placeholder.whoisResult = '🚫 '; //init
                        bannedPlayerList.forEach((bannedPlayer: BanList) => {
                            placeholder.whoisResult += bannedPlayer.conn + '(' + bannedPlayer.reason + '), ';
                        });
                    }
                    window.room.sendAnnouncement(Tst.maketext(LangRes.command.super.banlist.whoisList, placeholder), byPlayer.id, 0x479947, "normal", 2);
                } else {
                    window.room.sendAnnouncement(LangRes.command.super._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 2);
                }
                break;
            }
            */

            default: {
                window.gameRoom._room.sendAnnouncement(LangRes.command.super._ErrorWrongCommand, byPlayer.id, 0xFF7777, "normal", 2);
                break;
            }
        }
    } else {
        window.gameRoom._room.sendAnnouncement(LangRes.command.super.defaultMessage, byPlayer.id, 0xFF7777, "normal", 2);
    }
}
