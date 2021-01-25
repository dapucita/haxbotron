import * as RatingSystemSettings from "../../resource/HElo/rating.json";
import { PlayerObject } from "../GameObject/PlayerObject";

export class HElo {
    // https://ryanmadden.net/posts/Adapting-Elo

    // written in Singleton Pattern
    // If the bot created HElo object once, never create ever until the bot instance dead. 

    private static instance: HElo = new HElo();

    private HElo() { } // not use
    
    public static getInstance(): HElo {
        if (this.instance == null) {
            this.instance = new HElo();
        }
        return this.instance;
    }

    // E(A)
    private calcExpectedResult(targetRating: number, counterpartRating: number): number {
        let res: number = parseFloat((1 / (1 + Math.pow(10, (counterpartRating - targetRating) / 400))).toFixed(2));

        return res;
    }

    // Q
    private calcQMultiplier(ratingWinnersMean: number, ratingLosersMean: number): number {
        let res: number = parseFloat((2.2 / ((ratingWinnersMean - ratingLosersMean) * 0.001 + 2.2)).toFixed(2));

        return res;
    }

    // PD
    private calcPD(targetRecord: StatsRecord, counterpartRecord: StatsRecord): number {
        let targetAdjustPassSuccRate: number = (targetRecord.realResult === MatchResult.Win)?targetRecord.matchPassSuccRate:(1-targetRecord.matchPassSuccRate);
        let counterpartAdjustPassSuccRate: number = (counterpartRecord.realResult === MatchResult.Win)?counterpartRecord.matchPassSuccRate:(1-counterpartRecord.matchPassSuccRate);
        
        let res: number = parseFloat((
            ((targetRecord.matchGoal - targetRecord.matchOG) * targetAdjustPassSuccRate)
            - ((counterpartRecord.matchGoal - counterpartRecord.matchOG) * counterpartAdjustPassSuccRate)
            ).toFixed(2));

        return res;
    }

    // MoVM
    private calcMoVMultiplier(difference: number, multiplierQ: number): number {
        let res: number = parseFloat((Math.log(Math.abs(difference) + 1) * multiplierQ).toFixed(2));

        return res;
    }

    // S(A)-E(A)
    private calcResultDifference(realResult: MatchResult, targetRating: number, counterpartRating: number): number {
        let res: number = parseFloat((realResult - this.calcExpectedResult(targetRating, counterpartRating)).toFixed(2));

        return res;
    }

    // K*MoVM*(S-E)
    public calcBothDiff(targetRecord: StatsRecord, counterpartRecord: StatsRecord, ratingWinnersMean: number, ratingLosersMean: number, factorK: MatchKFactor): number {
        let res: number = 
            parseFloat((factorK 
            * this.calcMoVMultiplier(this.calcPD(targetRecord, counterpartRecord), this.calcQMultiplier(ratingWinnersMean, ratingLosersMean))
            * (this.calcResultDifference(targetRecord.realResult, targetRecord.rating, counterpartRecord.rating))
            ).toFixed(2));

        return res;
    }

    // R' = R + sum of all diffs
    public calcNewRating(originalRating: number, diffs: number[]): number {
        let sumDiffs: number = diffs.reduce((acc, curr) => { return acc + curr}, 0);
        let res: number = Math.round(originalRating + sumDiffs);
        if(res < 0) res = 0; // minimum rating is 0.

        return res;
    }

    public calcTeamRatingsMean(eachTeamPlayers: PlayerObject[]): number {
        let res: number =  parseFloat((( eachTeamPlayers
            .map((eachPlayer: PlayerObject) => window.playerList.get(eachPlayer.id)!.stats.rating)
            .reduce((arr: number, curr: number) => { return arr+curr }, 0)
        ) / eachTeamPlayers.length).toFixed(2));

        return res;
    }

    public makeStasRecord(matchResult: MatchResult, teamPlayers: PlayerObject[]): StatsRecord[] {
        let statsRecords: StatsRecord[] = [];
        teamPlayers.forEach((eachPlayer: PlayerObject) => {
            statsRecords.push({
                rating: window.playerList.get(eachPlayer.id)!.stats.rating,
                realResult: matchResult,
                matchKFactor: window.playerList.get(eachPlayer.id)!.matchRecord.factorK,
                matchGoal: window.playerList.get(eachPlayer.id)!.matchRecord.goals,
                matchOG: window.playerList.get(eachPlayer.id)!.matchRecord.ogs,
                matchPassSuccRate: (
                    window.playerList.get(eachPlayer.id)!.matchRecord.balltouch === 0
                    ? 0
                    : parseFloat((window.playerList.get(eachPlayer.id)!.matchRecord.passed / window.playerList.get(eachPlayer.id)!.matchRecord.balltouch).toFixed(2))
                )
            });
        });

        return statsRecords;
    }
}

export interface StatsRecord {
    rating: number;
    realResult: MatchResult;
    matchKFactor: MatchKFactor;
    matchGoal: number;
    matchOG: number;
    matchPassSuccRate: number;
}

export enum MatchResult {
    Win = 1.0,
    Draw = 0.5,
    Lose = 0.0
}

export enum MatchKFactor {
    Normal = RatingSystemSettings.factor_k_normal, // normal match
    Placement = RatingSystemSettings.factor_k_placement, // placement match
    Replace = RatingSystemSettings.facotr_k_replace // the match for replace other player who abscond from the match
}
