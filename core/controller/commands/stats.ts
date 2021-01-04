import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import * as StatCalc from "../../controller/Statistics";
import * as RatingSystemSettings from "../../resources/HElo/rating.json";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { decideTier, getAvatarByTier, Tier } from "../../model/Statistics/Tier";

export function cmdStats(byPlayer: PlayerObject, message?: string): void {
    if (message !== undefined) {
        //stats for other player who are on this room
        if (message.charAt(0) == "#") {
            let targetStatsID: number = parseInt(message.substr(1), 10);
            if (isNaN(targetStatsID) != true && window.playerList.has(targetStatsID) == true) { // if the value is not NaN and there's the player
                let placeholder = {
                    ticketTarget: targetStatsID
                    ,targetName: window.playerList.get(targetStatsID)!.name
                    ,targetAfkReason: window.playerList.get(targetStatsID)!.permissions.afkreason
                    ,targetStatsRatingAvatar: getAvatarByTier( // set avatar
                        (window.playerList.get(targetStatsID)!.stats.totals < RatingSystemSettings.placement_match_chances)
                        ? Tier.TierNew
                        : decideTier(window.playerList.get(targetStatsID)!.stats.rating))
                    ,targetStatsRating: window.playerList.get(targetStatsID)!.stats.rating
                    ,targetStatsTotal: window.playerList.get(targetStatsID)!.stats.totals
                    ,targetStatsWins: window.playerList.get(targetStatsID)!.stats.wins
                    ,targetStatsGoals: window.playerList.get(targetStatsID)!.stats.goals
                    ,targetStatsAssists: window.playerList.get(targetStatsID)!.stats.assists
                    ,targetStatsOgs: window.playerList.get(targetStatsID)!.stats.ogs
                    ,targetStatsLosepoints: window.playerList.get(targetStatsID)!.stats.losePoints
                    ,targetStatsWinRate: StatCalc.calcWinsRate(window.playerList.get(targetStatsID)!.stats.totals, window.playerList.get(targetStatsID)!.stats.wins)
                    ,targetStatsPassSuccess: StatCalc.calcPassSuccessRate(window.playerList.get(targetStatsID)!.stats.balltouch, window.playerList.get(targetStatsID)!.stats.passed)
                    ,targetStatsGoalsPerGame: StatCalc.calcGoalsPerGame(window.playerList.get(targetStatsID)!.stats.totals, window.playerList.get(targetStatsID)!.stats.goals)
                    ,targetStatsAssistsPerGame: StatCalc.calcAssistsPerGame(window.playerList.get(targetStatsID)!.stats.totals, window.playerList.get(targetStatsID)!.stats.assists)
                    ,targetStatsOgsPerGame: StatCalc.calcOGsPerGame(window.playerList.get(targetStatsID)!.stats.totals, window.playerList.get(targetStatsID)!.stats.ogs)
                    ,targetStatsLostGoalsPerGame: StatCalc.calcLoseGoalsPerGame(window.playerList.get(targetStatsID)!.stats.totals, window.playerList.get(targetStatsID)!.stats.losePoints)
                }
                window.room.sendAnnouncement(Tst.maketext(LangRes.command.stats.statsMsg, placeholder), byPlayer.id, 0x479947, "normal", 1);
            } else {
                window.room.sendAnnouncement(LangRes.command.stats._ErrorNoPlayer, byPlayer.id, 0xFF7777, "normal", 2);
            }
        } else {
            window.room.sendAnnouncement(LangRes.command.stats._ErrorNoPlayer, byPlayer.id, 0xFF7777, "normal", 2);
        }
    } else {
        //stats for him/herself
        let placeholder = {
            ticketTarget: byPlayer.id
            ,targetName: window.playerList.get(byPlayer.id)!.name
            ,targetAfkReason: window.playerList.get(byPlayer.id)!.permissions.afkreason
            ,targetStatsRatingAvatar: getAvatarByTier( // set avatar
                (window.playerList.get(byPlayer.id)!.stats.totals < RatingSystemSettings.placement_match_chances)
                ? Tier.TierNew
                : decideTier(window.playerList.get(byPlayer.id)!.stats.rating))
            ,targetStatsRating: window.playerList.get(byPlayer.id)!.stats.rating
            ,targetStatsTotal: window.playerList.get(byPlayer.id)!.stats.totals
            ,targetStatsWins: window.playerList.get(byPlayer.id)!.stats.wins
            ,targetStatsGoals: window.playerList.get(byPlayer.id)!.stats.goals
            ,targetStatsAssists: window.playerList.get(byPlayer.id)!.stats.assists
            ,targetStatsOgs: window.playerList.get(byPlayer.id)!.stats.ogs
            ,targetStatsLosepoints: window.playerList.get(byPlayer.id)!.stats.losePoints
            ,targetStatsWinRate: StatCalc.calcWinsRate(window.playerList.get(byPlayer.id)!.stats.totals, window.playerList.get(byPlayer.id)!.stats.wins)
            ,targetStatsPassSuccess: StatCalc.calcPassSuccessRate(window.playerList.get(byPlayer.id)!.stats.balltouch, window.playerList.get(byPlayer.id)!.stats.passed)
            ,targetStatsGoalsPerGame: StatCalc.calcGoalsPerGame(window.playerList.get(byPlayer.id)!.stats.totals, window.playerList.get(byPlayer.id)!.stats.goals)
            ,targetStatsAssistsPerGame: StatCalc.calcAssistsPerGame(window.playerList.get(byPlayer.id)!.stats.totals, window.playerList.get(byPlayer.id)!.stats.assists)
            ,targetStatsOgsPerGame: StatCalc.calcOGsPerGame(window.playerList.get(byPlayer.id)!.stats.totals, window.playerList.get(byPlayer.id)!.stats.ogs)
            ,targetStatsLostGoalsPerGame: StatCalc.calcLoseGoalsPerGame(window.playerList.get(byPlayer.id)!.stats.totals, window.playerList.get(byPlayer.id)!.stats.losePoints)
        }
        window.room.sendAnnouncement(Tst.maketext(LangRes.command.stats.statsMsg, placeholder), byPlayer.id, 0x479947, "normal", 1);
    }
}
