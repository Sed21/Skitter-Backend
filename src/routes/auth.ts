import { Router } from 'express';
import * as Controller from '../controllers';
import { requireRole } from '../middlewares';

export const authRouter = Router();

authRouter.put('/signup', Controller.signUpHandler);
authRouter.post('/signin', Controller.signInHandler);
authRouter.delete('/signout', Controller.signOutHandler);
authRouter.post('/check', requireRole('Listener', 'Creator', 'Admin'), Controller.checkTokenHandler);
