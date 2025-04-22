import { IReq, IReqQuery, IRes } from '../utils/types';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { AuthorizeQuery, GenerateAuthTokenBody } from '../models/auth';
import env from '../env';
import crypto from 'crypto'; 
import { error } from 'console';

export const authorize = (req: IReqQuery<AuthorizeQuery>, res: IRes) => {
  const {
    query: { redirect_uri: redirectUri, state },
  } = req;

  // Determine the script path dynamically based on the environment
  const scriptPath = '/js/redirect.js'

  return res.render('index.pug', {
    redirectUri,
    code: env.AUTHORIZATION_CODE,
    state,
    scriptPath, // Pass the script path to the Pug template
  });
};

export const generateAuthToken = (req: IReq<GenerateAuthTokenBody>, res: IRes) => {
  const accessToken = jwt.sign({ type: 'access_token', sub: crypto.randomUUID(), email: `${crypto.randomUUID()}@test.com` }, env.JWT_SECRET_KEY, {
    expiresIn: 3600,
  });
  
  const refreshToken = jwt.sign({ type: 'refresh_token' }, env.JWT_SECRET_KEY);

  const jwtResponse = {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: refreshToken,
  };

  if (req.body.grant_type === 'authorization_code' && req.body.code === env.AUTHORIZATION_CODE) {
    return res.json(jwtResponse);
  } else if (req.body.grant_type === 'refresh_token' && req.body.refresh_token) {
    const payload = jwt.verify(req.body.refresh_token, env.JWT_SECRET_KEY) as JwtPayload;
    if (payload.type !== 'refresh_token') {
      throw new Error();
    }
    return res.json(jwtResponse);
  } else if(req.body.grant_type === 'client_credentials') {

    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith('Basic ')){
      throw new Error();
    }

    const base64Credentials = authHeader.split(' ')[1];
    const decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [clientId, clientSecret] = decoded.split(':');

    if(clientId === env.OAUTH_CLIENT_ID && clientSecret === env.OAUTH_CLIENT_SECRET){
      return res.json(jwtResponse);
    } else {
      throw new Error();
    }
  }

  throw new Error(JSON.stringify(req.body));
};

export const getUserInfo = (req: IReq, res: IRes) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error();
  }
  const payload = jwt.verify(token, env.JWT_SECRET_KEY) as JwtPayload;

  if (!payload) {
    throw new Error('Invalid token');
  }

  return res.json({ sub: payload.sub, email: payload.email as string });
};
