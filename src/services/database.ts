import { Boolean } from '../types';
import { createConnection } from 'typeorm';
import { readEnv } from './env';

export async function initDatabase(): Promise<Boolean> {
  console.log('Initialize connection with database');
  try {
    // @ts-ignore
    await createConnection(readEnv().database);
  } catch (e) {
    console.log('Connection couldn\'t be established. Failed with: %s', e);
    return false;
  }
  console.log('Connection established successfully.\n');
  return true;
}
