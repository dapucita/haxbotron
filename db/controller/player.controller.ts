import { Request, Response, NextFunction } from 'express';
import { IRepository } from '../repository/repository.interface';
import { Player } from '../entity/player.entity';
import { PlayerModel } from '../model/PlayerModel';

export class PlayerController {
    private readonly _repository: IRepository<Player>;

    constructor(repository: IRepository<Player>) {
        this._repository = repository;
    }

    public async getAllPlayers(request: Request, response: Response, next: NextFunction): Promise<any> {
        return this._repository
            .findAll()
            .then((players) => response.status(200).send(players))
            .catch((error) => response.status(404).send({ error: error.message }));
    }

    public async getPlayer(request: Request, response: Response, next: NextFunction): Promise<any> {
        return this._repository
            .findSingle(request.params.auth)
            .then((player) => response.status(200).send(player))
            .catch((error) => response.status(404).send({ error: error.message }));
    }

    public async addPlayer(request: Request, response: Response, next: NextFunction): Promise<any> {
        let playerModel: PlayerModel = request.body;

        return this._repository
            .addSingle(playerModel)
            .then(() => response.status(204).send())
            .catch((error) => response.status(400).send({ error: error.message }));
    }

    public async updatePlayer(request: Request, response: Response, next: NextFunction): Promise<any> {
        let playerModel: PlayerModel = request.body;

        return this._repository
            .updateSingle(request.params.auth, playerModel)
            .then(() => response.status(204).send())
            .catch((error) => response.status(404).send({ error: error.message }));
    }

    public async deletePlayer(request: Request, response: Response, next: NextFunction): Promise<any> {
        return this._repository
            .deleteSingle(request.params.auth)
            .then(() => response.status(204).send())
            .catch((error) => response.status(404).send({ error: error.message }));
    }
}