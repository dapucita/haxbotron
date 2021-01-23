import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import * as BotSettings from "../../resources/settings.json";
import * as RatingSystemSettings from "../../resources/HElo/rating.json";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { Player } from "../../model/GameObject/Player";
import { convertToPlayerStorage, getBanlistDataFromDB, getPlayerDataFromDB, removeBanlistDataFromDB, setBanlistDataToDB, setPlayerDataToDB } from "../Storage";
import { getUnixTimestamp } from "../Statistics";
import { setDefaultStadiums, updateAdmins } from "../RoomTools";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { putTeamNewPlayerConditional, roomActivePlayersNumberCheck } from "../../model/OperateHelper/Quorum";
import { decideTier, getAvatarByTier, Tier } from "../../model/Statistics/Tier";

export async function onPlayerJoinListener(player: PlayerObject): Promise<void> {
    const joinTimeStamp: number = getUnixTimestamp();

    // logging into console
    window.logger.i(`${player.name}#${player.id} has joined. CONN(${player.conn}),AUTH(${player.auth})`);

    // Event called when a new player joins the room.
    var placeholderJoin = {
        playerID: player.id,
        playerName: player.name,
        playerNameOld: player.name,
        playerStatsRating: 1000,
        playerStatsDisconns: 0,
        playerStatsTotal: 0,
        playerStatsWins: 0,
        playerStatsGoals: 0,
        playerStatsAssists: 0,
        playerStatsOgs: 0,
        playerStatsLosepoints: 0,
        gameRuleName: window.settings.game.rule.ruleName,
        gameRuleDescription: window.settings.game.rule.ruleDescripttion,
        gameRuleLimitTime: window.settings.game.rule.requisite.timeLimit,
        gameRuleLimitScore: window.settings.game.rule.requisite.scoreLimit,
        gameRuleNeedMin: window.settings.game.rule.requisite.minimumPlayers,
        possTeamRed: window.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.winningStreak.teamID),
        streakTeamCount: window.winningStreak.count,
        banListReason: ''
    };

    // check ban list
    let playerBanChecking = await getBanlistDataFromDB(player.conn);
    if (playerBanChecking !== undefined) {// if banned (bListCheck would had returned string or boolean)
        placeholderJoin.banListReason = playerBanChecking.reason;

        if (playerBanChecking.expire == -1) { // Permanent ban
            window.logger.i(`${player.name}#${player.id} was joined but kicked for registered in permanent ban list. (conn:${player.conn},reason:${playerBanChecking.reason})`);
            window.room.kickPlayer(player.id, Tst.maketext(LangRes.onJoin.banList.permanentBan, placeholderJoin), true); // auto ban
            return;
        }
        if (playerBanChecking.expire > joinTimeStamp) { // Fixed-term ban (time limited ban)
            window.logger.i(`${player.name}#${player.id} was joined but kicked for registered in fixed-term ban list. (conn:${player.conn},reason:${playerBanChecking.reason})`);
            window.room.kickPlayer(player.id, Tst.maketext(LangRes.onJoin.banList.fixedTermBan, placeholderJoin), false); // auto kick
            return;
        }
        if (playerBanChecking.expire != -1 && playerBanChecking.expire <= joinTimeStamp) { // time-over from expiration date
            // ban clear for this player
            window.logger.i(`${player.name}#${player.id} is deleted from the ban list because the date has expired. (conn:${player.conn},reason:${playerBanChecking.reason})`);
            await removeBanlistDataFromDB(player.conn);
            // window.room.clearBan(player.id); //useless cuz banned player in haxball couldn't make join-event.
        }
    }
    
    // if this player has already joinned by other connection
    for (let eachPlayer of window.playerList.values()) {
        if(eachPlayer.conn === player.conn) {
            window.logger.i(`${player.name}#${player.id} was joined but kicked for double joinning. (origin:${eachPlayer.name}#${eachPlayer.id},conn:${player.conn})`);
            window.room.kickPlayer(player.id, Tst.maketext(LangRes.onJoin.doubleJoinningKick, placeholderJoin), false); // kick
            //window.room.sendAnnouncement(Tst.maketext(LangRes.onJoin.doubleJoinningMsg, placeholderJoin), null, 0xFF0000, "normal", 0); // notify
            return; // exit from this join event
        }
    }

    // add the player who joined into playerList by creating class instance
    let existPlayerData = await getPlayerDataFromDB(player.auth);
    if (existPlayerData !== undefined) {
        // if this player is existing player (not new player)
        window.playerList.set(player.id, new Player(player, {
            rating: existPlayerData.rating,
            totals: existPlayerData.totals,
            disconns: existPlayerData.disconns,
            wins: existPlayerData.wins,
            goals: existPlayerData.goals,
            assists: existPlayerData.assists,
            ogs: existPlayerData.ogs,
            losePoints: existPlayerData.losePoints,
            balltouch: existPlayerData.balltouch,
            passed: existPlayerData.passed
        }, {
            mute: existPlayerData.mute,
            muteExpire: existPlayerData.muteExpire,
            afkmode: false,
            afkreason: '',
            afkdate: 0,
            malActCount: existPlayerData.malActCount,
            superadmin: false
        }, {
            rejoinCount: existPlayerData.rejoinCount,
            joinDate: joinTimeStamp,
            leftDate: existPlayerData.leftDate,
            matchEntryTime: 0
        }));

        // update player information in placeholder
        placeholderJoin.playerStatsAssists = existPlayerData.assists;
        placeholderJoin.playerStatsGoals = existPlayerData.goals;
        placeholderJoin.playerStatsLosepoints = existPlayerData.losePoints;
        placeholderJoin.playerStatsOgs = existPlayerData.ogs;
        placeholderJoin.playerStatsTotal = existPlayerData.totals;
        placeholderJoin.playerStatsWins = existPlayerData.wins;
        placeholderJoin.playerStatsRating = existPlayerData.rating;
        placeholderJoin.playerStatsDisconns = existPlayerData.disconns;

        if (player.name != existPlayerData.name) {
            // if this player changed his/her name
            // notify that fact to other players only once ( it will never be notified if he/she rejoined next time)
            placeholderJoin.playerNameOld = existPlayerData.name
            window.room.sendAnnouncement(Tst.maketext(LangRes.onJoin.changename, placeholderJoin), null, 0x00FF00, "normal", 0);
        }

        // check anti-rejoin flood when this option is enabled
        if (BotSettings.antiJoinFlood === true) { //FIXME: Connection Closed Message is shown when anti-rejoin flooding kick (FIND the reason why)
            if (joinTimeStamp - existPlayerData.leftDate <= BotSettings.joinFloodIntervalMillisecs) { // when rejoin flood
                if (existPlayerData.rejoinCount > BotSettings.joinFloodAllowLimitation) {
                    // kick this player
                    window.logger.i(`${player.name}#${player.id} was joined but kicked for anti-rejoin flood. (origin:${player.name}#${player.id},conn:${player.conn})`);
                    window.room.kickPlayer(player.id, LangRes.antitrolling.joinFlood.banReason, false); // kick
                    //and add into ban list (not permanent ban, but fixed-term ban)
                    await setBanlistDataToDB({ conn: player.conn, reason: LangRes.antitrolling.joinFlood.banReason, register: joinTimeStamp, expire: joinTimeStamp + BotSettings.joinFloodBanMillisecs })
                    return; // exit from this join event
                } else { //just warn
                    window.room.sendAnnouncement(LangRes.antitrolling.joinFlood.floodWarning, player.id, 0xFF0000, "bold", 2);
                    window.playerList.get(player.id)!.entrytime.rejoinCount++; // and add count
                }
            } else {
                // init rejoin count
                window.playerList.get(player.id)!.entrytime.rejoinCount = 0;
            }
        }

    } else {
        // if new player
        // create a Player Object
        window.playerList.set(player.id, new Player(player, {
            rating: 1000,
            totals: 0,
            disconns: 0,
            wins: 0,
            goals: 0,
            assists: 0,
            ogs: 0,
            losePoints: 0,
            balltouch: 0,
            passed: 0
        }, {
            mute: false,
            muteExpire: 0,
            afkmode: false,
            afkreason: '',
            afkdate: 0,
            malActCount: 0,
            superadmin: false
        }, {
            rejoinCount: 0,
            joinDate: joinTimeStamp,
            leftDate: 0,
            matchEntryTime: 0
        }));
    }

    await setPlayerDataToDB(convertToPlayerStorage(window.playerList.get(player.id)!)); // register(or update) this player into DB

    if (window.settings.game.rule.autoAdmin === true) { // if auto admin option is enabled
        updateAdmins(); // check there are any admin players, if not make an admin player.
    }

    if (BotSettings.avatarOverridingByTier === true) {
        // if avatar overrding option is enabled
        window.room.setPlayerAvatar(player.id, getAvatarByTier( // set avatar
            (window.playerList.get(player.id)!.stats.totals < RatingSystemSettings.placement_match_chances)
                ? Tier.TierNew
                : decideTier(window.playerList.get(player.id)!.stats.rating)
        ));
    }

    // send welcome message to new player. other players cannot read this message.
    window.room.sendAnnouncement(Tst.maketext(LangRes.onJoin.welcome, placeholderJoin), player.id, 0x00FF00, "normal", 0);

    // check number of players joined and change game mode
    let activePlayersNumber: number = roomActivePlayersNumberCheck();
    if (window.settings.game.rule.statsRecord === true && activePlayersNumber >= window.settings.game.rule.requisite.minimumPlayers) {
        if (window.isStatRecord === false) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.onJoin.startRecord, placeholderJoin), null, 0x00FF00, "normal", 0);
            window.isStatRecord = true;
            if (window.settings.game.rule.autoOperating === true && window.isGamingNow === true) {
                // if auto emcee mode is enabled and the match has been playing as ready mode
                window.room.stopGame(); // stop game
            }
        }
    } else {
        if (window.isStatRecord === true) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.onJoin.stopRecord, placeholderJoin), null, 0x00FF00, "normal", 0);
            window.isStatRecord = false;
        }
    }

    // when auto emcee mode is enabled
    if (window.settings.game.rule.autoOperating === true) {
        putTeamNewPlayerConditional(player.id); // move team
        if (window.isGamingNow === false) {
            // if game is not started then start the game for active players
            setDefaultStadiums(); // set stadium
            window.room.startGame();
        }
    }
}
