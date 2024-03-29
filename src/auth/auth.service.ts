import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  //import { PrismaService } from '../prisma/prisma.service';
  import { AuthDto } from './dto';
  import * as argon from 'argon2';
 // import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
  
  @Injectable()
  export class AuthService {
    constructor(
      private userService: UserService,
      private jwt: JwtService,
      private config: ConfigService,
    ) {}
  
    async signup(dto: AuthDto) {

        try {
        const hash = await argon.hash(dto.password);
        
        // create a new user entity
        const newUser = await this.userService.create({
            email: dto.email,
            password:hash
        } as User);
    
        // save the new user in the db
 
            return this.signToken(newUser.id, newUser.email);
        } catch (error) {
            throw new ForbiddenException('Email already in use');
        }
    }
  
    async signin(dto: AuthDto) {
      // find the user by email
      const user = await this.userService.findByEmail(dto.email);
      if (!user)
        throw new ForbiddenException(
          'Credentials incorrect',
        );
  
      // compare password
      const pwMatches = await argon.verify(
        user.password,
        dto.password,
      );
      // if password incorrect throw exception
      if (!pwMatches)
        throw new ForbiddenException(
          'Credentials incorrect',
        );
      return this.signToken(user.id, user.email);
    }
  
    async signToken(
      userId: number,
      email: string,
    ): Promise<{ access_token: string }> {
      const payload = {
        sub: userId,
        email,
      };
      const secret = this.config.get('JWT_SECRET');
  
      const token = await this.jwt.signAsync(
        payload,
        {
          expiresIn: '15m',
          secret: secret,
        },
      );
  
      return {
        access_token: token,
      };
    }
  }
  