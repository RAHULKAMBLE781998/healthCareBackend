import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { catchError } from "rxjs";

@Injectable()
export class DebounceInterceptor implements NestInterceptor {

  constructor(@Inject('REDIS') private redis) { }

  async intercept(context: ExecutionContext, next: CallHandler) {

    const req = context.switchToHttp().getRequest();

    const key = `debounce:${req.path}:${req.headers.authorization}`;

    const isDebounced = await this.redis.get(key);

    if (isDebounced) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    await this.redis.set(key, '1', 'EX', 5); // debounce for 10 seconds

    return next.handle().pipe(
      catchError(error => {
        this.redis.del(key);
        throw error;
      })
    );

  }

}
