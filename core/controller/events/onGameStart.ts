import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import * as BotSettings from "../../resources/settings.json";
import * as Ban from "../Ban";
import { getTeamWinningExpectation, getUnixTimestamp } from "../Statistics";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { roomTeamPlayersNumberCheck } from "../../model/OperateHelper/Quorum";
import { MatchKFactor } from "../../model/Statistics/HElo";
import { decideTier, getAvatarByTier, Tier } from "../../model/Statistics/Tier";

export function onGameStartListener(byPlayer: PlayerObject | null): void {
    /* Event called when a game starts.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
    let placeholderStart = {
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

    let allPlayersList: PlayerObject[] = window.room.getPlayerList(); // all list

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

    if(BotSettings.avatarOverridingByTier === true) {
        // if avatar overrding option is enabled
        allPlayersList.forEach((eachPlayer: PlayerObject) => {
            window.room.setPlayerAvatar(eachPlayer.id, getAvatarByTier( // set avatar
                (window.playerList.get(eachPlayer.id)!.stats.totals < 10)
                ? Tier.TierNew
                : decideTier(window.playerList.get(eachPlayer.id)!.stats.rating)
            )); 
        });
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

        allPlayersList
                .filter((eachPlayer: PlayerObject) => eachPlayer.team !== TeamID.Spec)
                .forEach((eachPlayer: PlayerObject) => { 
                    window.playerList.get(eachPlayer.id)!.entrytime.matchEntryTime = 0; // init each player's entry match time
                    if(window.playerList.get(eachPlayer.id)!.stats.totals < 10) {
                        window.playerList.get(eachPlayer.id)!.matchRecord.factorK = MatchKFactor.Placement; // set K Factor as a Placement match
                    } // or default value is Normal match
                });

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
