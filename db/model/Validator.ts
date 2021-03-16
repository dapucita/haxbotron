import Joi from 'joi';

export const playerModelSchema = Joi.object().keys({
    auth: Joi.string().required()
    ,conn: Joi.string().required()
    ,name: Joi.string().required()
    ,rating: Joi.number().required()
    ,totals: Joi.number().required()
    ,disconns: Joi.number().required()
    ,wins: Joi.number().required()
    ,goals: Joi.number().required()
    ,assists: Joi.number().required()
    ,ogs: Joi.number().required()
    ,losePoints: Joi.number().required()
    ,balltouch: Joi.number().required()
    ,passed: Joi.number().required()
    ,mute: Joi.boolean().required()
    ,muteExpire: Joi.number().required()
    ,rejoinCount: Joi.number().required()
    ,joinDate: Joi.number().required()
    ,leftDate: Joi.number().required()
    ,malActCount: Joi.number().required()
});

export const banListModelSchema = Joi.object().keys({
    conn: Joi.string().required()
    ,reason: Joi.string().required()
    ,register: Joi.number().required()
    ,expire: Joi.number().required()
});

export const superAdminModelSchema = Joi.object().keys({
    key: Joi.string().required()
    ,description: Joi.string().required()
});
