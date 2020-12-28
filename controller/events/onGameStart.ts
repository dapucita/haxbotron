import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import * as BotSettings from "../../resources/settings.json";
import * as Ban from "../Ban";
import { getTeamWinningExpectation, getUnixTimestamp } from "../Statistics";
import { roomTeamPlayersNumberCheck } from "../RoomTools";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { PlayerObject } from "../../model/GameObject/PlayerObject";

export function onGameStartListener(byPlayer: PlayerObject | null): void {
    /* Event called when a game starts.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
    var placeholderStart = {
        playerID: 0,
        playerName: '',
        gameRuleName: window.settings.game.rule.ruleName,
        gameRuleDescription: window.settings.game.rule.ruleDescripttion,
        gameRuleLimitTime: window.settings.game.rule.requisite.timeLimit,
        gameRuleLimitScore: window.settings.game.rule.requisite.scoreLimit,
        gameRuleNeedMin: window.settings.game.rule.requisite.minimumPlayers,
        possTeamRed: window.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.winningStreak.teamID),
        streakTeamCount: window.winningStreak.count,
        teamExpectationRed: 0,
        teamExpectationBlue: 0
    };

    window.isGamingNow = true; // turn on

    if (BotSettings.antiChatFlood === true) { // if anti-chat flood option is enabled
        window.antiTrollingOgFloodCount = []; // clear and init again
    }
    if (BotSettings.antiOgFlood === true) { // if anti-OG flood option is enabled
        window.antiTrollingOgFloodCount = []; // clear and init again
    }

    let msg = `The game(stat record:${window.isStatRecord}) has been started.`;
    if (byPlayer !== null && byPlayer.id !== 0) {
        placeholderStart.playerID = byPlayer.id;
        placeholderStart.playerName = byPlayer.name;
        msg += `(by ${byPlayer.name}#${byPlayer.id})`;
    }
    if (window.settings.game.rule.statsRecord === true && window.isStatRecord === true) { // if the game mode is stats, records the result of this game.
        //requisite check for anti admin's abusing (eg. prevent game playing)
        if (BotSettings.antiInsufficientStartAbusing === true && byPlayer !== null) {
            if (roomTeamPlayersNumberCheck(TeamID.Red) < window.settings.game.rule.requisite.eachTeamPlayers || roomTeamPlayersNumberCheck(TeamID.Blue) < window.settings.game.rule.requisite.eachTeamPlayers) {
                let abusingID: number = byPlayer.id || 0;
                let abusingTimestamp: number = getUnixTimestamp();
                window.logger.i(`The game will be stopped because of insufficient players in each team.`);
                window.antiInsufficientStartAbusingCount.push(abusingID);
                window.room.stopGame();
                window.room.sendAnnouncement(LangRes.antitrolling.insufficientStartAbusing.abusingWarning, null, 0xFF0000, "bold", 2);

                if (abusingID !== 0 && window.antiInsufficientStartAbusingCount.filter(eachID => eachID === abusingID).length > BotSettings.insufficientStartAllowLimitation) {
                    //if limitation has over then fixed-term ban that admin player
                    Ban.bListAdd({ conn: window.playerList.get(abusingID)!.conn, reason: LangRes.antitrolling.insufficientStartAbusing.banReason, register: abusingTimestamp, expire: abusingTimestamp + BotSettings.insufficientStartAbusingBanMillisecs });
                    window.room.kickPlayer(abusingID, LangRes.antitrolling.insufficientStartAbusing.banReason, false);     
                }
                
                return; // abort this event.
            } else {
                window.antiInsufficientStartAbusingCount = []; // clear and init
            }
        }

        // start game
        let expectations: number[] = getTeamWinningExpectation();

        placeholderStart.teamExpectationRed = expectations[1];
        placeholderStart.teamExpectationBlue = expectations[2];

        window.room.sendAnnouncement(Tst.maketext(LangRes.onStart.startRecord, placeholderStart), null, 0x00FF00, "normal", 0);
        window.room.sendAnnouncement(Tst.maketext(LangRes.onStart.expectedWinRate, placeholderStart), null, 0x00FF00, "normal", 0);

        if(window.settings.game.rule.autoOperating === true) { // if game rule is set as auto operating mode
            window.room.pauseGame(true); // pause (and will call onGamePause event)
        }
    } else {
        window.room.sendAnnouncement(Tst.maketext(LangRes.onStart.stopRecord, placeholderStart), null, 0x00FF00, "normal", 0);
    }
    window.logger.i(msg);
}
