import { Query } from 'express-serve-static-core';

export interface AuthorizeQuery extends Query {
  redirect_uri: string;
  client_id: string;
  state: string;
}

export type GenerateAuthTokenBody =
  | {
      code?: string;
      grant_type: 'authorization_code';
    }
  | { refresh_token?: string; grant_type: 'refresh_token' };
