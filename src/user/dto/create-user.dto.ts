import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, {
    message: '이름은 2자 이상 입력해주세요. - $value',
  })
  @MaxLength(10, {
    message: '이름은 10자 이하로 입력해주세요. - $value',
  })
  name: string;

  @IsEmail({}, {
    message: '이메일 형식으로 입력해주세요. - $value',
  })
  email: string;

  @IsString()
  @MinLength(8, {
    message: '비밀번호는 8자 이상 입력해주세요. - $value',
  })
  @MaxLength(20, {
    message: '비밀번호는 20자 이하로 입력해주세요. - $value',
  })
  password: string;
}