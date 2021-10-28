import { Router } from 'express';
import { requireRole } from '../middlewares';
import * as Controller from '../controllers';

export const reviewRouter = Router();

reviewRouter.put('/add/:id', requireRole('Listener', 'Creator', 'Admin'), Controller.addReviewHandler);
reviewRouter.delete('/delete/:id', requireRole('Listener', 'Creator', 'Admin'), Controller.deleteReviewHandler);
