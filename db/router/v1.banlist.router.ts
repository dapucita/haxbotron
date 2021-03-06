import Router from "koa-router";
import { Context } from "koa";
import { BanListController } from "../controller/banlist.controller";
import { BanList } from "../entity/banlist.entity";
import { BanListRepository } from "../repository/banlist.repository";
import { IRepository } from "../repository/repository.interface";

export const banlistRouter = new Router();
const banlistRepository: IRepository<BanList> = new BanListRepository();
const controller: BanListController = new BanListController(banlistRepository);

// /v1/banlist GET
// /v1/banlist?start&end GET
// get all banned players list and data
banlistRouter.get('/', async (ctx: Context) => {
    await controller.getAllBannedPlayers(ctx)
});

// /v1/banlist POST
// register new player
banlistRouter.post('/', async (ctx: Context) => {
    await controller.addBanPlayer(ctx)
});

// /v1/banlist/:conn GET
// get the banned player data
banlistRouter.get('/:conn', async (ctx: Context) => {
    await controller.getBannedPlayer(ctx)
});

// /v1/banlist/:conn PUT
// update whole data of the banned player
banlistRouter.put('/:conn', async (ctx: Context) => {
    await controller.updateBannedPlayer(ctx)
});

// /v1/banlist/:conn DELETE
// delete the player from ban list
banlistRouter.delete('/:conn', async (ctx: Context) => {
    await controller.deleteBannedPlayer(ctx)
});
