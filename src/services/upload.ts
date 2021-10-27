import { Options } from 'express-fileupload';
import { Boolean } from '../types';
import * as fs from 'fs';
import { readEnv } from './env';

export const fileUploadOptions: Options = {
  limit: { fileSize: 100 * 1024 }, // MAX 100MB
  createParentPath: false,
  uriDecodeFileNames: undefined,
  safeFileNames: true,
  preserveExtension: undefined,
  abortOnLimit: true,
  responseOnLimit: 'Uploaded file is bigger than expected',
  limitHandler: undefined,
  useTempFiles: true,
  tempFileDir: undefined, // @default '/tmp'
  parseNested: undefined,
  debug: false
};


export function initUploadLocation(): Boolean {
  if(!fs.existsSync(readEnv().savePath)) {
    const path = __dirname + '../../recordings';
    console.log(`Upload location not found. Set default at ${path}. \n`);
    fs.mkdirSync(path);
    process.env.SAVE_PATH = path;
  }
  return true;
}