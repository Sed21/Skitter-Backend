import * as http from 'http';
import { configs, weave } from './weave';
import { Server } from 'http';

const server: Server = http.createServer(weave);

setTimeout(() => {
  if (process.env.SKITTER_READY) {
    server.listen(configs.server.port, configs.server.host, () => {
      console.log(
        `Server is up and running as ${configs.server.host} on port ${configs.server.port}.`
      );
    });
  }
}, 100);
