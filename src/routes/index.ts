import { Router } from 'express';
import * as Controller from '../controller';
import { Failure } from '../controller';
import { authRouter } from './auth';

export const Routes = Router();

Routes.all('/', Controller.rootHandler);

Routes.use('/api/auth', authRouter);

Routes.all('*', Failure.notFound);
