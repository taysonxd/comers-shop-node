
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { formatError } from '../utils/responseFormatter';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);
    
  if (err.error instanceof ZodError) {        
    return res.status(400).json(
      formatError({            
        message: 'Validation Error',
        details: err.error.issues,
      }, 400)
    );
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
    
  res.status(status).json(formatError(err, status));
}
