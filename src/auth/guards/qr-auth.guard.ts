import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class QrAuthGuard extends AuthGuard('qr') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return (await super.canActivate(context)) as boolean;
    } catch (err) {
      throw new UnauthorizedException('유효하지 않은 QR 코드입니다.');
    }
  }
}