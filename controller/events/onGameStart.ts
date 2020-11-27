import { PlayerObject } from "../../model/PlayerObject";
import { gameRule } from "../../model/rules/rule";
import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import * as BotSettings from "../../resources/settings.json";
import { getTeamWinningExpectation } from "../Statistics";

export function onGameStartListener(byPlayer: PlayerObject): void {
    /* Event called when a game starts.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
        var placeholderStart = { // Parser.maketext(str, placeholder)
            playerID: 0,
            playerName: '',
            gameRuleName: gameRule.ruleName,
            gameRuleDescription: gameRule.ruleDescripttion,
            gameRuleLimitTime: gameRule.requisite.timeLimit,
            gameRuleLimitScore: gameRule.requisite.scoreLimit,
            gameRuleNeedMin: gameRule.requisite.minimumPlayers,
            possTeamRed: window.ballStack.possCalculate(1),
            possTeamBlue: window.ballStack.possCalculate(2),
            streakTeamName: window.winningStreak.getName(),
            streakTeamCount: window.winningStreak.getCount(),
            teamExpectationRed: 0,
            teamExpectationBlue: 0
        };

        window.isGamingNow = true; // turn on

        if(BotSettings.antiChatFlood === true) { // if anti-chat flood option is enabled
            window.antiTrollingOgFloodCount = []; // clear and init again
        }
        if(BotSettings.antiOgFlood === true) { // if anti-OG flood option is enabled
            window.antiTrollingOgFloodCount = []; // clear and init again
        }
        
        let msg = `[GAME] The game(stat record:${window.isStatRecord}) has been started.`;
        if (byPlayer !== null && byPlayer.id != 0) {
            placeholderStart.playerID = byPlayer.id;
            placeholderStart.playerName = byPlayer.name;
            msg += `(by ${byPlayer.name}#${byPlayer.id})`;
        }
        if (gameRule.statsRecord == true && window.isStatRecord == true) {
            // if the game mode is stats, records the result of this game.
            let expectations: number[] = getTeamWinningExpectation();

            placeholderStart.teamExpectationRed = expectations[1];
            placeholderStart.teamExpectationBlue = expectations[2];

            window.room.sendAnnouncement(Tst.maketext(LangRes.onStart.startRecord, placeholderStart), null, 0x00FF00, "normal", 0);
            window.room.sendAnnouncement(Tst.maketext(LangRes.onStart.expectedWinRate, placeholderStart), null, 0x00FF00, "normal", 0);
        } else {
            window.room.sendAnnouncement(Tst.maketext(LangRes.onStart.stopRecord, placeholderStart), null, 0x00FF00, "normal", 0);
        }
        window.logger.i(msg);
}