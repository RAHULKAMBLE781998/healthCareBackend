import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { AuthDto } from './dto';
  import * as argon from 'argon2';
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
    ): Promise<{ access_token: string , refersh_token: string}> {

      const accessToken = await this.getAccessTokenByUserId(userId,email)
      const refershToken = await this.getRefreshTokenAndSaveToDB(userId,email)

      return {
        access_token: accessToken,
        refersh_token: refershToken
      };
    }

    async getAccessTokenByUserId(
      userId: number,
      email: string,
    ) : Promise<string> {
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
  
      return token;
    }

    async getAccessTokenByRefreshToken(
      refreshToken: string,
      user : User
    ) : Promise< {access_token:string ,refresh_token:string} > {
      const match = await argon.verify(user.hashedRefreshToken, refreshToken);

      if(!match){
        this.userService.update(user.id,{hashedRefreshToken:null})
        throw new ForbiddenException(
          'Access Denied. Please login Again',
        );
      }
      
      const token = await this.getAccessTokenByUserId( user.id,user.email)
      const newRefreshToken = await this.getRefreshTokenAndSaveToDB(user.id,user.email);

      return { access_token: token , refresh_token:newRefreshToken };
    }


    async getRefreshTokenAndSaveToDB(
      userId: number,
      email: string,
    ): Promise<string> { 
      const payload = {
        sub: userId,
        email,
      };
      const secret = this.config.get('REFRESH_SECRET');
  
      const token = await this.jwt.signAsync(
        payload,
        {
          expiresIn: '1y',
          secret: secret,
        },
      );
      
      const hashedRefreshToken = await argon.hash(token);
      
      this.userService.update(userId,{hashedRefreshToken})

      return token;
    }

  }
  