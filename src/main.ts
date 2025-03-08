import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
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

  app.setGlobalPrefix('api'); // 모든 요청은 api 프리픽스를 붙여야 함

  // app.useGlobalInterceptors(new LoggingInterceptor()); // 모든 요청에 대한 로깅 인터셉터 적용
  // app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3080);
}

bootstrap();
