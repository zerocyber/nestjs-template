import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString({
    message: '제목은 문자열만 가능합니다. - $value',
  })
  @MinLength(6, {
    message: '제목은 6자 이상 입력해주세요. - $value',
  })
  @MaxLength(30, {
    message: '제목의 최대 입력 글자는 30자입니다. - $value',
  })
  title: string;

  @IsString()
  memo: string;
  @IsBoolean()
  isDone: boolean;
}
