import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User, UserStatus } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    console.log('createUserDto info', createUserDto);
    return await this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany({
      where: { status: UserStatus.ACTIVE },
    });
  }

  async findOne(id: number): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id, status: UserStatus.ACTIVE },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number): Promise<User> {
    return await this.prismaService.user.update({
      where: { id },
      data: {
        status: UserStatus.DELETED,
      },
    });
  }
}
