import * as Tst from "../Translator";
import * as LangRes from "../../resource/strings";
import * as BotSettings from "../../resource/settings.json";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { updateAdmins } from "../RoomTools";
import { getUnixTimestamp } from "../Statistics";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { putTeamNewPlayerFullify, roomActivePlayersNumberCheck } from "../../model/OperateHelper/Quorum";
import { convertToPlayerStorage, getBanlistDataFromDB, setBanlistDataToDB, setPlayerDataToDB } from "../Storage";

export async function onPlayerLeaveListener(player: PlayerObject): Promise<void> {
    // Event called when a player leaves the room.
    let leftTimeStamp: number = getUnixTimestamp();

    if (window.playerList.has(player.id) == false) { // if the player wasn't registered in playerList
        return; // exit this event
    }

    var placeholderLeft = { 
        playerID: player.id,
        playerName: player.name,
        playerStatsRating: window.playerList.get(player.id)!.stats.rating,
        playerStatsTotal: window.playerList.get(player.id)!.stats.totals,
        playerStatsDisconns: window.playerList.get(player.id)!.stats.disconns,
        playerStatsWins: window.playerList.get(player.id)!.stats.wins,
        playerStatsGoals: window.playerList.get(player.id)!.stats.goals,
        playerStatsAssists: window.playerList.get(player.id)!.stats.assists,
        playerStatsOgs: window.playerList.get(player.id)!.stats.ogs,
        playerStatsLosepoints: window.playerList.get(player.id)!.stats.losePoints,
        gameRuleName: window.settings.game.rule.ruleName,
        gameRuleDescription: window.settings.game.rule.ruleDescripttion,
        gameRuleLimitTime: window.settings.game.rule.requisite.timeLimit,
        gameRuleLimitScore: window.settings.game.rule.requisite.scoreLimit,
        gameRuleNeedMin: window.settings.game.rule.requisite.minimumPlayers,
        possTeamRed: window.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.winningStreak.teamID),
        streakTeamCount: window.winningStreak.count
    };

    window.logger.i(`${player.name}#${player.id} has left.`);

    // check number of players joined and change game mode
    let activePlayersNumber: number = roomActivePlayersNumberCheck();
    if (window.settings.game.rule.statsRecord === true && activePlayersNumber >= window.settings.game.rule.requisite.minimumPlayers) {
        if (window.isStatRecord === false) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.onLeft.startRecord, placeholderLeft), null, 0x00FF00, "normal", 0);
            window.isStatRecord = true;
        }
        // when auto emcee mode is enabled
        if(window.settings.game.rule.autoOperating === true && window.isGamingNow === true) {
            if(player.team !== TeamID.Spec) {
                putTeamNewPlayerFullify(); // put new players into the team this player has left
            }
        }
    } else {
        if (window.isStatRecord === true) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.onLeft.stopRecord, placeholderLeft), null, 0x00FF00, "normal", 0);
            window.isStatRecord = false;
            // when auto emcee mode is enabled and lack of players
            if(window.settings.game.rule.autoOperating === true && window.isGamingNow === true) {
                window.room.stopGame(); // stop for start readymode game
                window.winningStreak = { // init
                    count: 0,
                    teamID: 0
                };
            } 
        }
    }

    if(window.isGamingNow === true && window.isStatRecord === true && window.playerList.get(player.id)!.team !== TeamID.Spec) {
        // if this player is disconnected (include abscond)
        window.playerList.get(player.id)!.stats.disconns++;
        placeholderLeft.playerStatsDisconns = window.playerList.get(player.id)!.stats.disconns;
        if(BotSettings.antiGameAbscond === true) { // if anti abscond option is enabled
            window.playerList.get(player.id)!.stats.rating -= BotSettings.gameAbscondRatingPenalty; // rating penalty
            if(await getBanlistDataFromDB(window.playerList.get(player.id)!.conn) === undefined ) { // if this player is in match(team player), fixed-term ban this player
                // check this player already registered in ban list to prevent overwriting other ban reason.
                window.logger.i(`${player.name}#${player.id} has been added in fixed term ban list for abscond.`);
                await setBanlistDataToDB({ conn: window.playerList.get(player.id)!.conn, reason: LangRes.antitrolling.gameAbscond.banReason, register: leftTimeStamp, expire: leftTimeStamp + BotSettings.gameAbscondBanMillisecs });
            }
        }
    }

    window.playerList.get(player.id)!.entrytime.leftDate = leftTimeStamp; // save left time
    await setPlayerDataToDB(convertToPlayerStorage(window.playerList.get(player.id)!)); // save
    window.playerList.delete(player.id); // delete from player list

    if(window.settings.game.rule.autoAdmin === true) { // if auto admin option is enabled
        updateAdmins(); // update admin
    }
}
