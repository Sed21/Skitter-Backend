import { Number ,Boolean } from '../types';

export function initEnv(): Boolean {
  const env = process.env;
  if (!(env.SKITTER_HOST && env.SKITTER_PORT)) {
    console.log('Mandatory server services variables are not defined.');
    return false;
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
    console.log('Database services variables are not defined.');
    return false;
  }
  return true;
}

type envObject = {
  database: {},
  server: {
    host: String,
    port: Number
  }
}

export function readEnv(): envObject {
  const env = process.env;
  return {
    database: {
      type: env.TYPEORM_CONNECTION,
      host: env.TYPEORM_HOST,
      port: env.TYPEORM_PORT,
      username: env.TYPEORM_USERNAME,
      password: env.TYPEORM_PASSWORD,
      database: env.TYPEORM_DATABASE,
      synchronize: env.TYPEORM_SYNCHRONIZE,
    },
    server: {
      host: String(env.SKITTER_HOST),
      port: +String(env.SKITTER_PORT)
    }
  };
}