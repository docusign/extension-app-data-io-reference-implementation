/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

const { NODE_ENV, PORT, OAUTH_CLIENT_ID, AUTHORIZATION_CODE, JWT_SECRET_KEY } = process.env;

if (!NODE_ENV) {
  throw new Error('NODE_ENV not set');
}

if (!PORT) {
  throw new Error('PORT not set');
}

if (!OAUTH_CLIENT_ID) {
  throw new Error('OAUTH_CLIENT_ID not set');
}

if (!AUTHORIZATION_CODE) {
  throw new Error('AUTHORIZATION_CODE not set');
}

if (!JWT_SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY not set');
}

export default {
  NODE_ENV,
  PORT,
  OAUTH_CLIENT_ID,
  AUTHORIZATION_CODE,
  JWT_SECRET_KEY,
};
