import { Context } from "koa";
import { HeadlessBrowser } from "../../../../lib/browser";
import { BrowserHostRoomInitConfig } from '../../../../lib/browser.hostconfig';
import { nestedHostRoomConfigSchema } from "../../../schema/hostroomconfig.validation";

const browser = HeadlessBrowser.getInstance();

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
    }

    if (!browser.checkExistRoom(newRoomConfig._RUID)) {
        await browser.openNewRoom(newRoomConfig._RUID, newRoomConfig);
        ctx.status = 201;
    } else {
        ctx.status = 409;
    }
}

export async function terminateRoom(ctx: Context) {
    const { ruid } = ctx.params;
    if (browser.checkExistRoom(ruid)) {
        await browser.closeRoom(ruid);
        ctx.status = 204;
    } else {
        ctx.status = 404;
    }
}

export function getRoomList(ctx: Context) {
    const list: string[] = browser.getExistRoomList();
    if (Array.isArray(list) && list.length) {
        ctx.status = 200;
        ctx.body = list;
    } else {
        ctx.status = 404;
    }
}