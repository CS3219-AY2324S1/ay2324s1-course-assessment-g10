import { Express } from 'express-serve-static-core';
import morgan from 'morgan';

export const setupLogging = (app: Express) => {
    app.use(morgan('combined'));
}

