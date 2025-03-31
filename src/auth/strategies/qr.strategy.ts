import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import Redis from 'ioredis';
import { UserService } from 'src/user/user.service';
import { REDIS_CLIENT } from 'src/common/providers/redis.provider';

@Injectable()
export class QrStrategy extends PassportStrategy(Strategy, 'qr') {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly userService: UserService,
  ) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const key = req.query.key as string;
    if (!key) {
      throw new UnauthorizedException('QR 코드가 필요합니다.');
    }

    const userId = await this.redis.get(`qr:${key}`);
    if (!userId) {
      throw new UnauthorizedException('만료되었거나 유효하지 않은 QR 코드입니다.');
    }

    // 키 즉시 삭제 (1회성 보장)
    await this.redis.del(`qr:${key}`);

    const user = await this.userService.findOne(parseInt(userId));
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }
}