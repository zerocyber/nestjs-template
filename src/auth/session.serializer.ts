import { PassportSerializer } from "@nestjs/passport";
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { Injectable } from "@nestjs/common";


@Injectable()
export class SessionSerializer extends PassportSerializer {

    constructor(private readonly userService: UserService) {
        super();
    }
    
    // 세션 저장에 사용 되는 메서드
    serializeUser(user: User, done: (err: Error | null, user: any) => void) {
        done(null, user.id);
    }

    // 세션에서 정보 조회에 사용되는 메서드
    async deserializeUser(userId: number, done: (err: Error | null, payload: any) => void): Promise<any> {
        const user = await this.userService.findOne(userId);
        if (!user) {
            return done(null, null);
        }
        const { password, ...userWithoutPassword } = user;
        done(null, userWithoutPassword);
    }
}
