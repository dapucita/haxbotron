import * as Tst from "../Translator";
import * as LangRes from "../../resource/strings";
import * as StatCalc from "../Statistics";
import * as RatingSystemSettings from "../../resource/HElo/rating.json";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { decideTier, getAvatarByTier, Tier } from "../../model/Statistics/Tier";

export function cmdStats(byPlayer: PlayerObject, message?: string): void {
    if (message !== undefined) {
        //stats for other player who are on this room
        if (message.charAt(0) == "#") {
            let targetStatsID: number = parseInt(message.substr(1), 10);
            if (isNaN(targetStatsID) != true && window.gameRoom.playerList.has(targetStatsID) == true) { // if the value is not NaN and there's the player
                let placeholder = {
                    ticketTarget: targetStatsID
                    ,targetName: window.gameRoom.playerList.get(targetStatsID)!.name
                    ,targetAfkReason: window.gameRoom.playerList.get(targetStatsID)!.permissions.afkreason
                    ,targetStatsRatingAvatar: getAvatarByTier( // set avatar
                        (window.gameRoom.playerList.get(targetStatsID)!.stats.totals < RatingSystemSettings.placement_match_chances)
                        ? Tier.TierNew
                        : decideTier(window.gameRoom.playerList.get(targetStatsID)!.stats.rating))
                    ,targetStatsRating: window.gameRoom.playerList.get(targetStatsID)!.stats.rating
                    ,targetStatsTotal: window.gameRoom.playerList.get(targetStatsID)!.stats.totals
                    ,targetStatsDisconns: window.gameRoom.playerList.get(targetStatsID)!.stats.disconns
                    ,targetStatsWins: window.gameRoom.playerList.get(targetStatsID)!.stats.wins
                    ,targetStatsGoals: window.gameRoom.playerList.get(targetStatsID)!.stats.goals
                    ,targetStatsAssists: window.gameRoom.playerList.get(targetStatsID)!.stats.assists
                    ,targetStatsOgs: window.gameRoom.playerList.get(targetStatsID)!.stats.ogs
                    ,targetStatsLosepoints: window.gameRoom.playerList.get(targetStatsID)!.stats.losePoints
                    ,targetStatsWinRate: StatCalc.calcWinsRate(window.gameRoom.playerList.get(targetStatsID)!.stats.totals, window.gameRoom.playerList.get(targetStatsID)!.stats.wins)
                    ,targetStatsPassSuccess: StatCalc.calcPassSuccessRate(window.gameRoom.playerList.get(targetStatsID)!.stats.balltouch, window.gameRoom.playerList.get(targetStatsID)!.stats.passed)
                    ,targetStatsGoalsPerGame: StatCalc.calcGoalsPerGame(window.gameRoom.playerList.get(targetStatsID)!.stats.totals, window.gameRoom.playerList.get(targetStatsID)!.stats.goals)
                    ,targetStatsAssistsPerGame: StatCalc.calcAssistsPerGame(window.gameRoom.playerList.get(targetStatsID)!.stats.totals, window.gameRoom.playerList.get(targetStatsID)!.stats.assists)
                    ,targetStatsOgsPerGame: StatCalc.calcOGsPerGame(window.gameRoom.playerList.get(targetStatsID)!.stats.totals, window.gameRoom.playerList.get(targetStatsID)!.stats.ogs)
                    ,targetStatsLostGoalsPerGame: StatCalc.calcLoseGoalsPerGame(window.gameRoom.playerList.get(targetStatsID)!.stats.totals, window.gameRoom.playerList.get(targetStatsID)!.stats.losePoints)
                }
                window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.command.stats.statsMsg, placeholder), byPlayer.id, 0x479947, "normal", 1);
            } else {
                window.gameRoom._room.sendAnnouncement(LangRes.command.stats._ErrorNoPlayer, byPlayer.id, 0xFF7777, "normal", 2);
            }
        } else {
            window.gameRoom._room.sendAnnouncement(LangRes.command.stats._ErrorNoPlayer, byPlayer.id, 0xFF7777, "normal", 2);
        }
    } else {
        //stats for him/herself
        let placeholder = {
            ticketTarget: byPlayer.id
            ,targetName: window.gameRoom.playerList.get(byPlayer.id)!.name
            ,targetAfkReason: window.gameRoom.playerList.get(byPlayer.id)!.permissions.afkreason
            ,targetStatsRatingAvatar: getAvatarByTier( // set avatar
                (window.gameRoom.playerList.get(byPlayer.id)!.stats.totals < RatingSystemSettings.placement_match_chances)
                ? Tier.TierNew
                : decideTier(window.gameRoom.playerList.get(byPlayer.id)!.stats.rating))
            ,targetStatsRating: window.gameRoom.playerList.get(byPlayer.id)!.stats.rating
            ,targetStatsTotal: window.gameRoom.playerList.get(byPlayer.id)!.stats.totals
            ,targetStatsDisconns: window.gameRoom.playerList.get(byPlayer.id)!.stats.disconns
            ,targetStatsWins: window.gameRoom.playerList.get(byPlayer.id)!.stats.wins
            ,targetStatsGoals: window.gameRoom.playerList.get(byPlayer.id)!.stats.goals
            ,targetStatsAssists: window.gameRoom.playerList.get(byPlayer.id)!.stats.assists
            ,targetStatsOgs: window.gameRoom.playerList.get(byPlayer.id)!.stats.ogs
            ,targetStatsLosepoints: window.gameRoom.playerList.get(byPlayer.id)!.stats.losePoints
            ,targetStatsWinRate: StatCalc.calcWinsRate(window.gameRoom.playerList.get(byPlayer.id)!.stats.totals, window.gameRoom.playerList.get(byPlayer.id)!.stats.wins)
            ,targetStatsPassSuccess: StatCalc.calcPassSuccessRate(window.gameRoom.playerList.get(byPlayer.id)!.stats.balltouch, window.gameRoom.playerList.get(byPlayer.id)!.stats.passed)
            ,targetStatsGoalsPerGame: StatCalc.calcGoalsPerGame(window.gameRoom.playerList.get(byPlayer.id)!.stats.totals, window.gameRoom.playerList.get(byPlayer.id)!.stats.goals)
            ,targetStatsAssistsPerGame: StatCalc.calcAssistsPerGame(window.gameRoom.playerList.get(byPlayer.id)!.stats.totals, window.gameRoom.playerList.get(byPlayer.id)!.stats.assists)
            ,targetStatsOgsPerGame: StatCalc.calcOGsPerGame(window.gameRoom.playerList.get(byPlayer.id)!.stats.totals, window.gameRoom.playerList.get(byPlayer.id)!.stats.ogs)
            ,targetStatsLostGoalsPerGame: StatCalc.calcLoseGoalsPerGame(window.gameRoom.playerList.get(byPlayer.id)!.stats.totals, window.gameRoom.playerList.get(byPlayer.id)!.stats.losePoints)
        }
        window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.command.stats.statsMsg, placeholder), byPlayer.id, 0x479947, "normal", 1);
    }
}
