import { Router } from 'express';
import * as Controller from '../controllers';
import { notFoundHandler } from '../controllers';
import { authRouter } from './auth';
import { contentRouter } from './content';
import { reviewRouter } from './review';
import { favoriteRouter } from './favorite';
import { userRouter } from './user';
import { adminRouter } from './admin';

export const Routes = Router();

Routes.all('/', Controller.rootHandler);

Routes.use('/api/auth', authRouter);
Routes.use('/api/content', contentRouter);
Routes.use('/api/review', reviewRouter);
Routes.use('/api/favorite', favoriteRouter);
Routes.use('/api/user', userRouter);
Routes.use('/api/admin', adminRouter);

Routes.all('*', notFoundHandler);
