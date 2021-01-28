export interface BrowserHostRoomInitConfig {
    _LaunchDate: Date; // date of this room created
    _RUID: string; // room unique identifier for this game room
    _config: BrowserHostRoomConfig; // room config data for set this new room
    settings: BrowserHostRoomSettings; // room settings data for set options
    rules: BrowserHostRoomGameRule; // game playing rule
}

export interface BrowserHostRoomConfig {
    roomName: string
    playerName: string
    password?: string
    maxPlayers: number
    public: boolean
    token: string
    noPlayer: boolean
    geo?: {
        code: string
        lat: number
        lon: number
    }
}

export interface BrowserHostRoomGameRule {
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

export interface BrowserHostRoomSettings {
    maliciousBehaviourBanCriterion: number

    banVoteEnable : boolean
    banVoteBanMillisecs : number
    banVoteAllowMinimum : number
    banVoteExecuteMinimum : number

    afkCountLimit : number

    afkCommandAutoKick : boolean
    afkCommandAutoKickAllowMillisecs : number

    chatFiltering : boolean

    antiJoinFlood : boolean
    joinFloodAllowLimitation : number
    joinFloodIntervalMillisecs : number
    joinFloodBanMillisecs : number

    antiChatFlood : boolean
    chatFloodCriterion : number

    antiOgFlood : boolean
    ogFloodCriterion : number
    ogFloodBanMillisecs : number

    antiBanNoPermission : boolean
    banNoPermissionBanMillisecs : number

    antiInsufficientStartAbusing : boolean
    insufficientStartAllowLimitation : number
    insufficientStartAbusingBanMillisecs : number

    antiPlayerKickAbusing : boolean
    playerKickAllowLimitation : number
    playerKickIntervalMillisecs : number
    playerKickAbusingBanMillisecs : number

    antiAFKFlood : boolean
    antiAFKAbusing : boolean

    antiMuteAbusing : boolean
    muteAllowIntervalMillisecs : number
    muteDefaultMillisecs : number

    antiGameAbscond : boolean
    gameAbscondBanMillisecs : number
    gameAbscondRatingPenalty : number

    rerollWinStreak : boolean
    rerollWinstreakCriterion : number

    guaranteePlayingTime : boolean
    guaranteedPlayingTimeSeconds : number

    avatarOverridingByTier : boolean
}
