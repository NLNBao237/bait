import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Todo, TodoDocument } from 'src/modules/todos/todo.schema';
import { User, UserDocument } from 'src/modules/users/user.schema';
import { TodoStatus } from 'src/enums/todo-status.enum';
import { CreateTodoDto, UpdateTodoDto, QueryTodoDto } from 'src/modules/todos/todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    const created = new this.todoModel({ ...createTodoDto, user: userId });
    const todo = await created.save();
    // 2. Thêm todo vào mảng todos của user
    await this.userModel.findByIdAndUpdate(userId, { $push: { todos: todo._id } });
    return todo;
  }

  async findAll(query: QueryTodoDto, userId: string) {
    const filter: FilterQuery<TodoDocument> = { user: userId };
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { content: { $regex: query.search, $options: 'i' } },
      ];
    }
    const limit = query.limit ?? 5;
    const offset = query.offset ?? 0;
    const [items, total] = await Promise.all([
      this.todoModel
        .find(filter)
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.todoModel.countDocuments(filter),
    ]);
    return {
      statusCode: 200,
      data: {
        items,
        meta: {
          limit,
          offset,
          total,
          totalPages: Math.ceil(total / limit) || null,
        },
      },
    };
  }

  async findOne(id: string, userId: string): Promise<Todo> {
    const todo = await this.todoModel.findOne({ _id: id, user: userId });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId: string): Promise<Todo> {
    const todo = await this.todoModel.findOneAndUpdate(
      { _id: id, user: userId }, 
      updateTodoDto, 
      { new: true }
    );
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.todoModel.findOneAndDelete({ _id: id, user: userId });
    if (!result) throw new NotFoundException('Todo not found');
    
    // Xóa todo khỏi mảng todos của user
    await this.userModel.findByIdAndUpdate(userId, { $pull: { todos: id } });
  }
}
