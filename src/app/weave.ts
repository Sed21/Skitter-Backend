import { App } from '../types';
import express, { urlencoded } from 'express';
import morgan from 'morgan';
import { Routes } from '../routes';
import cors from 'cors';
import { corsOptions } from '../services';

export const weave: App = express();

// Set API services
weave.use(morgan('common'));
weave.use(urlencoded({ extended: true }));
weave.use(express.json());
weave.use(cors(corsOptions));

// Set API routes
weave.use(Routes);
