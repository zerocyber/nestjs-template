import { Global, Module } from '@nestjs/common';
import { redisProvider, REDIS_CLIENT } from '../providers/redis.provider';

@Global()
@Module({
  providers: [redisProvider],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}