import { PlayerObject, PlayerStorage } from "../../model/PlayerObject";
import { gameRule } from "../../model/rules/rule";
import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import { roomPlayersNumberCheck, updateAdmins } from "../RoomTools";
import * as Ban from "../Ban";
import { Player } from "../../model/Player";
import { getPlayerData, setPlayerData } from "../Storage";
import { getUnixTimestamp } from "../Statistics";

export function onPlayerJoinListener(player: PlayerObject): void {
    // Event called when a new player joins the room.
    var placeholderJoin = { // Parser.maketext(str, placeholder)
        playerID: player.id,
        playerName: player.name,
        playerNameOld: player.name,
        playerStatsTotal: 0,
        playerStatsWins: 0,
        playerStatsGoals: 0,
        playerStatsAssists: 0,
        playerStatsOgs: 0,
        playerStatsLosepoints: 0,
        gameRuleName: gameRule.ruleName,
        gameRuleDescription: gameRule.ruleDescripttion,
        gameRuleLimitTime: gameRule.requisite.timeLimit,
        gameRuleLimitScore: gameRule.requisite.scoreLimit,
        gameRuleNeedMin: gameRule.requisite.minimumPlayers,
        possTeamRed: window.ballStack.possCalculate(1),
        possTeamBlue: window.ballStack.possCalculate(2),
        streakTeamName: window.winningStreak.getName(),
        streakTeamCount: window.winningStreak.getCount(),
        banListReason: ''
    };

    // check ban list
    let playerBanChecking: string | boolean = Ban.bListCheck(player.conn);
    if (typeof playerBanChecking !== "boolean") { // if banned (bListCheck would had returned string or boolean)
        let playerBanExpireTime: number = Ban.bListCheckExpireTime(player.conn);
        placeholderJoin.banListReason = playerBanChecking;

        if(playerBanExpireTime == -1) { // Permanent ban
            window.logger.i(`${player.name}#${player.id} was joined but kicked for registered in permanent ban list. (conn:${player.conn},reason:${playerBanChecking})`);
            window.room.kickPlayer(player.id, Tst.maketext(LangRes.onJoin.banList.permanentBan, placeholderJoin), false); // auto kick
            return;
        }
        if(playerBanExpireTime > getUnixTimestamp()) { // Fixed-term ban (time limited ban)
            window.logger.i(`${player.name}#${player.id} was joined but kicked for registered in fixed-term ban list. (conn:${player.conn},reason:${playerBanChecking})`);
            window.room.kickPlayer(player.id, Tst.maketext(LangRes.onJoin.banList.fixedTermBan, placeholderJoin), false); // auto kick
            return;
        }
        if(playerBanExpireTime != -1 && playerBanExpireTime <= getUnixTimestamp()) { // time-over from expiration date
            // ban clear for this player
            window.logger.i(`${player.name}#${player.id} has deleted from the ban list because it has expired. (conn:${player.conn},reason:${playerBanChecking})`);
            Ban.bListDelete(player.conn);
        }
    }

    // if this player has already joinned by other connection
    window.playerList.forEach((eachPlayer: Player) => {
        if (eachPlayer.conn == player.conn) {
            window.logger.i(`${player.name}#${player.id} was joined but kicked for double joinning. (origin:${eachPlayer.name}#${eachPlayer.id},conn:${player.conn})`);
            window.room.kickPlayer(player.id, Tst.maketext(LangRes.onJoin.doubleJoinningKick, placeholderJoin), false); // kick
            window.room.sendAnnouncement(Tst.maketext(LangRes.onJoin.doubleJoinningMsg, placeholderJoin), null, 0xFF0000, "normal", 0); // notify
            return; // exit from this join event
        }
    });

    // logging into console (debug)
    window.logger.i(`${player.name}#${player.id} has joined. CONN(${player.conn}),AUTH(${player.auth})`);

    // add the player who joined into playerList by creating class instance
    if (localStorage.getItem(player.auth) !== null) {
        // if this player is not new player (existing player)
        var loadedData: PlayerStorage | null = getPlayerData(player.auth);
        if (loadedData !== null) {
            if (isNaN(loadedData.balltouch) == true) { // init for old players who don't have balltouch, pass value.
                loadedData.balltouch = 0;
                loadedData.passed = 0;
            }
            window.playerList.set(player.id, new Player(player, {
                totals: loadedData.totals,
                wins: loadedData.wins,
                goals: loadedData.goals,
                assists: loadedData.assists,
                ogs: loadedData.ogs,
                losePoints: loadedData.losePoints,
                balltouch: loadedData.balltouch,
                passed: loadedData.passed
            }, {
                mute: loadedData.mute,
                afkmode: false,
                afkreason: '',
                superadmin: false
            }, {
                joinDate: getUnixTimestamp(),
                leftDate: loadedData.leftDate
            }));

            // update player information in placeholder
            placeholderJoin.playerStatsAssists = loadedData.assists;
            placeholderJoin.playerStatsGoals = loadedData.goals;
            placeholderJoin.playerStatsLosepoints = loadedData.losePoints;
            placeholderJoin.playerStatsOgs = loadedData.ogs;
            placeholderJoin.playerStatsTotal = loadedData.totals;
            placeholderJoin.playerStatsWins = loadedData.wins;

            if (player.name != loadedData.name) {
                // if this player changed his/her name
                // notify that fact to other players only once ( it will never be notified if he/she rejoined next time)
                placeholderJoin.playerNameOld = loadedData.name
                window.room.sendAnnouncement(Tst.maketext(LangRes.onJoin.changename, placeholderJoin), null, 0x00FF00, "normal", 0);
            }
        }
    } else {
        // if new player
        // create a Player Object
        window.playerList.set(player.id, new Player(player, {
            totals: 0,
            wins: 0,
            goals: 0,
            assists: 0,
            ogs: 0,
            losePoints: 0,
            balltouch: 0,
            passed: 0
        }, {
            mute: false,
            afkmode: false,
            afkreason: '',
            superadmin: false
        }, {
            joinDate: getUnixTimestamp(),
            leftDate: 0
        }));
    }

    setPlayerData(window.playerList.get(player.id)); // register(or update) in localStorage

    updateAdmins(); // check there are any admin players, if not make an admin player.

    // send welcome message to new player. other players cannot read this message.
    window.room.sendAnnouncement(Tst.maketext(LangRes.onJoin.welcome, placeholderJoin), player.id, 0x00FF00, "normal", 0);

    // check number of players joined and change game mode
    if (gameRule.statsRecord == true && roomPlayersNumberCheck() >= gameRule.requisite.minimumPlayers) {
        if (window.isStatRecord != true) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.onJoin.startRecord, placeholderJoin), null, 0x00FF00, "normal", 0);
            window.isStatRecord = true;
        }
    } else {
        if (window.isStatRecord != false) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.onJoin.stopRecord, placeholderJoin), null, 0x00FF00, "normal", 0);
            window.isStatRecord = false;
        }
    }

    //setDefaultStadiums(); // check number of players and auto-set stadium
}