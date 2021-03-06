import { Context } from "koa";
import { SuperAdmin } from '../entity/superadmin.entity';
import { SuperAdminModel } from '../model/SuperAdminModel';
import { superAdminModelSchema } from "../model/Validator";
import { IRepository } from '../repository/repository.interface';

export class SuperAdminController {
    private readonly _repository: IRepository<SuperAdmin>;

    constructor(repository: IRepository<SuperAdmin>) {
        this._repository = repository;
    }

    public async getAllSuperAdmins(ctx: Context) {
        const { ruid } = ctx.params;
        const { start, count } = ctx.request.query;

        if(start && count) {
            return this._repository
                .findAll(ruid, {start: parseInt(<string>start), count: parseInt(<string>count)})
                .then((superadmins) => {
                    ctx.status = 200;
                    ctx.body = superadmins;
                })
                .catch((error) => {
                    ctx.status = 404;
                    ctx.body = { error: error.message };
                });
        } else {
            return this._repository
                .findAll(ruid)
                .then((superadmins) => {
                    ctx.status = 200;
                    ctx.body = superadmins;
                })
                .catch((error) => {
                    ctx.status = 404;
                    ctx.body = { error: error.message };
                });
        }
    }

    public async getSuperAdmin(ctx: Context) {
        const { ruid, key } = ctx.params;

        return this._repository
            .findSingle(ruid, key)
            .then((superadmins) => {
                ctx.status = 200;
                ctx.body = superadmins;
            })
            .catch((error) => {
                ctx.status = 404;
                ctx.body = { error: error.message };
            });
    }

    public async addSuperAdmin(ctx: Context) {
        const validationResult = superAdminModelSchema.validate(ctx.request.body);

        if (validationResult.error) {
            ctx.status = 400;
            ctx.body = validationResult.error;
            return;
        }

        const { ruid } = ctx.params;
        const superAdminModel: SuperAdminModel = ctx.request.body;

        return this._repository
            .addSingle(ruid, superAdminModel)
            .then(() => {
                ctx.status = 204;
            })
            .catch((error) => {
                ctx.status = 400;
                ctx.body = { error: error.message };
            });
    }

    public async updateSuperAdmin(ctx: Context) {
        const validationResult = superAdminModelSchema.validate(ctx.request.body);

        if (validationResult.error) {
            ctx.status = 400;
            ctx.body = validationResult.error;
            return;
        }

        const { ruid, key } = ctx.params;
        const superAdminModel: SuperAdminModel = ctx.request.body;

        return this._repository
            .updateSingle(ruid, key, superAdminModel)
            .then(() => {
                ctx.status = 204;
            })
            .catch((error) => {
                ctx.status = 404;
                ctx.body = { error: error.message };
            });
    }

    public async deleteSuperAdmin(ctx: Context) {
        const { ruid, key } = ctx.params;

        return this._repository
            .deleteSingle(ruid, key)
            .then(() => {
                ctx.status = 204;
            })
            .catch((error) => {
                ctx.status = 404;
                ctx.body = { error: error.message };
            });
    }
}