import { Context } from "koa";
import { generateToken } from "../../../lib/jwt.middleware";
import { IAdminAccount, isCorrectPassword, isExistAdminAccount, loadAdminAccounts, makeHashedPassword } from "../../../model/account";

// export async function register(ctx: Context) { }

export async function login(ctx: Context) {
    const { username, password } = ctx.request.body;

    if (!username || !password) { // if no username or no password
        ctx.status = 401; // Unauthorized Error
        return;
    }

    try {
        const storage: IAdminAccount[] | undefined = await loadAdminAccounts();
        const account: IAdminAccount = {
            accountName: username
            , hashedPassword: await makeHashedPassword(password)
        }

        if (!storage || await !isExistAdminAccount(storage, account) || await !isCorrectPassword(storage, account)) { // if no exist account or wrong password
            ctx.status = 401;
            return;
        }

        const token = generateToken(account.accountName); // create token

        ctx.status = 201;
        ctx.cookies.set('access_token', token, { // and save
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            httpOnly: true,
        });
    } catch (e) {
        ctx.throw(500, e);
    }
};

export async function check(ctx: Context) {
    const { user } = ctx.state;
    if (!user) { // if not loginned
        ctx.status = 401; // Unauthorized
        return;
    }
    ctx.status = 200;
    ctx.body = user;
};

export async function logout(ctx: Context) {
    ctx.cookies.set('access_token');
    ctx.status = 204; // No Content
};
