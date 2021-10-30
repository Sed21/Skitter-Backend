import { Router } from 'express';
import * as Controller from '../controllers';
import { requireRole } from '../middlewares';

export const favoriteRouter = Router();

favoriteRouter.put('/add/:id', requireRole('Listener', 'Creator', 'Admin'), Controller.addFavoritesHandler);
favoriteRouter.get('/view', requireRole('Listener', 'Creator', 'Admin'), Controller.viewFavoritesHandler);
favoriteRouter.delete('/delete/:id', requireRole('Listener', 'Creator', 'Admin'), Controller.deleteFavoriteHandler);
