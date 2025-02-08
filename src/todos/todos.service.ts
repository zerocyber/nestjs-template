import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

import { PrismaService } from '../prisma.service';
import { Todo } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private prismaService: PrismaService) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    console.log('createTodoDto info', createTodoDto);
    return this.prismaService.todo.create({
      data: {
        title: createTodoDto.title,
        isDone: createTodoDto.isDone,
        memo: createTodoDto.memo,
      },
    });
  }

  async findAll(isDone: boolean): Promise<Todo[]> {
    return this.prismaService.todo.findMany({
      where: { isDone },
    });
  }

  async findOne(id: number): Promise<Todo | null> {
    return this.prismaService.todo.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return this.prismaService.todo.update({
      where: { id },
      data: {
        title: updateTodoDto.title,
        memo: updateTodoDto.memo,
        isDone: updateTodoDto.isDone,
      },
    });
  }

  async remove(id: number): Promise<Todo> {
    return this.prismaService.todo.delete({
      where: { id },
    });
  }
}
