import { IsBoolean, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString({
    message: (validationArguments) => {
      const value = validationArguments.value;
      return value ? `제목은 문자열만 가능합니다. - ${value}` : '제목은 문자열만 가능합니다.';
    },
  })
  @MinLength(6, {
    message: '제목은 6자 이상 입력해주세요. - $value',
  })
  @MaxLength(30, {
    message: '제목의 최대 입력 글자는 30자입니다. - $value',
  })
  title: string;

  @IsString({
    message: '메모는 문자열만 가능합니다. - $value',
  })
  @MaxLength(200, {
    message: '메모의 최대 입력 글자는 200자입니다. - $value', 
  })
  memo: string;

  @IsBoolean({
    message: '완료 여부는 true/false만 가능합니다. - $value',
  })
  isDone: boolean;

  @IsNumber()
  userId: number;
}
