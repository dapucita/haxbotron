import express, { Request, Response, Router, NextFunction } from "express";
import { BanListController } from "../controller/banlist.controller";
import { BanList } from "../entity/banlist.entity";
import { checkValidationRules, validateBanListModelRules } from "../model/Validator";
import { BanListRepository } from "../repository/banlist.repository";
import { IRepository } from "../repository/repository.interface";

export const banlistRouter: Router = express.Router();
const banlistRepository: IRepository<BanList> = new BanListRepository();
const controller: BanListController = new BanListController(banlistRepository);

// /v1/banlist GET
// get all banned players list and data
banlistRouter.get('/', async (request: Request, response: Response, next: NextFunction) => {
    await controller.getAllBannedPlayers(request, response, next);
});

// /v1/banlist POST
// register new player
banlistRouter.post('/', validateBanListModelRules, checkValidationRules, async (request: Request, response: Response, next: NextFunction) => {
    await controller.addBanPlayer(request, response, next);
});

// /v1/banlist/:conn GET
// get the banned player data
banlistRouter.get('/:conn', async (request: Request, response: Response, next: NextFunction) => {
    await controller.getBannedPlayer(request, response, next);
});

// /v1/banlist/:conn PUT
// update whole data of the banned player
banlistRouter.put('/:conn', validateBanListModelRules, checkValidationRules, async (request: Request, response: Response, next: NextFunction) => {
    await controller.updateBannedPlayer(request, response, next);
});

// /v1/banlist/:conn DELETE
// delete the player from ban list
banlistRouter.delete('/:conn', async (request: Request, response: Response, next: NextFunction) => {
    await controller.deleteBannedPlayer(request, response, next);
});
