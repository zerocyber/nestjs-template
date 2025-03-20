import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../common/providers/redis.provider';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(
        private readonly userService: UserService, 
        @Inject(REDIS_CLIENT) private readonly redis: Redis
    ) {
        super();
    }
    
    serializeUser(user: User, done: (err: any, id?: number) => void): void {
        done(null, user.id);
    }

    async deserializeUser(userId: number, done: (err: any, user?: any) => void): Promise<void> {
        try {
            // 캐시에 조회된 유저 데이터가 리턴
            const cacheUser = await this.redis.get(`user:${userId}`);
            if (cacheUser) {
                return done(null, JSON.parse(cacheUser));
            }

            // DB에서 유저 데이터 조회
            const user = await this.userService.findOne(userId);
            if (!user) {
                return done(new Error('User not found'));
            }

            // 패스워드 데이터는 제거
            const { password, ...userWithoutPassword } = user;

            // 캐시에 유저 데이터 저장
            await this.redis.set(`user:${userId}`, JSON.stringify(userWithoutPassword));

            done(null, userWithoutPassword);
        } catch (err) {
            done(err);
        }
    }
}
