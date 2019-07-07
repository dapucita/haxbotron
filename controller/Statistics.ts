export function calcWinRate(totalGames: number, winGames: number): number {
    // calculate the given Player's winning games rate
    return Math.round((winGames / totalGames) * 100);
}

export function calcGoalPerGame(totalGames: number, totalGoals: number): number {
    // calculate the given Player's goal rate per game
    return Math.round((totalGoals / totalGames) * 100);
}

export function calcOGPerGame(totalGames: number, totalOGs: number): number {
    // calculate the given Player's goal rate per game
    return Math.round((totalOGs / totalGames) * 100);
}

