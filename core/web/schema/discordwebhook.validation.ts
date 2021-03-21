import Joi from 'joi';

export const discordWebhookConfigSchema = Joi.object().keys({
    feed: Joi.boolean().required()
    ,id: Joi.string().optional().allow(null, '')
    ,token: Joi.string().optional().allow(null, '')
    ,replayUpload: Joi.boolean().required()
});
