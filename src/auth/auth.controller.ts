import { Controller, Post, UseGuards, Request, HttpStatus, HttpCode, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { Request as ExpressRequest, Response } from 'express';
import { User } from '@prisma/client';

interface RequestWithUser extends ExpressRequest {
  user: Partial<User>;
  session: any;
  sessionID: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
