import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: Partial<User>;
  session: any;
  sessionID: string;
}

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string): Promise<Partial<User> | null> {
    const user = await this.userService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { id, name, email, createdAt } = user;
      return { id, name, email, createdAt };
    }

    return null;
  }

}
