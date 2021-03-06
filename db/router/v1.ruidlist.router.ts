import { Context } from "koa";
import Router from "koa-router";
import { Player } from '../entity/player.entity';
import { getRepository, Repository } from "typeorm";

interface ruidListItem {
    ruid: string
}

export const ruidlistRouter = new Router();

// Get All exist RUIDs list on DB
ruidlistRouter.get('/', async (ctx: Context) => {
    const repository: Repository<Player> = getRepository(Player);
    await repository
        .createQueryBuilder('Player')
        .select('ruid')
        .distinct(true)
        .getRawMany()
        .then((ruidList: ruidListItem[]) => {
            ctx.status = 200;
            ctx.body = ruidList;
        })
        .catch((error) => {
            ctx.status = 404;
            ctx.body = { error: error.message };
        });
});
