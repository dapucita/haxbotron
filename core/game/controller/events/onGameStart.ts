import * as Tst from "../Translator";
import * as LangRes from "../../resource/strings";
import * as BotSettings from "../../resource/settings.json";
import * as RatingSystemSettings from "../../resource/HElo/rating.json";
import { getTeamWinningExpectation, getUnixTimestamp } from "../Statistics";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { roomTeamPlayersNumberCheck } from "../../model/OperateHelper/Quorum";
import { MatchKFactor } from "../../model/Statistics/HElo";
import { decideTier, getAvatarByTier, Tier } from "../../model/Statistics/Tier";
import { setBanlistDataToDB } from "../Storage";

export function onGameStartListener(byPlayer: PlayerObject | null): void {
    /* Event called when a game starts.
        byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
    let placeholderStart = {
        playerID: 0,
        playerName: '',
        gameRuleName: window.gameRoom.config.rules.ruleName,
        gameRuleLimitTime: window.gameRoom.config.rules.requisite.timeLimit,
        gameRuleLimitScore: window.gameRoom.config.rules.requisite.scoreLimit,
        gameRuleNeedMin: window.gameRoom.config.rules.requisite.minimumPlayers,
        possTeamRed: window.gameRoom.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.gameRoom.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.gameRoom.winningStreak.teamID),
        streakTeamCount: window.gameRoom.winningStreak.count,
        teamExpectationRed: 0,
        teamExpectationBlue: 0
    };

    let allPlayersList: PlayerObject[] = window.gameRoom._room.getPlayerList(); // all list

    window.gameRoom.isGamingNow = true; // turn on

    if (BotSettings.antiChatFlood === true) { // if anti-chat flood option is enabled
        window.gameRoom.antiTrollingOgFloodCount = []; // clear and init again
    }
    if (BotSettings.antiOgFlood === true) { // if anti-OG flood option is enabled
        window.gameRoom.antiTrollingOgFloodCount = []; // clear and init again
    }

    let msg = `The game(stat record:${window.gameRoom.isStatRecord}) has been started.`;
    if (byPlayer !== null && byPlayer.id !== 0) {
        placeholderStart.playerID = byPlayer.id;
        placeholderStart.playerName = byPlayer.name;
        msg += `(by ${byPlayer.name}#${byPlayer.id})`;
    }

    if(BotSettings.avatarOverridingByTier === true) {
        // if avatar overrding option is enabled
        allPlayersList.forEach((eachPlayer: PlayerObject) => {
            window.gameRoom._room.setPlayerAvatar(eachPlayer.id, getAvatarByTier( // set avatar
                (window.gameRoom.playerList.get(eachPlayer.id)!.stats.totals < RatingSystemSettings.placement_match_chances)
                ? Tier.TierNew
                : decideTier(window.gameRoom.playerList.get(eachPlayer.id)!.stats.rating)
            )); 
        });
    }

    if (window.gameRoom.config.rules.statsRecord === true && window.gameRoom.isStatRecord === true) { // if the game mode is stats, records the result of this game.
        //requisite check for anti admin's abusing (eg. prevent game playing)
        if (BotSettings.antiInsufficientStartAbusing === true && byPlayer !== null) {
            if (roomTeamPlayersNumberCheck(TeamID.Red) < window.gameRoom.config.rules.requisite.eachTeamPlayers || roomTeamPlayersNumberCheck(TeamID.Blue) < window.gameRoom.config.rules.requisite.eachTeamPlayers) {
                let abusingID: number = byPlayer.id || 0;
                let abusingTimestamp: number = getUnixTimestamp();
                window.gameRoom.logger.i(`The game will be stopped because of insufficient players in each team.`);
                window.gameRoom.antiInsufficientStartAbusingCount.push(abusingID);
                window.gameRoom._room.stopGame();
                window.gameRoom._room.sendAnnouncement(LangRes.antitrolling.insufficientStartAbusing.abusingWarning, null, 0xFF0000, "bold", 2);

                if (abusingID !== 0 && window.gameRoom.antiInsufficientStartAbusingCount.filter(eachID => eachID === abusingID).length > BotSettings.insufficientStartAllowLimitation) {
                    //if limitation has over then fixed-term ban that admin player
                    setBanlistDataToDB({ conn: window.gameRoom.playerList.get(abusingID)!.conn, reason: LangRes.antitrolling.insufficientStartAbusing.banReason, register: abusingTimestamp, expire: abusingTimestamp + BotSettings.insufficientStartAbusingBanMillisecs });
                    window.gameRoom._room.kickPlayer(abusingID, LangRes.antitrolling.insufficientStartAbusing.banReason, false);     
                }
                
                return; // abort this event.
            } else {
                window.gameRoom.antiInsufficientStartAbusingCount = []; // clear and init
            }
        }

        allPlayersList
                .filter((eachPlayer: PlayerObject) => eachPlayer.team !== TeamID.Spec)
                .forEach((eachPlayer: PlayerObject) => { 
                    window.gameRoom.playerList.get(eachPlayer.id)!.entrytime.matchEntryTime = 0; // init each player's entry match time
                    if(window.gameRoom.playerList.get(eachPlayer.id)!.stats.totals < 10) {
                        window.gameRoom.playerList.get(eachPlayer.id)!.matchRecord.factorK = MatchKFactor.Placement; // set K Factor as a Placement match
                    } // or default value is Normal match
                });

        // start game
        let expectations: number[] = getTeamWinningExpectation();

        placeholderStart.teamExpectationRed = expectations[1];
        placeholderStart.teamExpectationBlue = expectations[2];

        window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.onStart.startRecord, placeholderStart), null, 0x00FF00, "normal", 0);
        window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.onStart.expectedWinRate, placeholderStart), null, 0x00FF00, "normal", 0);

        if(window.gameRoom.config.rules.autoOperating === true) { // if game rule is set as auto operating mode
            window.gameRoom._room.pauseGame(true); // pause (and will call onGamePause event)
        }
    } else {
        window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.onStart.stopRecord, placeholderStart), null, 0x00FF00, "normal", 0);
    }
    window.gameRoom.logger.i(msg);
}
