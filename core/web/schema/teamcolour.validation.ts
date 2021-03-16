import Joi from 'joi';

export const teamColourSchema = Joi.object().keys({
    team: Joi.number().required()
    ,angle: Joi.number().required()
    ,textColour: Joi.number().required()
    ,teamColour1: Joi.number().required()
    ,teamColour2: Joi.number().required()
    ,teamColour3: Joi.number().required()
});
