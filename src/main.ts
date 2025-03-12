import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
// import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    // 일반적으로 유용한 옵션들
    // 필요한 기능만 부분적으로 주석 해제 후 사용
    // whitelist: true,                // DTO에 없는 속성 제거
    // forbidNonWhitelisted: true,     // DTO에 없는 속성이 있으면 요청 거부
    // transform: true,                // 타입 변환 활성화
    // transformOptions: {
    //   enableImplicitConversion: true // 암시적 타입 변환 허용
    // },
    // dismissDefaultMessages: true,    // 기본 에러 메시지 비활성화
    // validationError: {
    //   target: false,                // 에러 응답에서 대상 객체 제외
    //     value: false, // 에러 응답에서 잘못된 값 제외
    //   },
    }),
  );

  // CORS 설정
  app.enableCors({
    // origin: 'http://localhost:3000', // 프론트엔드 주소
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true, // 쿠키 전송을 위해 필수
  });

  app.setGlobalPrefix('api'); // 모든 요청은 api 프리픽스를 붙여야 함
  
  app.use(cookieParser());
  // session 설정
  app.use(
    session({
      // secret: process.env.SESSION_SECRET || 'DEFAULT_SECRET', // 세션 암호화 키 
      secret: 'DEFAULT_SECRET', // 세션 암호화 키 
      resave: false, // 세션 데이터 저장 여부
      saveUninitialized: false, // 세션 데이터 저장 여부
      name: 'connect.sid', // 세션 쿠키 이름 명시
      cookie: {
        httpOnly: true, // 자바스크립트에서 쿠키 접근 방지
        secure: process.env.NODE_ENV === 'production', // HTTPS 전용 쿠키
        maxAge: 1000 * 60 * 60 * 6, // 쿠키 유효기간: 6시간
        // path: '/',
        // sameSite: 'lax',
      },
    }),
  );

  // 패스포트 설정
  app.use(passport.initialize());
  app.use(passport.session());

  // app.useGlobalInterceptors(new LoggingInterceptor()); // 모든 요청에 대한 로깅 인터셉터 적용
  // app.enableShutdownHooks(); // 서버 종료 시 처리 할 hook 활성화

  await app.listen(process.env.PORT ?? 3080);
}

bootstrap();
