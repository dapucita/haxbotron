import express, { Request, Response, Router, NextFunction } from "express";
import { PlayerController } from '../controller/player.controller';
import { IRepository } from '../repository/repository.interface';
import { PlayerRepository } from '../repository/player.repository';
import { Player } from '../entity/player.entity';
import { checkValidationRules, validatePlayerModelRules } from "../model/Validator";

export const playerRouter: Router = express.Router({ mergeParams: true });
const playersRepository: IRepository<Player> = new PlayerRepository();
const controller: PlayerController = new PlayerController(playersRepository);

// /v1/player GET
// get all players list and data
playerRouter.get('/', async (request: Request, response: Response, next: NextFunction) => {
    await controller.getAllPlayers(request, response, next);
});

// /v1/player POST
// register new player
playerRouter.post('/', validatePlayerModelRules, checkValidationRules, async (request: Request, response: Response, next: NextFunction) => {
    await controller.addPlayer(request, response, next);
});

// /v1/player/:auth GET
// get the player data
playerRouter.get('/:auth', async (request: Request, response: Response, next: NextFunction) => {
    await controller.getPlayer(request, response, next);
});

// /v1/player/:auth PUT
// update whole data of the player
playerRouter.put('/:auth', validatePlayerModelRules, checkValidationRules, async (request: Request, response: Response, next: NextFunction) => {
    await controller.updatePlayer(request, response, next);
});

// /v1/player/:auth DELETE
// delete the player
playerRouter.delete('/:auth', async (request: Request, response: Response, next: NextFunction) => {
    await controller.deletePlayer(request, response, next);
});
