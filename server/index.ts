import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as HttpStatus from 'http-status-codes';
import { logger } from './utils/logger';
import { config, container, types } from './config';
import { IRoutableController } from './controllers/routable-controller';

const app: express.Application = express();
app.use(bodyParser.json());

const controllers: IRoutableController[] = container.getAll<IRoutableController>(types.Controller);
controllers.forEach((controller) => {
    app.use(`${config.basePath}/${controller.getRouterPath()}`, controller.getRouter());
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.stack);
    next(err);
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
});

app.listen(config.port, () => {
    logger.info(`Server app is listening on port ${config.port}!`);
});
