import jwt from "jsonwebtoken";
import { Context, Next } from "koa";

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

