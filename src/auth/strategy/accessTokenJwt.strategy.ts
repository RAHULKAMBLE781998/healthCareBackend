import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy,'access-token',) {
  constructor(
    config: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
  }) {
    const user = await this.userService.findByEmail(payload.email);
    delete user.password;
    return user;
  }
}
