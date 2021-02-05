import jwt from "jsonwebtoken";
import { Context, Next } from "koa";

export async function checkLoginMiddleware(ctx: Context, next: Next) {
    if (!ctx.state.user) { // if not loginned
        ctx.status = 401; // Return Unauthorized Error
        return;
    }
    return next();
};