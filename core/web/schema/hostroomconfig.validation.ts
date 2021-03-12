import Joi from 'joi';

const roomConfigSchema = Joi.object().keys({
    roomName: Joi.string().required()
    ,playerName: Joi.string().required()
    ,password: Joi.string().optional().allow(null, '')
    ,maxPlayers: Joi.number().required()
    ,public: Joi.boolean().required()
    ,token: Joi.string().required()
    ,noPlayer: Joi.boolean().required()
    ,geo: Joi.object().keys({
        code: Joi.string()
        ,lat: Joi.number()
        ,lon: Joi.number()
    }).optional().allow(null)
});

const gameRuleSchema = Joi.object().keys({
    ruleName: Joi.string().required()
    ,ruleDescription: Joi.string().required()
    ,requisite: Joi.object().keys({
        minimumPlayers: Joi.number().required()
        ,eachTeamPlayers: Joi.number().required()
        ,timeLimit: Joi.number().required()
        ,scoreLimit: Joi.number().required()
        ,teamLock: Joi.boolean().required()
    }).required()
    ,autoAdmin: Joi.boolean().required()
    ,autoOperating: Joi.boolean().required()
    ,statsRecord: Joi.boolean().required()
    ,defaultMapName: Joi.string().required()
    ,readyMapName: Joi.string().required()
    ,customJSONOptions: Joi.string().optional().allow(null, '')
});

const roomSettingSchema = Joi.object().keys({
    maliciousBehaviourBanCriterion: Joi.number().required()

    ,banVoteEnable : Joi.boolean().required()
    ,banVoteBanMillisecs : Joi.number().required()
    ,banVoteAllowMinimum : Joi.number().required()
    ,banVoteExecuteMinimum : Joi.number().required()

    ,afkCountLimit : Joi.number().required()

    ,afkCommandAutoKick : Joi.boolean().required()
    ,afkCommandAutoKickAllowMillisecs : Joi.number().required()

    ,chatFiltering : Joi.boolean().required()

    ,antiJoinFlood : Joi.boolean().required()
    ,joinFloodAllowLimitation : Joi.number().required()
    ,joinFloodIntervalMillisecs : Joi.number().required()
    ,joinFloodBanMillisecs : Joi.number().required()

    ,antiChatFlood : Joi.boolean().required()
    ,chatFloodCriterion : Joi.number().required()

    ,antiOgFlood : Joi.boolean().required()
    ,ogFloodCriterion : Joi.number().required()
    ,ogFloodBanMillisecs : Joi.number().required()

    ,antiBanNoPermission : Joi.boolean().required()
    ,banNoPermissionBanMillisecs : Joi.number().required()

    ,antiInsufficientStartAbusing : Joi.boolean().required()
    ,insufficientStartAllowLimitation : Joi.number().required()
    ,insufficientStartAbusingBanMillisecs : Joi.number().required()

    ,antiPlayerKickAbusing : Joi.boolean().required()
    ,playerKickAllowLimitation : Joi.number().required()
    ,playerKickIntervalMillisecs : Joi.number().required()
    ,playerKickAbusingBanMillisecs : Joi.number().required()

    ,antiAFKFlood : Joi.boolean().required()
    ,antiAFKAbusing : Joi.boolean().required()

    ,antiMuteAbusing : Joi.boolean().required()
    ,muteAllowIntervalMillisecs : Joi.number().required()
    ,muteDefaultMillisecs : Joi.number().required()

    ,antiGameAbscond : Joi.boolean().required()
    ,gameAbscondBanMillisecs : Joi.number().required()
    ,gameAbscondRatingPenalty : Joi.number().required()

    ,rerollWinStreak : Joi.boolean().required()
    ,rerollWinstreakCriterion : Joi.number().required()

    ,guaranteePlayingTime : Joi.boolean().required()
    ,guaranteedPlayingTimeSeconds : Joi.number().required()

    ,avatarOverridingByTier : Joi.boolean().required()

    ,nicknameLengthLimit : Joi.number().required()
    ,chatLengthLimit : Joi.number().required()
    
    ,forbidDuplicatedNickname: Joi.boolean().required()
});

const commandsSchema = Joi.object().keys({
    _commandPrefix: Joi.string().required(),

    _helpManabout: Joi.string().required(),
    _helpManafk: Joi.string().required(),
    _helpManfreeze: Joi.string().required(),
    _helpManhelp: Joi.string().required(),
    _helpManlist: Joi.string().required(),
    _helpManmute: Joi.string().required(),
    _helpManposs: Joi.string().required(),
    _helpManscout: Joi.string().required(),
    _helpManstats: Joi.string().required(),
    _helpManstatsreset: Joi.string().required(),
    _helpManstreak: Joi.string().required(),
    _helpManvote: Joi.string().required(),
    _helpMantier: Joi.string().required(),
    _helpMansuper: Joi.string().required(),
    _helpManadmin: Joi.string().required(),
    _helpMannotice: Joi.string().required(),

    _listSubafk: Joi.string().required(),
    _listSubmute: Joi.string().required(),
    _listSubred: Joi.string().required(),
    _listSubblue: Joi.string().required(),
    _listSubspec: Joi.string().required(),

    _superSublogin: Joi.string().required(),
    _superSublogout: Joi.string().required(),
    _superSubthor: Joi.string().required(),
    _superSubthordeprive: Joi.string().required(),
    _superSubkick: Joi.string().required(),
    _superSubban: Joi.string().required(),

    _disabledCommandList: Joi.array().items(Joi.string()).optional().allow(null),

    about: Joi.string().required(),
    afk: Joi.string().required(),
    freeze: Joi.string().required(),
    help: Joi.string().required(),
    list: Joi.string().required(),
    mute: Joi.string().required(),
    poss: Joi.string().required(),
    scout: Joi.string().required(),
    stats: Joi.string().required(),
    statsreset: Joi.string().required(),
    streak: Joi.string().required(),
    super: Joi.string().required(),
    vote: Joi.string().required(),
    tier: Joi.string().required(),
    notice: Joi.string().required(),
});

const configHEloSchema = Joi.object().keys({
    factor: Joi.object().keys({
        placement_match_chances: Joi.number().required()
        ,factor_k_placement: Joi.number().required()
        ,factor_k_normal: Joi.number().required()
        ,factor_k_replace: Joi.number().required()
    }).required()
    ,tier: Joi.object().keys({
        class_tier_1: Joi.number().required()
        ,class_tier_2: Joi.number().required()
        ,class_tier_3: Joi.number().required()
        ,class_tier_4: Joi.number().required()
        ,class_tier_5: Joi.number().required()
        ,class_tier_6: Joi.number().required()
        ,class_tier_7: Joi.number().required()
        ,class_tier_8: Joi.number().required()
        ,class_tier_9: Joi.number().required()
    }).required()
    ,avatar: Joi.object().keys({
        avatar_unknown: Joi.string().required()
        ,avatar_tier_new: Joi.string().required()
        ,avatar_tier_1: Joi.string().required()
        ,avatar_tier_2: Joi.string().required()
        ,avatar_tier_3: Joi.string().required()
        ,avatar_tier_4: Joi.string().required()
        ,avatar_tier_5: Joi.string().required()
        ,avatar_tier_6: Joi.string().required()
        ,avatar_tier_7: Joi.string().required()
        ,avatar_tier_8: Joi.string().required()
        ,avatar_tier_9: Joi.string().required()
    }).required()
});

export const nestedHostRoomConfigSchema = Joi.object().keys({
    ruid: Joi.string().required()
    ,_config: roomConfigSchema.required()
    ,settings: roomSettingSchema.required()
    ,rules: gameRuleSchema.required()
    ,helo: configHEloSchema.required()
    ,commands: commandsSchema.required()
});
