import { Router } from 'express';
import { requireRole } from '../middlewares';
import * as Controller from '../controllers';

export const contentRouter = Router();

contentRouter.get('/view', requireRole('Listener', 'Creator', 'Admin'), Controller.viewHandler);
contentRouter.get('/audio/:id', requireRole('Listener', 'Creator', 'Admin'), Controller.audioHandler);
contentRouter.put('/upload', requireRole('Creator', 'Admin'), Controller.uploadHandler);
contentRouter.delete('/delete', requireRole('Creator', 'Admin'), Controller.deleteHandler);
