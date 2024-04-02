import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  constructor(
    private readonly als: AsyncLocalStorage<any>
  ) {}

  use(req: Request, res: Response, next: () => void) {
    this.als.run(new Map(), () => {
      const correlationId = uuidv4();
      req.headers['x-correlation-id'] = correlationId;
      this.als.getStore()?.set('requestBody', req.body);
      this.als.getStore()?.set('correlationId',correlationId);
      next();
    });
  }
}