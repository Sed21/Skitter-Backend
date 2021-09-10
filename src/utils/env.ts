import { Reason } from './exitcodes';
import { Boolean, String } from '../types';
import { createConnection } from 'typeorm';
import { configs } from '../app/weave';

export function readEnvironment() {
  const env = process.env;
  if (!(env.SKITTER_HOST && env.SKITTER_PORT)) {
    console.error('Mandatory server env variables are not defined.');
    process.exit(Reason.UndefinedENV);
  }

  if (
    !(
      env.TYPEORM_CONNECTION &&
      env.TYPEORM_HOST &&
      env.TYPEORM_USERNAME &&
      env.TYPEORM_PASSWORD &&
      env.TYPEORM_DATABASE &&
      env.TYPEORM_PORT &&
      env.TYPEORM_SYNCHRONIZE &&
      env.TYPEORM_ENTITIES
    )
  ) {
    console.error('Database env variables are not defined.');
    process.exit(Reason.UndefinedENV);
  }

  const databaseConfig = {
    connection: String(env.TYPEORM_CONNECTION),
    host: String(env.TYPEORM_HOST),
    username: String(env.TYPEORM_USERNAME),
    password: String(env.TYPEORM_PASSWORD),
    database: String(env.TYPEORM_DATABASE),
    port: String(env.TYPEORM_PORT),
    synchronize: String(env.TYPEORM_SYNCHRONIZE),
    logging: String(env.TYPEORM_LOGGING),
    entities: String(env.TYPEORM_ENTITIES)
  };

  const serverConfig = {
    host: String(env.SKITTER_HOST),
    port: +String(env.SKITTER_PORT)
  };

  return {
    database: databaseConfig,
    server: serverConfig
  };
}

export async function initDatabase(): Promise<Boolean> {
  console.log('Initialize connection with database');
  try {
    // @ts-ignore
    await createConnection({
      type: configs.database.connection,
      host: configs.database.host,
      port: configs.database.port,
      username: configs.database.username,
      password: configs.database.password,
      database: configs.database.database,
      synchronize: configs.database.synchronize
    });
  } catch (e) {
    console.log('Connection couldn\'t be established. Failed with: %s', e);
    process.exit(Reason.DatabaseFailure);
  }
  console.log('Connection established successfully.\n');
  return true;
}
