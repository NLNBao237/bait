import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from 'src/modules/todos/todo.schema';
import { TodosService } from 'src/modules/todos/services/todo.service';
import { TodosController } from 'src/modules/todos/controllers/todo.controller';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    UsersModule,
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
