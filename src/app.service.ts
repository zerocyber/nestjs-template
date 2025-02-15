import { Todo } from '@prisma/client';
import { TodosService } from './todos/todos.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly todosService: TodosService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getTest(isDone: boolean): Promise<Todo[]> {
    return await this.todosService.findAll(isDone);
  }
}
