import { PlayerObject } from "../../model/PlayerObject";
import { gameRule } from "../../model/rules/rule";
import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import { isCommandString, parseCommand } from "../Parser";

export function onPlayerChatListener(player: PlayerObject, message: string): boolean {
    // Event called when a player sends a chat message.
    // The event function can return false in order to filter the chat message.
    // Then It prevents the chat message from reaching other players in the room.

    var placeholderChat = { // Parser.maketext(str, placeholder)
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

    window.logger.i(`${player.name}#${player.id} said, "${message}"`);
    if (isCommandString(message) == true) { // if the message is command chat
        parseCommand(player, message); // evaluate it
        return false; // say only to him/herself
    } else { // if the message is normal chat
        if(player.admin == true) { // if the player is admin
            return true; // admin can chat regardless of mute
        }
        if (window.isMuteAll == true || window.playerList.get(player.id).permissions['mute'] == true) { // if the player is muted
            window.room.sendAnnouncement(Tst.maketext(LangRes.onChat.mutedChat, placeholderChat), player.id, 0xFF0000, "bold", 1); // notify that fact
            return false; // and filter the chat message to other players.
        }
        return true;
    }
}