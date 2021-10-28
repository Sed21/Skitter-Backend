import { Router } from 'express';
import * as Controller from '../controllers';
import { Failure } from '../controllers';
import { authRouter } from './auth';
import { contentRouter } from './content';
import { reviewRouter } from './review';

export const Routes = Router();

Routes.all('/', Controller.rootHandler);

Routes.use('/api/auth', authRouter);
Routes.use('/api/content', contentRouter);
Routes.use('/api/review', reviewRouter);

Routes.all('*', Failure.notFound);
