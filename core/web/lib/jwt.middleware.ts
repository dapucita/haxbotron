import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";
import { Socket } from "socket.io";
import { Context, Next } from "koa";

/**
 * JWT validation middleware for Socket.IO Websocket
 */
export async function jwtMiddlewareWS(socket: Socket, next: any) {
    const cookie = socket.request.headers.cookie
    if (socket.request.headers.cookie) { // when http-only cookie exists
        const token = parseCookie(cookie!);
        if (!token['access_token']) socket.disconnect(); // disconnect when no token
        try {
            const decoded = jwt.verify(token['access_token'], (process.env.JWT_SECRET || "haxbotron-core-jwt-secret"));
            //console.log('verified username : ' + (<any>decoded).username);
            return next();
        } catch (e) { // disconnect when failed to validate token
            socket.disconnect();
        }
    }
}

/**
 * JWT validation middleware for Koa
 */
export async function jwtMiddleware(ctx: Context, next: Next) {
    const token = ctx.cookies.get('access_token');
    if (!token) return next(); // when no token
    try {
        const decoded = jwt.verify(token, (process.env.JWT_SECRET || "haxbotron-core-jwt-secret"));
        ctx.state.user = {
            username: (<any>decoded).username
        };

        return next();
    } catch (e) { // when failed to validate token
        return next();
    }
};

/**
 * Generate new JWT token.
 */
export function generateToken(username: string): string {
    const token = jwt.sign(
        { username: username } // payloads
        ,(process.env.JWT_SECRET || "haxbotron-core-jwt-secret") // secret key
        ,{ expiresIn: "7d" } // options
    );
    return token;
}

