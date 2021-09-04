import { App } from '../types';
import express, { urlencoded } from 'express';
import morgan from 'morgan';

export const weave: App = express();

weave.use(morgan('common'));
weave.use(urlencoded({ extended: true }));
weave.use(express.json());
