import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from "express-validator"

export const validatePlayerModelRules = [
    body('auth').notEmpty().bail().isString(),
    body('conn').notEmpty().bail().isString(),
    body('name').notEmpty().bail().isString(),
    body('rating').notEmpty().bail().isInt(),
    body('totals').notEmpty().bail().isInt(),
    body('wins').notEmpty().bail().isInt(),
    body('goals').notEmpty().bail().isInt(),
    body('assists').notEmpty().bail().isInt(),
    body('ogs').notEmpty().bail().isInt(),
    body('losePoints').notEmpty().bail().isInt(),
    body('passed').notEmpty().bail().isInt(),
    body('mute').notEmpty().bail().isBoolean(),
    body('muteExpire').notEmpty().bail().isInt(),
    body('rejoinCount').notEmpty().bail().isInt(),
    body('joinDate').notEmpty().bail().isInt(),
    body('leftDate').notEmpty().bail().isInt(),
    body('malActCount').notEmpty().bail().isInt()
];

export const validateBanListModelRules = [
    body('conn').notEmpty().bail().isString(),
    body('reason').notEmpty().bail().isString(),
    body('register').notEmpty().bail().isInt(),
    body('expire').notEmpty().bail().isInt(),
];

export const validateSuperAdminModelRules = [
    body('key').notEmpty().bail().isString(),
    body('description').notEmpty().bail().isString()
];

export const checkValidationRules = (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    next();
};