import { Controller, Get, Param, ParseBoolPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('root')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  getTest(
    @Query('isDone', new ParseBoolPipe({ optional: true })) isDone: boolean,
  ) {
    return this.appService.getTest(isDone);
  }
  @Get(':name')
  getHello(@Param('name') name: string): string {
    return this.appService.getHello() + name;
  }
}
