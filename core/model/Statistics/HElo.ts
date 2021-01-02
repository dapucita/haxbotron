import { PlayerObject } from "../GameObject/PlayerObject";
import { TeamID } from "../GameObject/TeamID";

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
        return parseFloat((1 / 1 + Math.pow(10, (targetRating - counterpartRating) / 400)).toFixed(2));
    }

    // Q
    private calcQMultiplier(ratingWinnersMean: number, ratingLosersMean: number): number {
        return parseFloat((2.2 / ((ratingWinnersMean - ratingLosersMean) * 0.001 + 2.2)).toFixed(2));
    }

    // PD
    private calcPD(targetRecord: StatsRecord, counterpartRecord: StatsRecord): number {
        return parseFloat(
            (((targetRecord.matchGoal - targetRecord.matchOG) * targetRecord.matchPassSuccRate) - ((counterpartRecord.matchGoal - counterpartRecord.matchOG) * counterpartRecord.matchPassSuccRate))
            .toFixed(2)
        );
    }

    // MoVM
    private calcMoVMultiplier(difference: number, multiplierQ: number): number {
        return parseFloat((Math.log(Math.abs(difference) + 1) * multiplierQ).toFixed(2));
    }

    // S(A)-E(A)
    private calcResultDifference(realResult: MatchResult, targetRating: number, counterpartRating: number): number {
        return parseFloat((realResult - this.calcExpectedResult(targetRating, counterpartRating)).toFixed(2));
    }

    // K*MoVM*(S-E)
    public calcBothDiff(targetRecord: StatsRecord, counterpartRecord: StatsRecord, ratingWinnersMean: number, ratingLosersMean: number, factorK: MatchKFactor): number {
        return parseFloat(
            (factorK 
            * this.calcMoVMultiplier(this.calcPD(targetRecord, counterpartRecord), this.calcQMultiplier(ratingWinnersMean, ratingLosersMean))
            * (this.calcResultDifference(targetRecord.realResult, targetRecord.rating, counterpartRecord.rating))
            ).toFixed(2)
        );
    }

    // R' = R + sum of all diffs
    public calcNewRating(originalRating: number, diffs: number[]): number {
        return originalRating
            + diffs.reduce((acc, curr) => {
                return acc + curr
            }, 0);
    }

    public calcTeamRatingsMean(eachTeamPlayers: PlayerObject[]): number {
        return ( eachTeamPlayers
            .map((eachPlayer: PlayerObject) => window.playerList.get(eachPlayer.id)!.stats.rating)
            .reduce((arr: number, curr: number) => { return arr+curr }, 0)
        ) / eachTeamPlayers.length
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
                matchPassSuccRate: (window.playerList.get(eachPlayer.id)!.matchRecord.passed / window.playerList.get(eachPlayer.id)!.matchRecord.balltouch)
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
    Normal = 20, // normal match
    Placement = 30, // placement match
    Replace = 10 // the match for replace other player who abscond from the match
}
