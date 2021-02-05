import Router from "koa-router";
import * as superadminController from '../../../controller/api/v1/superadmin';
import { checkLoginMiddleware } from "../../../lib/logincheck.middleware";

export const superadminRouter = new Router();

superadminRouter.get('/:ruid', checkLoginMiddleware, superadminController.getAllList); // get all superadmin key, description list
superadminRouter.post('/:ruid', checkLoginMiddleware, superadminController.registerKey); // register new superadmin key
superadminRouter.delete('/:ruid/:key', checkLoginMiddleware, superadminController.deleteKey); // delete superadmin key