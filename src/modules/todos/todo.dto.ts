
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsMongoId, MinLength, MaxLength, IsNumber, Min, Max } from 'class-validator';
import { TodoStatus } from 'src/enums/todo-status.enum';

export class CreateTodoDto {
  
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content?: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus = TodoStatus.PENDING;
}

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content?: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;
}

export class QueryTodoDto {
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number = 10;

  @IsNumber()
  @IsOptional()
  @Min(0)
  offset?: number = 0;
}
