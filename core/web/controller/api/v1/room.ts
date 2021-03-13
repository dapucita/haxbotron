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
        , _RUID: ctx.request.body.ruid
        , _config: ctx.request.body._config
        , settings: ctx.request.body.settings
        , rules: ctx.request.body.rules
        , HElo: ctx.request.body.helo
        , commands: ctx.request.body.commands
    }

    if (newRoomConfig._config.password == "") {
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
        if (player !== undefined) {
            ctx.body = player;
            ctx.status = 200;
        }
    }
}

/**
 * Kick this player from the room
 */
export async function kickOnlinePlayer(ctx: Context) {
    const { ruid, id } = ctx.params;
    const { ban, seconds, message } = ctx.request.body;
    if (ban === undefined || !seconds || !message) {
        ctx.status = 400; // Unfulfilled error
        return;
    }
    if (browser.checkExistRoom(ruid) && await browser.checkOnlinePlayer(ruid, parseInt(id))) {
        await browser.banPlayerFixedTerm(ruid, parseInt(id), ban, message, seconds);
        ctx.status = 204;
    } else {
        ctx.status = 404;
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
        if (message) {
            browser.broadcast(ruid, message);
            ctx.status = 201;
        } else {
            ctx.status = 400;
        }
    }
}

/**
 * send whisper message
 */
export async function whisper(ctx: Context) {
    const { ruid, id } = ctx.params;
    const message: string | undefined = ctx.request.body.message;
    const playerID: number = parseInt(id)
    ctx.status = 404;
    if (browser.checkExistRoom(ruid) && await browser.checkOnlinePlayer(ruid, playerID)) {
        if (message) {
            browser.whisper(ruid, playerID, message);
            ctx.status = 201;
        } else {
            ctx.status = 400;
        }
    }
}

/**
 * set notice message
 */
export async function setNotice(ctx: Context) {
    const { ruid } = ctx.params;
    const message: string | undefined = ctx.request.body.message;
    ctx.status = 404;
    if (browser.checkExistRoom(ruid)) {
        if (message) {
            browser.setNotice(ruid, message);
            ctx.status = 201;
        } else {
            ctx.status = 400;
        }
    }
}

/**
 * get notice message
 */
export async function getNotice(ctx: Context) {
    const { ruid } = ctx.params;
    ctx.status = 404;
    if (browser.checkExistRoom(ruid)) {
        const message: string | undefined = await browser.getNotice(ruid);
        if (typeof message === 'string') {
            ctx.body = { message: message };
            ctx.status = 200;
        }
    }
}

/**
 * delete notice message
 */
export async function deleteNotice(ctx: Context) {
    const { ruid } = ctx.params;
    ctx.status = 404;
    if (browser.checkExistRoom(ruid)) {
        browser.setNotice(ruid, '');
        ctx.status = 204;
    }
}

/**
 * set room's password
 */
export async function setPassword(ctx: Context) {
    const { ruid } = ctx.params;
    const password: string = ctx.request.body.password;
    ctx.status = 404;

    if (!password) {
        ctx.status = 400; // Unfulfilled error
        return;
    }

    if (browser.checkExistRoom(ruid)) {
        browser.setPassword(ruid, password);
        ctx.status = 201;
    }
}

/**
 * Clear room's password
 */
export async function clearPassword(ctx: Context) {
    const { ruid } = ctx.params;
    ctx.status = 404;

    if (browser.checkExistRoom(ruid)) {
        browser.setPassword(ruid, '');
        ctx.status = 204;
    }
}

/**
 * Get text filtering pool for nickname
 */
export async function getNicknameTextFilteringPool(ctx: Context) {
    const { ruid } = ctx.params;
    ctx.status = 404;
    if (browser.checkExistRoom(ruid)) {
        const pool: string[] = await browser.getNicknameTextFilteringPool(ruid);

        ctx.body = { pool: pool.join('|,|') };
        ctx.status = 200;
    }
}

/**
 * Get text filtering pool for chat messages
 */
export async function getChatTextFilteringPool(ctx: Context) {
    const { ruid } = ctx.params;
    ctx.status = 404;
    if (browser.checkExistRoom(ruid)) {
        const pool: string[] = await browser.getChatTextFilteringPool(ruid);

        ctx.body = { pool: pool.join('|,|') };
        ctx.status = 200;
    }
}

/**
 * Set text filtering pool for nickname
 */
export async function setNicknameTextFilter(ctx: Context) {
    const { ruid } = ctx.params;
    const pool: string = ctx.request.body.pool;
    ctx.status = 404;

    if (!pool) {
        ctx.status = 400; // Unfulfilled error
        return;
    }

    if (browser.checkExistRoom(ruid)) {
        browser.setNicknameTextFilter(ruid, pool.split('|,|'));
        ctx.status = 201;
    }
}

/**
 * Set text filtering pool for chat messages
 */
export async function setChatTextFilter(ctx: Context) {
    const { ruid } = ctx.params;
    const pool: string = ctx.request.body.pool;
    ctx.status = 404;

    if (!pool) {
        ctx.status = 400; // Unfulfilled error
        return;
    }

    if (browser.checkExistRoom(ruid)) {
        browser.setChatTextFilter(ruid, pool.split('|,|'));
        ctx.status = 201;
    }
}

/**
 * Clear text filtering pool for nickname
 */
export async function clearNicknameTextFilter(ctx: Context) {
    const { ruid } = ctx.params;
    ctx.status = 404;

    if (browser.checkExistRoom(ruid)) {
        browser.clearNicknameTextFilter(ruid);
        ctx.status = 204;
    }
}

/**
 * Clear text filtering pool for chat messages
 */
export async function clearChatTextFilter(ctx: Context) {
    const { ruid } = ctx.params;
    ctx.status = 404;

    if (browser.checkExistRoom(ruid)) {
        browser.clearChatTextFilter(ruid);
        ctx.status = 204;
    }
}

/**
 * Check player's mute status
 */
export async function checkPlayerMuted(ctx: Context) {
    const { ruid, id } = ctx.params;
    ctx.status = 404;

    if (browser.checkExistRoom(ruid)) {
        const player: Player | undefined = await browser.getPlayerInfo(ruid, parseInt(id));
        if (player !== undefined) {
            ctx.body = {
                mute: player.permissions.mute
                ,muteExpire: player.permissions.muteExpire
            };
            ctx.status = 200;
        }
    }
}

/**
 * Mute player
 */
export async function mutePlayer(ctx: Context) {
    const { ruid, id } = ctx.params;
    const { muteExpire } = ctx.request.body;
    ctx.status = 404;

    if (!muteExpire) {
        ctx.status = 400; // Unfulfilled error
        return;
    }

    if (browser.checkExistRoom(ruid)) {
        browser.setPlayerMute(ruid, parseInt(id), muteExpire);
        ctx.status = 201;
    }
}

/**
 * Unmute player
 */
export async function unmutePlayer(ctx: Context) {
    const { ruid, id } = ctx.params;
    ctx.status = 404;

    if (browser.checkExistRoom(ruid)) {
        browser.setPlayerUnmute(ruid, parseInt(id));
        ctx.status = 201;
    }
}

/**
 * Check whether the game room's chat is freezed
 */
export async function checkChatFreezed(ctx: Context) {
    const { ruid } = ctx.params;
    ctx.status = 404;

    if (browser.checkExistRoom(ruid)) {
        ctx.body = {
            freezed: await browser.getChatFreeze(ruid)
        }
        ctx.status = 200;
    }
}

/**
 * Freeze whole chat
 */
export async function freezeChat(ctx: Context) {
    const { ruid } = ctx.params;
    ctx.status = 404;

    if (browser.checkExistRoom(ruid)) {
        browser.setChatFreeze(ruid, true);
        ctx.status = 204;
    }
}

/**
 * Unfreeze whole chat
 */
export async function unfreezeChat(ctx: Context) {
    const { ruid } = ctx.params;
    ctx.status = 404;

    if (browser.checkExistRoom(ruid)) {
        browser.setChatFreeze(ruid, false);
        ctx.status = 204;
    }
}