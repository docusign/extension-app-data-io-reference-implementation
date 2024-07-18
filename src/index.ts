import './preStart'; // Must be the first import

import env from './env';
import server from './server';

const SERVER_START_MSG = 'Express server started on port: ' + env.PORT.toString();

server.listen(env.PORT, () => console.info(SERVER_START_MSG));
