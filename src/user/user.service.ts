import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  private readonly testUsers = [
    {
      userId: 1,
      username: 'john',
      email: 'john@example.com',
      password: '1111',
    },
    {
      userId: 2,
      username: 'maria',
      email: 'maria@example.com',
      password: '1234',
    },
  ];

  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      return await this.prismaService.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('error.code', error.code);
        const field = error.meta?.target?.[0];
        throw new ConflictException(`${field}가 이미 사용 중입니다.`);
      }
      throw error;
    }
  }

  async findOneByEmailFromTestUsers(email: string) {
    return this.testUsers.find((user) => user.email === email);
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany({
      where: { status: UserStatus.ACTIVE },
    });
  }


  // async findOne(id: number): Promise<User | null> {
  async findOne(id: number): Promise<Partial<User> | null> {
    return await this.prismaService.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      where: { 
        id, 
        status: UserStatus.ACTIVE,
      },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: {
        email,
        status: UserStatus.ACTIVE,
      },
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
