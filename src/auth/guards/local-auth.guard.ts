import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        
        // 중요: 세션에 사용자 정보 저장
        // 하는 일
        //  - req.login() 메서드 호출 (Passport에서 제공)
        //  - serializeUser 함수 호출하여 사용자 객체를 세션에 저장할 수 있는 형태로 직렬화
        //  - 세션에 사용자 ID 저장
        //  - 세션 쿠키 생성 요청 (이 부분이 Set-Cookie 헤더 생성)
        await super.logIn(request);
        
        return result;
      }
}