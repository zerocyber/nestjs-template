import { Controller, Post, UseGuards, Request, HttpStatus, HttpCode, Get, Res, Sse, MessageEvent, Inject, NotFoundException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { Request as ExpressRequest, Response } from 'express';
import { User } from '@prisma/client';
import { interval, map, Observable } from 'rxjs';
import * as crypto from 'crypto';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/common/providers/redis.provider';

interface RequestWithUser extends ExpressRequest {
  user: Partial<User>;
  session: any;
  sessionID: string;
}

// interface AuthData {
//   status: string;
//   userId?: string;
//   loginKey?: string;
// }

// interface authDataFromAuthServer {
//   authKey: string;
//   userId: string;
// }

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    @Inject(REDIS_CLIENT) private readonly redis: Redis
  ) {}

  /**
   * 일반 세션 로그인
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  getAuthStatus(@Request() req: RequestWithUser) {
    return req.user;
  }

  // /**
  //  * JWT 로그인
  //  */
  // async jwtLogin() {
  //   return {
  //     message: 'JWT 로그인 성공',
  //     status: 200,
  //   };
  // }

  @Post('/logout')
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: RequestWithUser, @Res() res: Response) {
    console.log('=== 로그아웃 전 세션 정보 ===');
    console.log('세션 ID:', req.sessionID);
    console.log('세션 데이터:', req.session);

    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.send('ok');
        console.log('세션이 삭제되었습니다.');
      });
    });
  }

  // @Get('key')
  // async sseAuthKey(): Promise<Object> {

  //   // 1. 외부 API로부터 인증 데이터 받아오기
  //   // TODO: 인증 데이터 interface 필요

  //   // const authData = await fetch('https://api.example.com/auth/key');

  //   // FIXME: 샘플 인증 데이터 - 추후 삭제
  //   const authData: AuthData = {
  //     status: 'PENDING',
  //   };

  //   // 2. redis 캐시에 데이터 저장
  //   const authKey = crypto.randomBytes(32).toString('hex');
  //   await this.redis.set(`auth:${authKey}`, JSON.stringify(authData));

  //   return { authKey };
  // }

  // @Post('key')
  // async updateAuthData(@Request() req: authDataFromAuthServer) {
  //   console.log(req);

  //   const { authKey, userId } = req;

  //   const authData = await this.redis.get(`auth:${authKey}`);
  //   console.log('before update authData', authData);

  //   if (!authData) {
  //     throw new NotFoundException('authData not found');
  //   }

  //   const parsedAuthData = JSON.parse(authData);
  //   parsedAuthData.userId = userId;

  //   this.redis.set(`auth:${authKey}`, JSON.stringify(parsedAuthData));

  //   return {
  //     message: 'authData updated',
  //     status: 200,
  //   };
  // }

  // @Post()
  // async createUser(@Body() input: any): Promise<void> {
  //   // this.client.emit('createUser', input);
  //   // const num = Math.random();
  //   // this.eventEmitter.emit('create-user', num);
  // }

  @Sse('sse-login')
  sseLogin(): Observable<MessageEvent>  {
    return interval(1000) // 1초마다 데이터 전송
    .pipe(
      map((_) => ({ data: { hello: 'world' } }))
    );
  }
}
