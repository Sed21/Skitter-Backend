import * as http from 'http';
import { weave } from './weave';
import { Server } from 'http';
import * as service from '../services';
import { initUploadLocation } from '../services';

const server: Server = http.createServer(weave);

service
  .initServices(service.initEnv, service.Database.init, initUploadLocation)
  .then(() => {
    const config = service.readEnv().server;
    server.listen(config.port, config.host, () => {
      console.log(
        `Server is running as ${config.host} on port ${config.port}.`
      );
    });
  })
  .catch(() => {
    console.error('Services couldn\'t initialize correctly. Shutting down ...');
    process.exit(101);
  });
