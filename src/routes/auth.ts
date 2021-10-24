import { Router } from 'express';
import * as Controller from '../controllers';

export const authRouter = Router();

authRouter.put('/signup', Controller.signUpHandler);
authRouter.post('/signin', Controller.signInHandler);
authRouter.delete('/signout', Controller.signOutHandler);
