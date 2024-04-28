import { Module, Global } from '@nestjs/common';
import { Redis } from 'ioredis';
import { DebounceInterceptor } from 'src/redis/interceptors/debounce.interceptor';

const redis = new Redis({
  host: 'localhost',
  port: 6379
});

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useValue: redis,
    },
    DebounceInterceptor
  ],
  exports: ['REDIS',DebounceInterceptor],
})
export class RedisModule {}
