import express, { Request, Response, Router, NextFunction } from "express";
import { SuperAdminController } from "../controller/superadmin.controller";
import { SuperAdmin } from "../entity/superadmin.entity";
import { checkValidationRules, validateSuperAdminModelRules  } from "../model/Validator";
import { IRepository } from "../repository/repository.interface";
import { SuperAdminRepository } from "../repository/superadmin.repository";

export const superadminRouter: Router = express.Router({ mergeParams: true });
const superadminRepository: IRepository<SuperAdmin> = new SuperAdminRepository();
const controller: SuperAdminController = new SuperAdminController(superadminRepository);

// /v1/superadmin POST
// register new superadmin key
superadminRouter.post('/', validateSuperAdminModelRules, checkValidationRules, async (request: Request, response: Response, next: NextFunction) => {
    await controller.addSuperAdmin(request, response, next);
});

// /v1/superadmin GET
// get all superadmin data
superadminRouter.get('/', async (request: Request, response: Response, next: NextFunction) => {
    await controller.getAllSuperAdmins(request, response, next);
});

// /v1/superadmin/:key GET
// get the superadmin data (key and description)
superadminRouter.get('/:key', async (request: Request, response: Response, next: NextFunction) => {
    await controller.getSuperAdmin(request, response, next);
});

// /v1/superadmin/:key DELETE
// delete superadmin key
superadminRouter.delete('/:key', async (request: Request, response: Response, next: NextFunction) => {
    await controller.deleteSuperAdmin(request, response, next);
});
