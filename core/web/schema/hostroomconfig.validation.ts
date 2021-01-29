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
});
