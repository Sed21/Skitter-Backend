import * as cors from 'cors';

export const corsOptions: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-AUTH-TOKEN',
    'Authorization'
  ],
  methods: [
    'GET',
    'OPTION',
    'POST',
    'PUT',
    'DELETE'
  ],
  credentials: true,
  origin: '*',
  preflightContinue: false
};