import { getRepository, Repository } from 'typeorm';
import { IRepository } from './repository.interface';
import { BanList } from '../entity/banlist.entity';
import { BanListModel } from '../model/BanListModel';

export class BanListRepository implements IRepository<BanList> {
    public async findAll(): Promise<BanList[]> {
        const repository: Repository<BanList> = getRepository(BanList);
        let banlist: BanList[] = await repository.find();
        if (banlist.length === 0) throw new Error('There are no banned players.');
        return banlist;
    }

    public async findSingle(conn: string): Promise<BanList | undefined> {
        const repository: Repository<BanList> = getRepository(BanList);
        let banPlayer: BanList | undefined = await repository.findOne({ conn: conn });
        if (banPlayer === undefined) throw new Error('Such player is not banned.');
        return banPlayer;
    }

    public async addSingle(banlist: BanListModel): Promise<BanList> {
        const repository: Repository<BanList> = getRepository(BanList);
        let newBan: BanList | undefined = await repository.findOne({ conn: banlist.conn });
        if (newBan === undefined) {
            newBan = new BanList();
            newBan.conn = banlist.conn;
            newBan.reason = banlist.reason;
            newBan.register = banlist.register;
            newBan.expire = banlist.expire;
        } else {
            throw new Error('Such player is already banned.');
        }
        return await repository.save(newBan);
    }

    public async updateSingle(conn: string, banlist: BanListModel): Promise<BanList> {
        const repository: Repository<BanList> = getRepository(BanList);
        let newBan: BanList | undefined = await repository.findOne({ conn: conn });
        if (newBan !== undefined) {
            newBan.conn = banlist.conn;
            newBan.reason = banlist.reason;
            newBan.register = banlist.register;
            newBan.expire = banlist.expire;
        } else {
            throw new Error('Such player is not banned yet.');
        }
        return await repository.save(newBan);
    }

    public async deleteSingle(conn: string): Promise<void> {
        const repository: Repository<BanList> = getRepository(BanList);
        let banPlayer: BanList | undefined = await repository.findOne({ conn: conn });
        if (banPlayer === undefined) {
            throw new Error('Such player is not banned yet.');
        } else {
            await repository.remove(banPlayer);
        }
    }
}
