import { Controller, Post, UseGuards, Request, HttpStatus, HttpCode, Get, Res, Sse, MessageEvent, Inject, NotFoundException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { Request as ExpressRequest, Response } from 'express';
import { User } from '@prisma/client';
import { fromEvent, interval, map, Observable } from 'rxjs';
import * as crypto from 'crypto';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/common/providers/redis.provider';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBody, ApiParam } from '@nestjs/swagger';

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
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly eventEmitter: EventEmitter2,
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

  // @Get('token')
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

  /**
   * 인증이 완료 시 인증서버로부터 호출 되는 API
   */
  @ApiBody({
    schema: {
      type: 'json',
      example: {
        userId: 1,
      },
    },
  })
  @Post('notify-auth-result')
  async addEvent(@Body() input: any): Promise<void> {
    const userId = input.userId;
    const loginKey = 'test-login-key';
    
    this.eventEmitter.emit('receive-auth-data', 
      { userId, loginKey, status: 'SUCCESS' });

    // 로그인 key 생성
  }

  /**
   * 클라이언트에서 sse 연결 요청 - 로그인 페이지
   */
  @Sse('sse')
  sseLogin(): Observable<MessageEvent>  {

    // TODO: timeout 설정
    
    return fromEvent(this.eventEmitter, 'receive-auth-data')
    .pipe(
      map((data: any) => ({ data: { 
        userId: data.userId, 
        loginKey: data.loginKey,
        status: data.status,
      } }))
    );

  }
}
