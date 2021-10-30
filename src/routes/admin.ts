import { Router } from 'express';
import * as Controller from '../controllers';
import { requireRole } from '../middlewares';

export const adminRouter = Router();

adminRouter.delete('/user/delete/:id', requireRole('Admin'), Controller.deleteUserAdminHandler);
adminRouter.get('/user/view', requireRole('Admin'), Controller.viewUserAdminHandler);
adminRouter.delete('/content/delete/:id', requireRole('Admin'), Controller.deleteHandler);
