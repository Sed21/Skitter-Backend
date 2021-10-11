import { Router } from 'express';
import * as Controller from '../controller';

export const authRouter = Router();

authRouter.post('/signup', Controller.signUpHandler);