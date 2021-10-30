import { Router } from 'express';
import { requireRole } from '../middlewares';
import * as Controller from '../controllers';

export const userRouter = Router();

userRouter.get('/view/:id', requireRole('Listener', 'Creator', 'Admin'), Controller.viewUserHandler);
userRouter.put('/change', requireRole('Listener', 'Creator', 'Admin'), Controller.userChangeHandler);
userRouter.delete('/delete', requireRole('Listener', 'Creator', 'Admin'), Controller.deleteUserHandler);
