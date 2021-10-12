import { Response } from 'express';
import { String } from '../types';

export class Failure {
  static badRequest(res: Response, message?: String): Response {
    return res.status(400).json({
      message: `Valid provided information is required.${message ? ` ${message}.` : ''} Please try again.`
    });
  }

  static notFound(res: Response): Response {
    return res.status(404).json({
      message:
        'Endpoint doesn\'t exists. Please, read API docs for more information.'
    });
  }

  static internalServerError(res: Response, message?: String): Response {
    return res.status(500).json({
      message:  `Server couldn't process request.${message ? ` ${message}.` : ''}.`
    });
  }
}
