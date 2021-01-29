
import * as Tst from "../Translator";
import * as LangRes from "../../resource/strings";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { isCommandString, parseCommand } from "../Parser";
import { getUnixTimestamp } from "../Statistics";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";

export function onPlayerChatListener(player: PlayerObject, message: string): boolean {
    // Event called when a player sends a chat message.
    // The event function can return false in order to filter the chat message.
    // Then It prevents the chat message from reaching other players in the room.

    //TODO: CHAT FILTERING : https://github.com/web-mech/badwords

    window.gameRoom.logger.i(`${player.name}#${player.id} said, "${message}"`);

    var placeholderChat = {
        playerID: player.id,
        playerName: player.name,
        gameRuleName: window.gameRoom.config.rules.ruleName,
        gameRuleLimitTime: window.gameRoom.config.rules.requisite.timeLimit,
        gameRuleLimitScore: window.gameRoom.config.rules.requisite.scoreLimit,
        gameRuleNeedMin: window.gameRoom.config.rules.requisite.minimumPlayers,
        possTeamRed: window.gameRoom.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.gameRoom.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.gameRoom.winningStreak.teamID),
        streakTeamCount: window.gameRoom.winningStreak.count
    };

    // =========

    if (isCommandString(message) === true) { // if this message is command chat
        parseCommand(player, message); // evaluate it
        return false; // and show this message for only him/herself
    } else { // if this message is normal chat
        if (player.admin === true) { // if this player is admin
            return true; // admin can chat regardless of mute
        } else {
            if (window.gameRoom.isMuteAll === true || window.gameRoom.playerList.get(player.id)!.permissions['mute'] === true) { // if this player is muted or whole chat is frozen
                window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.onChat.mutedChat, placeholderChat), player.id, 0xFF0000, "bold", 2); // notify that fact
                return false; // and hide this chat
            } else {
                //Anti Chat Flood Checking
                if (window.gameRoom.config.settings.antiChatFlood === true && window.gameRoom.isStatRecord === true) { // if anti chat flood options is enabled
                    let chatFloodCritFlag: boolean = false;
                    window.gameRoom.antiTrollingChatFloodCount.push(player.id); // record who said this chat
                    for (let floodCritCount = 1; floodCritCount <= window.gameRoom.config.settings.chatFloodCriterion; floodCritCount++) {
                        let floodID: number = window.gameRoom.antiTrollingChatFloodCount[window.gameRoom.antiTrollingChatFloodCount.length - floodCritCount] || 0;
                        if (floodID === player.id) {
                            chatFloodCritFlag = true;
                        } else {
                            chatFloodCritFlag = false;
                            break; // abort loop
                        }
                    }
                    if (chatFloodCritFlag === true && window.gameRoom.playerList.get(player.id)!.permissions['mute'] === false) { // after complete loop, check flag
                        const nowTimeStamp: number = getUnixTimestamp(); //get timestamp
                        // judge as chat flood.
                        window.gameRoom.playerList.get(player.id)!.permissions['mute'] = true; // mute this player
                        window.gameRoom.playerList.get(player.id)!.permissions.muteExpire = nowTimeStamp + window.gameRoom.config.settings.muteDefaultMillisecs; //record mute expiration date by unix timestamp
                        window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.antitrolling.chatFlood.muteReason, placeholderChat), null, 0xFF0000, "normal", 1); // notify that fact
                        return false;
                    }
                }
                return true;
            }
        }
    }
}
