import { getRepository, Repository } from 'typeorm';
import { IRepository } from './repository.interface';
import { Player } from '../entity/player.entity';
import { PlayerModel } from '../model/PlayerModel';

export class PlayerRepository implements IRepository<Player> {
    public async findAll(ruid: string): Promise<Player[]> {
        const repository: Repository<Player> = getRepository(Player);
        let players: Player[] = await repository.find({ ruid: ruid });
        if (players.length === 0) throw new Error('There are no players.');
        return players;
    }

    public async findSingle(ruid: string, auth: string): Promise<Player | undefined> {
        const repository: Repository<Player> = getRepository(Player);
        let player: Player | undefined = await repository.findOne({ ruid: ruid, auth: auth });
        if (player === undefined) throw new Error('Such player is not found.');
        return player;
    }

    public async addSingle(ruid: string, player: PlayerModel): Promise<Player> {
        const repository: Repository<Player> = getRepository(Player);
        let newPlayer: Player | undefined = await repository.findOne({ ruid: ruid, auth: player.auth });
        if (newPlayer === undefined) {
            newPlayer = new Player();
            newPlayer.ruid = ruid;
            newPlayer.auth = player.auth;
            newPlayer.conn = player.conn;
            newPlayer.name = player.name;
            newPlayer.rating = player.rating;
            newPlayer.totals = player.totals;
            newPlayer.disconns = player.disconns;
            newPlayer.wins = player.wins;
            newPlayer.goals = player.goals;
            newPlayer.assists = player.assists;
            newPlayer.ogs = player.ogs;
            newPlayer.losePoints = player.losePoints;
            newPlayer.balltouch = player.balltouch;
            newPlayer.passed = player.passed;
            newPlayer.mute = player.mute;
            newPlayer.muteExpire = player.muteExpire;
            newPlayer.rejoinCount = player.rejoinCount;
            newPlayer.joinDate = player.joinDate;
            newPlayer.leftDate = player.leftDate;
            newPlayer.malActCount = player.malActCount;
        } else {
            throw new Error('Such player is exist already.');
        }
        return await repository.save(newPlayer);
    }

    public async updateSingle(ruid: string, auth: string, player: PlayerModel): Promise<Player> {
        const repository: Repository<Player> = getRepository(Player);
        let newPlayer: Player | undefined = await repository.findOne({ ruid: ruid, auth: auth });
        if (newPlayer !== undefined) {
            newPlayer.ruid = ruid;
            newPlayer.auth = player.auth;
            newPlayer.conn = player.conn;
            newPlayer.name = player.name;
            newPlayer.rating = player.rating;
            newPlayer.totals = player.totals;
            newPlayer.disconns = player.disconns;
            newPlayer.wins = player.wins;
            newPlayer.goals = player.goals;
            newPlayer.assists = player.assists;
            newPlayer.ogs = player.ogs;
            newPlayer.losePoints = player.losePoints;
            newPlayer.balltouch = player.balltouch;
            newPlayer.passed = player.passed;
            newPlayer.mute = player.mute;
            newPlayer.muteExpire = player.muteExpire;
            newPlayer.rejoinCount = player.rejoinCount;
            newPlayer.joinDate = player.joinDate;
            newPlayer.leftDate = player.leftDate;
            newPlayer.malActCount = player.malActCount;
        } else {
            throw new Error('Such player is not found.');
        }
        return await repository.save(newPlayer);
    }

    public async deleteSingle(ruid: string, auth: string): Promise<void> {
        const repository: Repository<Player> = getRepository(Player);
        let player: Player | undefined = await repository.findOne({ ruid: ruid, auth: auth });
        if (player === undefined) {
            throw new Error('Such player is not found.');
        } else {
            await repository.remove(player);
        }
    }
}