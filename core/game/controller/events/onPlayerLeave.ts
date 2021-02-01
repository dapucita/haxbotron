import * as Tst from "../Translator";
import * as LangRes from "../../resource/strings";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { updateAdmins } from "../RoomTools";
import { getUnixTimestamp } from "../Statistics";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { putTeamNewPlayerFullify, roomActivePlayersNumberCheck } from "../../model/OperateHelper/Quorum";
import { convertToPlayerStorage, getBanlistDataFromDB, setBanlistDataToDB, setPlayerDataToDB } from "../Storage";

export async function onPlayerLeaveListener(player: PlayerObject): Promise<void> {
    // Event called when a player leaves the room.
    let leftTimeStamp: number = getUnixTimestamp();

    if (window.gameRoom.playerList.has(player.id) == false) { // if the player wasn't registered in playerList
        return; // exit this event
    }

    var placeholderLeft = { 
        playerID: player.id,
        playerName: player.name,
        playerStatsRating: window.gameRoom.playerList.get(player.id)!.stats.rating,
        playerStatsTotal: window.gameRoom.playerList.get(player.id)!.stats.totals,
        playerStatsDisconns: window.gameRoom.playerList.get(player.id)!.stats.disconns,
        playerStatsWins: window.gameRoom.playerList.get(player.id)!.stats.wins,
        playerStatsGoals: window.gameRoom.playerList.get(player.id)!.stats.goals,
        playerStatsAssists: window.gameRoom.playerList.get(player.id)!.stats.assists,
        playerStatsOgs: window.gameRoom.playerList.get(player.id)!.stats.ogs,
        playerStatsLosepoints: window.gameRoom.playerList.get(player.id)!.stats.losePoints,
        gameRuleName: window.gameRoom.config.rules.ruleName,
        gameRuleLimitTime: window.gameRoom.config.rules.requisite.timeLimit,
        gameRuleLimitScore: window.gameRoom.config.rules.requisite.scoreLimit,
        gameRuleNeedMin: window.gameRoom.config.rules.requisite.minimumPlayers,
        possTeamRed: window.gameRoom.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.gameRoom.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.gameRoom.winningStreak.teamID),
        streakTeamCount: window.gameRoom.winningStreak.count
    };

    window.gameRoom.logger.i('onPlayerLeave', `${player.name}#${player.id} has left.`);

    // check number of players joined and change game mode
    let activePlayersNumber: number = roomActivePlayersNumberCheck();
    if (window.gameRoom.config.rules.statsRecord === true && activePlayersNumber >= window.gameRoom.config.rules.requisite.minimumPlayers) {
        if (window.gameRoom.isStatRecord === false) {
            window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.onLeft.startRecord, placeholderLeft), null, 0x00FF00, "normal", 0);
            window.gameRoom.isStatRecord = true;
        }
        // when auto emcee mode is enabled
        if(window.gameRoom.config.rules.autoOperating === true && window.gameRoom.isGamingNow === true) {
            if(player.team !== TeamID.Spec) {
                putTeamNewPlayerFullify(); // put new players into the team this player has left
            }
        }
    } else {
        if (window.gameRoom.isStatRecord === true) {
            window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.onLeft.stopRecord, placeholderLeft), null, 0x00FF00, "normal", 0);
            window.gameRoom.isStatRecord = false;
            // when auto emcee mode is enabled and lack of players
            if(window.gameRoom.config.rules.autoOperating === true && window.gameRoom.isGamingNow === true) {
                window.gameRoom._room.stopGame(); // stop for start readymode game
                window.gameRoom.winningStreak = { // init
                    count: 0,
                    teamID: 0
                };
            } 
        }
    }

    if(window.gameRoom.isGamingNow === true && window.gameRoom.isStatRecord === true && window.gameRoom.playerList.get(player.id)!.team !== TeamID.Spec) {
        // if this player is disconnected (include abscond)
        window.gameRoom.playerList.get(player.id)!.stats.disconns++;
        placeholderLeft.playerStatsDisconns = window.gameRoom.playerList.get(player.id)!.stats.disconns;
        if(window.gameRoom.config.settings.antiGameAbscond === true) { // if anti abscond option is enabled
            window.gameRoom.playerList.get(player.id)!.stats.rating -= window.gameRoom.config.settings.gameAbscondRatingPenalty; // rating penalty
            if(await getBanlistDataFromDB(window.gameRoom.playerList.get(player.id)!.conn) === undefined ) { // if this player is in match(team player), fixed-term ban this player
                // check this player already registered in ban list to prevent overwriting other ban reason.
                window.gameRoom.logger.i('onPlayerLeave', `${player.name}#${player.id} has been added in fixed term ban list for abscond.`);
                await setBanlistDataToDB({ conn: window.gameRoom.playerList.get(player.id)!.conn, reason: LangRes.antitrolling.gameAbscond.banReason, register: leftTimeStamp, expire: leftTimeStamp + window.gameRoom.config.settings.gameAbscondBanMillisecs });
            }
        }
    }

    if (window.gameRoom.config.settings.banVoteEnable) { // check vote and reduce
        if(window.gameRoom.playerList.has(window.gameRoom.playerList.get(player.id)!.voteTarget)) {
            window.gameRoom.playerList.get(window.gameRoom.playerList.get(player.id)!.voteTarget)!.voteGet -= 1;
        }
    }

    window.gameRoom.playerList.get(player.id)!.entrytime.leftDate = leftTimeStamp; // save left time
    await setPlayerDataToDB(convertToPlayerStorage(window.gameRoom.playerList.get(player.id)!)); // save
    window.gameRoom.playerList.delete(player.id); // delete from player list

    if(window.gameRoom.config.rules.autoAdmin === true) { // if auto admin option is enabled
        updateAdmins(); // update admin
    }
}
