import { PlayerObject } from "../../model/PlayerObject";
import { gameRule } from "../../model/rules/rule";
import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import * as BotSettings from "../../resources/settings.json";
import { isCommandString, parseCommand } from "../Parser";

export function onPlayerChatListener(player: PlayerObject, message: string): boolean {
    // Event called when a player sends a chat message.
    // The event function can return false in order to filter the chat message.
    // Then It prevents the chat message from reaching other players in the room.

    //TODO: CHAT FILTERING : https://github.com/web-mech/badwords

    window.logger.i(`${player.name}#${player.id} said, "${message}"`);

    var placeholderChat = { 
        playerID: player.id,
        playerName: player.name,
        gameRuleName: gameRule.ruleName,
        gameRuleDescription: gameRule.ruleDescripttion,
        gameRuleLimitTime: gameRule.requisite.timeLimit,
        gameRuleLimitScore: gameRule.requisite.scoreLimit,
        gameRuleNeedMin: gameRule.requisite.minimumPlayers,
        possTeamRed: window.ballStack.possCalculate(1),
        possTeamBlue: window.ballStack.possCalculate(2),
        streakTeamName: window.winningStreak.getName(),
        streakTeamCount: window.winningStreak.getCount()
    };

    if(BotSettings.antiChatFlood === true && player.admin === false && window.playerList.get(player.id).permissions['mute'] === false) { // if anti chat flood options is enabled (admin player can say anytime)
        console.log("[DEBUG] antiChatFlood 프로시져");
        let chatFloodCritFlag: boolean = false;
        window.antiTrollingChatFloodCount.push(player.id); // record who said this chat
        for(let floodCritCount = 1; floodCritCount <= BotSettings.chatFloodCriterion; floodCritCount++) {
            let floodID: number = window.antiTrollingChatFloodCount[window.antiTrollingChatFloodCount.length - floodCritCount] || 0;
            console.log("[DEBUG] antiChatFlood floodID : "+floodID);
            if(floodID === player.id) {
                console.log("[DEBUG] antiChatFlood 플래그 will be true.");
                chatFloodCritFlag = true;
            } else {
                console.log("[DEBUG] antiChatFlood 플래그 will be false.");
                chatFloodCritFlag = false;
                break; // abort loop
            }
        }
        if(chatFloodCritFlag === true) { // after complete loop, check flag
            console.log("[DEBUG] antiChatFlood 뮤트 will be.");
            // judge as chat flood.
            window.playerList.get(player.id).permissions['mute'] = true; // mute this player
            window.room.sendAnnouncement(Tst.maketext(LangRes.antitrolling.chatFlood.muteReason, placeholderChat), null, 0xFF0000, "bold", 1); // notify that fact
            //return false; // ignore the chat message of this turn //DO NOT return false cuz command chat will be working
        }
    }

    if (isCommandString(message) == true) { // if the message is command chat
        parseCommand(player, message); // evaluate it
        return false; // say only to him/herself
    } else { // if the message is normal chat
        if(player.admin == true) { // if the player is admin
            return true; // admin can chat regardless of mute
        }
        if (window.isMuteAll == true || window.playerList.get(player.id).permissions['mute'] == true) { // if the player is muted
            window.room.sendAnnouncement(Tst.maketext(LangRes.onChat.mutedChat, placeholderChat), player.id, 0xFF0000, "bold", 2); // notify that fact
            return false; // and filter the chat message to other players.
        }
        return true;
    }
}