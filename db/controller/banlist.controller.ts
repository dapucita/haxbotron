import { Request, Response, NextFunction } from 'express';
import { IRepository } from '../repository/repository.interface';
import { BanList } from '../entity/banlist.entity';
import { BanListModel } from '../model/BanListModel';

export class BanListController {
    private readonly _repository: IRepository<BanList>;

    constructor(repository: IRepository<BanList>) {
        this._repository = repository;
    }

    public async getAllBannedPlayers(request: Request, response: Response, next: NextFunction): Promise<any> {
        if(request.query?.start && request.query?.count) {
            return this._repository
                .findAll(request.params.ruid, {start: parseInt(<string>request.query.start), count: parseInt(<string>request.query.count)})
                .then((players) => response.status(200).send(players))
                .catch((error) => response.status(404).send({ error: error.message }));
        } else {
            return this._repository
                .findAll(request.params.ruid)
                .then((players) => response.status(200).send(players))
                .catch((error) => response.status(404).send({ error: error.message }));
        }
    }

    public async getBannedPlayer(request: Request, response: Response, next: NextFunction): Promise<any> {
        return this._repository
            .findSingle(request.params.ruid, request.params.conn)
            .then((player) => response.status(200).send(player))
            .catch((error) => response.status(404).send({ error: error.message }));
    }

    public async addBanPlayer(request: Request, response: Response, next: NextFunction): Promise<any> {
        let banlistModel: BanListModel = request.body;

        return this._repository
            .addSingle(request.params.ruid, banlistModel)
            .then(() => response.status(204).send())
            .catch((error) => response.status(400).send({ error: error.message }));
    }

    public async updateBannedPlayer(request: Request, response: Response, next: NextFunction): Promise<any> {
        let banlistModel: BanListModel = request.body;

        return this._repository
            .updateSingle(request.params.ruid, request.params.conn, banlistModel)
            .then(() => response.status(204).send())
            .catch((error) => response.status(404).send({ error: error.message }));
    }

    public async deleteBannedPlayer(request: Request, response: Response, next: NextFunction): Promise<any> {
        return this._repository
            .deleteSingle(request.params.ruid, request.params.conn)
            .then(() => response.status(204).send())
            .catch((error) => response.status(404).send({ error: error.message }));
    }
}