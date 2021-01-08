import "reflect-metadata";

import "dotenv/config";

import * as path from "path";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import morgan from "morgan";

import { createConnection } from "typeorm"
import { winstonLogger } from "./utility/winstonLoggerSystem";
import { ResponseError } from "./model/interface/ResponseError";
import { Player } from "./entity/player.entity";
import { playerRouter } from "./router/v1.player.router";
import { banlistRouter } from "./router/v1.banlist.router";
import { BanList } from "./entity/banlist.entity";
import { superadminRouter } from "./router/v1.superadmin.router";
import { SuperAdmin } from "./entity/superadmin.entity";

// START
const app: express.Application = express();

// DB CONNECTION
createConnection({
    type: 'sqlite',
    database: path.join(__dirname, '..', process.env.DB_HOST || 'haxbotron.sqlite.db'),
    entities: [ Player, BanList, SuperAdmin ],
    logging: true,
    synchronize: true
}).then(conn => {
    console.log(`haxbotron-db server is connected with database.`);
}).catch(err => console.log(err));

// Set
app.set('views', path.join(__dirname, '../view'));
app.set('view engine', 'pug');
app.set('port', process.env.SERVER_PORT ? parseInt(JSON.parse(process.env.SERVER_PORT)) : 13001);

// Middlewares
app.use(morgan(process.env.SERVER_LEVEL || 'common'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routers
app.use("/v1/player", playerRouter);
app.use("/v1/banlist", banlistRouter);
app.use("/v1/superadmin", superadminRouter);

// Error Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    //const err: ResponseError =  new Error('Not Found') as ResponseError;
    const err: ResponseError = new Error('Not Found') as ResponseError;
    err.status = 404;
    next(err);
});

app.use((err: ResponseError, req: Request, res: Response) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

// LISTENING
app.listen(app.get('port'), () => {
    console.log(`haxbotron-db server is opened at ${app.get('port')} port.`);
});

export default app;