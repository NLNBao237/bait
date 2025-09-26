import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodosService } from 'src/modules/todos/services/todo.service';
import { CreateTodoDto, UpdateTodoDto, QueryTodoDto } from 'src/modules/todos/todo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Req() req) {
    const todo = await this.todosService.create(createTodoDto, req.user.sub);
    return todo;
  }

  @Get()
  async findAll(@Query() query: QueryTodoDto, @Req() req) {
    return this.todosService.findAll(query, req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    return this.todosService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @Req() req) {
    return this.todosService.update(id, updateTodoDto, req.user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req) {
    await this.todosService.remove(id, req.user.sub);
    return;
  }
}
