export interface GameRule {
    ruleName: string; // name
    ruleVersion?: string; // version of this rule ("X.X.X")
    ruleAuthor?: string; // author of this rule
    ruleDescripttion?: string; // simple description of this rule
    requisite: {
        minimumPlayers: number; // minimum number of players needs for apply this rule
        maximumPlayers?: number; // maximum number of players limits for apply this rule
        timeLimit: number; // limit time for end the game
        scoreLimit: number; // limit score for end the game
        teamLock: boolean; // limit moving teams by self
    }
    autoOperating: boolean; // auto emcee mode
    statsRecord: boolean; // record game results on statistics system.
    defaultMap: string; // default stadium data for the game.
    readyMap: string; // stadium data for using until the game starts.
}