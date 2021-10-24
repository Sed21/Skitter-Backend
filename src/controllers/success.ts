import { Response } from 'express';

export class Success {
  static Ok(res: Response, body?: {}): Response {
    if (body) {
      return res.status(200).json(body);
    } else {
      return res.sendStatus(200);
    }
  }

  static Created(res: Response, body?: {}): Response {
    if (body) {
      return res.status(201).json(body);
    } else {
      return res.sendStatus(201);
    }
  }
}
