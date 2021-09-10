import { App } from '../types';
import express, { urlencoded } from 'express';
import morgan from 'morgan';
import { Routes } from '../routes';
import { readEnvironment, initDatabase } from '../utils';

export const weave: App = express();

// Set API services
weave.use(morgan('common'));
weave.use(urlencoded({ extended: true }));
weave.use(express.json());

// Set API routes
weave.use(Routes);

export const configs = readEnvironment();

initDatabase().then(() => (process.env.SKITTER_READY = 'true'));
