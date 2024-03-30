import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; //  creating and verifying JWTs 
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [JwtModule.register({}) , UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
