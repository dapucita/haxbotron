export interface ScoresObject {
    // ScoresObject holds information relevant to the current game scores

    // The number of goals scored by the red team (int)
    red: number;

    // The number of goals scored by the blue team (int)
    blue: number;

    // The number of seconds elapsed (seconds don't advance while the game is paused) (float)
    time: number;

    // The score limit for the game. (int)
    scoreLimit: number;

    // The time limit for the game. (float)
    timeLimit: number;

}