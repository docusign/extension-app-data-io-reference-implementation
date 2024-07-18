import { Router } from 'express';
import Paths from '../constants/paths';
import authRouter from './auth.controller';
import dataIORouter from './dataio.controller';

const apiRouter = Router();

apiRouter.use(Paths.DataIO.Base, dataIORouter);

apiRouter.use(Paths.Auth.Base, authRouter);

export default apiRouter;
