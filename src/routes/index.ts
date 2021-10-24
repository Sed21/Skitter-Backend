import { Router } from 'express';
import * as Controller from '../controllers';
import { Failure } from '../controllers';
import { authRouter } from './auth';

export const Routes = Router();

Routes.all('/', Controller.rootHandler);

Routes.use('/api/auth', authRouter);

Routes.all('*', Failure.notFound);
