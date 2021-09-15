import { Boolean } from '../types';

export * from './database';
export * from './env';
export * from './cors';

type initFunc = (() => Promise<Boolean>) | (() => Boolean)

export async function initServices(...func: initFunc []): Promise<void> {
  const promises = func.map(async f => await f());
  const response = (await Promise.all(promises)).every(p => p);
  if(!response) {
    console.error('Server couldn\'t initialize services. Please make sure environment is set as expected.');
    process.exit(100);
  }
}

