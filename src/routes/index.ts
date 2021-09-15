import { Router } from 'express';
import * as Controller from '../controller';

export const Routes = Router();

Routes.all('/', Controller.rootHandler);

Routes.all('*', Controller.notFound);
