import { Router } from 'express';

import Paths from '../constants/paths';
import { authorize, generateAuthToken, getUserInfo } from '../services/auth.service';
import { expressjwt as jwt } from 'express-jwt';
import env from '../env';
import { checkSchema } from 'express-validator';
import { authorizeQuery } from '../validationSchemas/auth';
import checkValidationErrors from '../middleware/checkValidationErrors';

const authRouter = Router();

authRouter.get(Paths.Auth.Authorize.Get, checkSchema(authorizeQuery, ['query']), checkValidationErrors, authorize);

authRouter.post(Paths.Auth.Token.Post, generateAuthToken);

authRouter.get(
  Paths.Auth.UserInfo.Get,
  jwt({
    secret: env.JWT_SECRET_KEY,
    algorithms: ['HS256'],
  }),
  getUserInfo,
);

export default authRouter;
