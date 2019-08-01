export function calcWinsRate(totalGames: number, winGames: number): number {
    // calculate the given Player's winning games rate
    if(totalGames == 0 && winGames == 0) {
        return 0;
    }
    return Math.round((winGames / totalGames) * 100);
}

export function calcGoalsPerGame(totalGames: number, totalGoals: number): number {
    // calculate the given Player's goal rate per game
    if(totalGames == 0 && totalGoals == 0) {
        return 0;
    }
    return Math.round((totalGoals / totalGames) * 100);
}

export function calcOGsPerGame(totalGames: number, totalOGs: number): number {
    // calculate the given Player's goal rate per game
    if(totalGames == 0 && totalOGs == 0) {
        return 0;
    }
    return Math.round((totalOGs / totalGames) * 100);
}

export function calcAssistsPerGame(totalGames: number, totalAssists: number): number {
    // calculate the given Player's goal rate per game
    if(totalGames == 0 && totalAssists == 0) {
        return 0;
    }
    return Math.round((totalAssists / totalGames) * 100);
}

export function calcPassSuccessRate(totalPasses: number, totalSuccess: number): number {
    if(totalPasses == 0 && totalSuccess == 0) {
        return 0;
    }
    return Math.round((totalSuccess / totalPasses) * 100);
}