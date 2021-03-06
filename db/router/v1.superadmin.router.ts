import Router from "koa-router";
import { Context } from "koa";
import { SuperAdminController } from "../controller/superadmin.controller";
import { SuperAdmin } from "../entity/superadmin.entity";
import { IRepository } from "../repository/repository.interface";
import { SuperAdminRepository } from "../repository/superadmin.repository";

export const superadminRouter = new Router();
const superadminRepository: IRepository<SuperAdmin> = new SuperAdminRepository();
const controller: SuperAdminController = new SuperAdminController(superadminRepository);

// /v1/superadmin POST
// register new superadmin key
superadminRouter.post('/', async (ctx: Context) => {
    await controller.addSuperAdmin(ctx)
});

// /v1/superadmin GET
// get all superadmin data
superadminRouter.get('/', async (ctx: Context) => {
    await controller.getAllSuperAdmins(ctx)
});

// /v1/superadmin/:key GET
// get the superadmin data (key and description)
superadminRouter.get('/:key', async (ctx: Context) => {
    await controller.getSuperAdmin(ctx)
});

// /v1/superadmin/:key DELETE
// delete superadmin key
superadminRouter.delete('/:key', async (ctx: Context) => {
    await controller.deleteSuperAdmin(ctx)
});
