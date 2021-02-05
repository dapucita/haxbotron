import { PlayerObject } from "../model/GameObject/PlayerObject";

export function getUnixTimestamp(): number {
    return Math.floor(Date.now()); // return Unix timestamp (milliseconds)
}

export function calcWinsRate(totalGames: number, winGames: number): number {
    // calculate the given Player's winning games rate
    if(totalGames === 0) {
        return 0;
    }
    return Math.round((winGames / totalGames) * 100);
}

export function calcGoalsPerGame(totalGames: number, totalGoals: number): number {
    // calculate the given Player's goal rate per game
    if(totalGames === 0) {
        return 0;
    }
    return parseFloat((totalGoals / totalGames).toFixed(1));
}

export function calcOGsPerGame(totalGames: number, totalOGs: number): number {
    // calculate the given Player's goal rate per game
    if(totalGames === 0) {
        return 0;
    }
    return parseFloat((totalOGs / totalGames).toFixed(1));
}

export function calcLoseGoalsPerGame(totalGames: number, totalLosePoints: number): number {
    // calculate the given Player's lost goals rate per game
    if(totalGames === 0) {
        return 0;
    }
    return parseFloat((totalLosePoints / totalGames).toFixed(1));
}

export function calcAssistsPerGame(totalGames: number, totalAssists: number): number {
    // calculate the given Player's goal rate per game
    if(totalGames === 0) {
        return 0;
    }
    return parseFloat((totalAssists / totalGames).toFixed(1));
}

export function calcPassSuccessRate(totalPasses: number, totalSuccess: number): number {
    if(totalPasses === 0) {
        return 0;
    }
    return Math.round((totalSuccess / totalPasses) * 100);
}

export function calcExpectedWinRate(wins: number, loses: number): number { // Pythagorean expectation(PE)
    let winsPow: number = Math.pow(wins, 1.83); // 1.83 or 2.00
    let losesPow: number = Math.pow(loses, 1.83);
    return Math.round((winsPow / (winsPow + losesPow)) * 100);
}

export function getTeamWinningExpectation(): number[] {
    if (window.gameRoom.isStatRecord == true) { // if the game mode is stats
        // init for count
        let goalsCount: number[] = [
            0, 0, 0 // spec, red, blue team
        ];
        let losesCount: number[] = [
            0, 0, 0 // spec, red, blue team
        ]

        window.gameRoom._room.getPlayerList().filter((player: PlayerObject) => player.id != 0).forEach((player: PlayerObject) => {
            // count win and lose games
            goalsCount[player.team] += window.gameRoom.playerList.get(player.id)!.stats.goals;
            losesCount[player.team] += window.gameRoom.playerList.get(player.id)!.stats.losePoints;
        });

        return [
            calcExpectedWinRate(goalsCount[0], losesCount[0]),
            calcExpectedWinRate(goalsCount[1], losesCount[1]),
            calcExpectedWinRate(goalsCount[2], losesCount[2])
        ];
    } else {
        return [0, 0, 0];
    }
}