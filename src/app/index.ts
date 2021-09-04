import * as http from 'http';
import { weave } from './weave';
import { Server } from 'http';

const server: Server = http.createServer(weave);

server.listen(8080, 'localhost', () => {
  console.log('Server is running');
});