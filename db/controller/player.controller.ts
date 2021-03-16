import { Context } from "koa";
import { IRepository } from '../repository/repository.interface';
import { Player } from '../entity/player.entity';
import { PlayerModel } from '../model/PlayerModel';
import { playerModelSchema } from "../model/Validator";

export class PlayerController {
    private readonly _repository: IRepository<Player>;

    constructor(repository: IRepository<Player>) {
        this._repository = repository;
    }

    public async getAllPlayers(ctx: Context) {
        const { ruid } = ctx.params;
        const { start, count } = ctx.request.query;

        if (start && count) {
            return this._repository
                .findAll(ruid, { start: parseInt(<string>start), count: parseInt(<string>count) })
                .then((players) => {
                    ctx.status = 200;
                    ctx.body = players;
                })
                .catch((error) => {
                    ctx.status = 404;
                    ctx.body = { error: error.message };
                });
        } else {
            return this._repository
                .findAll(ruid)
                .then((players) => {
                    ctx.status = 200;
                    ctx.body = players;
                })
                .catch((error) => {
                    ctx.status = 404;
                    ctx.body = { error: error.message };
                });
        }
    }

    public async getPlayer(ctx: Context) {
        const { ruid, auth } = ctx.params;

        return this._repository
            .findSingle(ruid, auth)
            .then((player) => {
                ctx.status = 200;
                ctx.body = player;
            })
            .catch((error) => {
                ctx.status = 404;
                ctx.body = { error: error.message };
            });
    }

    public async addPlayer(ctx: Context) {
        const validationResult = playerModelSchema.validate(ctx.request.body);

        if (validationResult.error) {
            ctx.status = 400;
            ctx.body = validationResult.error;
            return;
        }

        const { ruid } = ctx.params;
        const playerModel: PlayerModel = ctx.request.body;

        return this._repository
            .addSingle(ruid, playerModel)
            .then(() => {
                ctx.status = 204;
            })
            .catch((error) => {
                ctx.status = 400;
                ctx.body = { error: error.message };
            });
    }

    public async updatePlayer(ctx: Context) {
        const validationResult = playerModelSchema.validate(ctx.request.body);

        if (validationResult.error) {
            ctx.status = 400;
            ctx.body = validationResult.error;
            return;
        }

        const { ruid, auth } = ctx.params;
        const playerModel: PlayerModel = ctx.request.body;

        return this._repository
            .updateSingle(ruid, auth, playerModel)
            .then(() => {
                ctx.status = 204;
            })
            .catch((error) => {
                ctx.status = 404;
                ctx.body = { error: error.message };
            });
    }

    public async deletePlayer(ctx: Context) {
        const { ruid, auth } = ctx.params;

        return this._repository
            .deleteSingle(ruid, auth)
            .then(() => {
                ctx.status = 204;
            })
            .catch((error) => {
                ctx.status = 404;
                ctx.body = { error: error.message };
            });
    }
}