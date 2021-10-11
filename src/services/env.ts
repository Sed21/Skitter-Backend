import { Boolean, Number } from '../types';
import { envObj } from '../types';
import { SecureGen } from '../utils';

// Token duration in seconds
export const tokenDuration: Number = 24 * 60 * 60;

export function initEnv(): Boolean {
  const env = process.env;
  if (!(env.SKITTER_HOST && env.SKITTER_PORT)) {
    console.log('Mandatory server services variables are not defined.');
    return false;
  }
  if (
    !(
      env.POSTGRES_HOST &&
      env.POSTGRES_SCHEMA_NAME &&
      env.POSTGRES_USERNAME &&
      env.POSTGRES_PASSWORD &&
      env.POSTGRES_DATABASE &&
      env.POSTGRES_PORT
    )
  ) {
    console.log('Env services variables are not defined.');
    return false;
  }
  if (!env.JWT_SECRET) {
    console.log('JWT secret not found. Secure random secret has been set.');
    process.env.JWT_SECRET = SecureGen.string(256); // TODO: Maybe it should be stored into database
  }
  return true;
}

export function readEnv(): envObj {
  const env = process.env;
  return {
    database: {
      host: env.POSTGRES_HOST,
      port: env.POSTGRES_PORT,
      user: env.POSTGRES_USERNAME,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DATABASE,
      schemaName: env.POSTGRES_SCHEMA_NAME
    },
    server: {
      host: String(env.SKITTER_HOST),
      port: +String(env.SKITTER_PORT)
    },
    jwtSecret: String(env.JWT_SECRET),
    startWithReset: !!env.START_WITH_RESET,
    sqlDocPath: String(env.POSTGRES_INIT_DOC)
  };
}
