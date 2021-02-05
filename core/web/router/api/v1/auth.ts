import Router from "koa-router";
import * as authController from '../../../controller/api/v1/auth';

export const authRouter = new Router();

authRouter.get('/', authController.check); // check auth
authRouter.post('/', authController.login); // login
authRouter.delete('/', authController.logout); // logout
