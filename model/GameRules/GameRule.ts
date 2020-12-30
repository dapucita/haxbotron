export interface GameRule {
    ruleName: string; // name
    ruleVersion?: string; // version of this rule ("X.X.X")
    ruleAuthor?: string; // author of this rule
    ruleDescripttion?: string; // simple description of this rule
    requisite: {
        minimumPlayers: number; // minimum number of players needs for apply this rule
        eachTeamPlayers: number; // how many players are need in each team?
        timeLimit: number; // limit time for end the game
        scoreLimit: number; // limit score for end the game
        teamLock: boolean; // limit moving teams by self
    }
    autoAdmin: boolean; // auto appoint admin
    autoOperating: boolean; // auto emcee mode
    captain: boolean; // captain mode. captain of each team can pick their team player.
    statsRecord: boolean; // record game results on statistics system.
    defaultMap: string; // default stadium data for the game.
    readyMap: string; // stadium data for using until the game starts. If statsRecord options is false, S E T this same as defaultMap option.
}