export interface GameRoomRule {
    ruleName: string // rule name
    ruleDescription: string // simple description of this rule
    requisite: {
        minimumPlayers: number // minimum number of players needs for apply this rule
        eachTeamPlayers: number // how many players are need in each team?
        timeLimit: number // limit time for end the game
        scoreLimit: number // limit score for end the game
        teamLock: boolean // limit moving teams by self
    }
    autoAdmin: boolean // auto appoint admin
    autoOperating: boolean // auto emcee mode
    statsRecord: boolean // record game results on statistics system.
    defaultMapName: string // select default stadium name for the game.
    readyMapName: string // select stadium name for using until the game starts.
    customJSONOptions?: string // JSON stringified cumstom options.
}
