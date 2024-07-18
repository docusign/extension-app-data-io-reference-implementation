import { Schema } from 'express-validator';
import env from '../env';

export const authorizeQuery: Schema = {
  redirect_uri: { trim: true, isURL: true },
  client_id: { trim: true, equals: { options: env.OAUTH_CLIENT_ID } },
  state: { trim: true, isString: true },
};

export const generateAuthTokenBody: Schema = {
  grant_type: { isIn: { options: [['authorization_code', 'refresh_token']] } },
};
