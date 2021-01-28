import Joi from 'joi';

const roomConfigSchema = Joi.object().keys({
    roomName: Joi.string().required()
    ,playerName: Joi.string().required()
    ,password: Joi.string().optional()
    ,maxPlayers: Joi.number().required()
    ,public: Joi.boolean().required()
    ,token: Joi.string().required()
    ,noPlayer: Joi.boolean().required()
    ,geo: Joi.object().keys({
        code: Joi.string()
        ,lat: Joi.number()
        ,lon: Joi.number()
    }).optional()
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
    ,customJSONOptions: Joi.string().optional()
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
});

export const nestedHostRoomConfigSchema = Joi.object().keys({
    ruid: Joi.string().required()
    ,_config: roomConfigSchema.required()
    ,settings: roomSettingSchema.required()
    ,rules: gameRuleSchema.required()
});
