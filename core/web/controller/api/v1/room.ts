import { Context } from "koa";
import { Player } from "../../../../game/model/GameObject/Player";
import { HeadlessBrowser } from "../../../../lib/browser";
import { BrowserHostRoomInitConfig } from '../../../../lib/browser.hostconfig';
import { nestedHostRoomConfigSchema } from "../../../schema/hostroomconfig.validation";

const browser = HeadlessBrowser.getInstance();

/**
 * create new room
 */
export async function createRoom(ctx: Context) {
    const validationResult = nestedHostRoomConfigSchema.validate(ctx.request.body);

    if (validationResult.error) {
        ctx.status = 400;
        ctx.body = validationResult.error;
        return;
    }

    const newRoomConfig: BrowserHostRoomInitConfig = {
        _LaunchDate: new Date()
        ,_RUID: ctx.request.body.ruid
        ,_config: ctx.request.body._config
        ,settings: ctx.request.body.settings
        ,rules: ctx.request.body.rules
        ,HElo: ctx.request.body.helo
    }

    if(newRoomConfig._config.password == "") {
        newRoomConfig._config.password = undefined;
    }

    if (!browser.checkExistRoom(newRoomConfig._RUID)) {
        await browser.openNewRoom(newRoomConfig._RUID, newRoomConfig);
        ctx.status = 201;
    } else {
        ctx.status = 409;
    }
}

/**
 * close the room
 */
export async function terminateRoom(ctx: Context) {
    const { ruid } = ctx.params;
    if (browser.checkExistRoom(ruid)) {
        await browser.closeRoom(ruid);
        ctx.status = 204;
    } else {
        ctx.status = 404;
    }
}

/**
 * get exist room list
 */
export function getRoomList(ctx: Context) {
    const list: string[] = browser.getExistRoomList();
    if (Array.isArray(list) && list.length) {
        ctx.status = 200;
        ctx.body = list;
    } else {
        ctx.status = 404;
    }
}

/**
 * get the room's information
 */
export async function getRoomInfo(ctx: Context) {
    const { ruid } = ctx.params;
    if (browser.checkExistRoom(ruid)) {
        ctx.status = 200;
        ctx.body = await browser.getRoomInfo(ruid);
    } else {
        ctx.status = 404;
    }
}

/**
 * get the room's information
 */
export async function getRoomDetailInfo(ctx: Context) {
    const { ruid } = ctx.params;
    if (browser.checkExistRoom(ruid)) {
        ctx.status = 200;
        ctx.body = await browser.getRoomDetailInfo(ruid);
    } else {
        ctx.status = 404;
    }
}

/**
 * get online player list
 */
export async function getPlayersList(ctx: Context) {
    const { ruid } = ctx.params;
    if (browser.checkExistRoom(ruid)) {
        const list: number[] = await browser.getOnlinePlayersIDList(ruid);
        ctx.body = list;
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
    
}

/**
 * get player's information
 */
export async function getPlayerInfo(ctx: Context) {
    const { ruid, id } = ctx.params;
    ctx.status = 404;
    if (browser.checkExistRoom(ruid)) {
        const player: Player | undefined = await browser.getPlayerInfo(ruid, parseInt(id));
        if(player !== undefined) {
            ctx.body = player;
            ctx.status = 200;
        }
    }
}

/**
 * send broadcast message
 */
export function broadcast(ctx: Context) {
    const { ruid } = ctx.params;
    const message: string | undefined = ctx.request.body.message;
    ctx.status = 404;
    if (browser.checkExistRoom(ruid)) {
        if(message) {
            browser.broadcast(ruid, message);
            ctx.status = 201;
        } else {
            ctx.status = 400;
        }
    }
}
