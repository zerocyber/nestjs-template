import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseBoolPipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('isDone', new ParseBoolPipe({ optional: true })) isDone: boolean,
  ) {
    return this.todosService.findAll(isDone);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const todo = await this.todosService.findOne(id);
    if (!todo) {
      throw new NotFoundException('조건에 해당하는 내역이 존재하지 않습니다.');
    }
    return todo;
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(id);
  }
}
