import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) { // 두 번째 파라미터 생략 시 기본값은 local
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // 로그인 id 필드를 email로 설정
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    
    return user;
  }
}
