import "reflect-metadata";

import "dotenv/config";

import * as path from "path";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import morgan from "morgan";
import { IpDeniedError, IpFilter } from "express-ipfilter";

import { createConnection } from "typeorm"
import { winstonLogger } from "./utility/winstonLoggerSystem";
import { ResponseError } from "./model/interface/ResponseError";
import { Player } from "./entity/player.entity";
import { BanList } from "./entity/banlist.entity";
import { SuperAdmin } from "./entity/superadmin.entity";
import { apiRouterV1 } from "./router/v1.api.router";

// START
winstonLogger.info(`haxbotron-db server is launched at ${new Date().toLocaleString()}`);

const app: express.Application = express();

const whiteListIPs: string[] = process.env.SERVER_WHITELIST_IP?.split(",") || ['127.0.0.1'];

// DB CONNECTION
createConnection({
    type: 'sqlite',
    database: path.join(__dirname, '..', process.env.DB_HOST || 'haxbotron.sqlite.db'),
    entities: [ Player, BanList, SuperAdmin ],
    logging: true,
    synchronize: true
}).then(conn => {
    winstonLogger.info(`haxbotron-db server is connected with database.`);
}).catch(err => console.log(err));

// Set
app.set('views', path.join(__dirname, '../view'));
app.set('view engine', 'pug');
app.set('port', process.env.SERVER_PORT ? parseInt(JSON.parse(process.env.SERVER_PORT)) : 13001);

// Middlewares
app.use(IpFilter(whiteListIPs, { mode: 'allow' }));
app.use(morgan(process.env.SERVER_LEVEL || 'common'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routerss
app.use("/api/v1", apiRouterV1);

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

    if (err instanceof IpDeniedError) {
        res.status(401);
    } else {
        res.status(err.status || 500);
    }

    res.render('error');
});

// LISTENING
app.listen(app.get('port'), () => {
    //const _GitHublastestRelease = await axios.get('https://api.github.com/repos/dapucita/haxbotron/releases/latest');
    console.log("_|    _|                      _|                    _|                                  "+"\n"+
                "_|    _|    _|_|_|  _|    _|  _|_|_|      _|_|    _|_|_|_|  _|  _|_|    _|_|    _|_|_|  "+"\n"+
                "_|_|_|_|  _|    _|    _|_|    _|    _|  _|    _|    _|      _|_|      _|    _|  _|    _|"+"\n"+
                "_|    _|  _|    _|  _|    _|  _|    _|  _|    _|    _|      _|        _|    _|  _|    _|"+"\n"+
                "_|    _|    _|_|_|  _|    _|  _|_|_|      _|_|        _|_|  _|          _|_|    _|    _|");
    //console.log(`Lastest Version : ${_GitHublastestRelease.data.tag_name} | Current Version : v${process.env.npm_package_version}`);
    console.log(`Haxbotron by dapucita (Visit our GitHub : https://github.com/dapucita/haxbotron)`);
    winstonLogger.info(`[db] Haxbotron DB server is opened at ${app.get('port')} port.`);
    winstonLogger.info(`[db] IP Whitelist : ${whiteListIPs}`);
});

export default app;
