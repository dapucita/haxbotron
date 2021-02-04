import Router from "koa-router";
import * as ruidlistController from '../../../controller/api/v1/ruidlist';
import { checkLoginMiddleware } from "../../../lib/logincheck.middleware";

export const ruidlistRouter = new Router();

ruidlistRouter.get('/', checkLoginMiddleware, ruidlistController.getAllList); // get all exist RUIDs list on DB server
