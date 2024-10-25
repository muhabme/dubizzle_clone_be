import type { NextFunction, Request, Response } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl } = req;
  const logMessage = `[${new Date().toISOString()}] ${method} ${originalUrl}`;

  // eslint-disable-next-line no-console
  console.log(logMessage);

  next();
}
