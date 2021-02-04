import express, { Request, Response, Router, NextFunction } from "express";
import { Player } from '../entity/player.entity';
import { getRepository, Repository } from "typeorm";

interface ruidListItem {
    ruid: string
}

export const ruidlistRouter: Router = express.Router({ mergeParams: true });

// Get All exist RUIDs list on DB
ruidlistRouter.get('/', async (request: Request, response: Response, next: NextFunction) => {
    //await controller.getAllPlayers(request, response, next);
    const repository: Repository<Player> = getRepository(Player);
    await repository
        .createQueryBuilder('Player')
        .select('ruid')
        .distinct(true)
        .getRawMany()
        .then((ruidList: ruidListItem[]) => response.status(200).send(ruidList))
        .catch((error) => response.status(404).send({ error: error.message }));
});
