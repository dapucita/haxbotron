export function calcWinsRate(totalGames: number, winGames: number): number {
    // calculate the given Player's winning games rate
    if(totalGames == 0) {
        return 0;
    }
    return Math.round((winGames / totalGames) * 100);
}

export function calcGoalsPerGame(totalGames: number, totalGoals: number): number {
    // calculate the given Player's goal rate per game
    if(totalGames == 0) {
        return 0;
    }
    return Math.round((totalGoals / totalGames) * 100);
}

export function calcOGsPerGame(totalGames: number, totalOGs: number): number {
    // calculate the given Player's goal rate per game
    if(totalGames == 0) {
        return 0;
    }
    return Math.round((totalOGs / totalGames) * 100);
}

export function calcAssistsPerGame(totalGames: number, totalAssists: number): number {
    // calculate the given Player's goal rate per game
    if(totalGames == 0) {
        return 0;
    }
    return Math.round((totalAssists / totalGames) * 100);
}

export function calcPassSuccessRate(totalPasses: number, totalSuccess: number): number {
    if(totalPasses == 0) {
        return 0;
    }
    return Math.round((totalSuccess / totalPasses) * 100);
}

export function calcExpectedWinRate(wins: number, loses: number): number { // Pythagorean expectation(PE)
    let winsPow: number = Math.pow(wins, 1.83);
    let losesPow: number = Math.pow(loses, 1.83);
    return Math.round((winsPow / (winsPow + losesPow)) * 100);
}

export function calcCombatPower() {

}