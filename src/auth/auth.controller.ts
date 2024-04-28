import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
    ValidationPipe,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { AuthDto, RefreshDto } from './dto';
import { RefreshTokenGuard } from './guard';
import { DebounceInterceptor } from 'src/redis/interceptors/debounce.interceptor';
  
  @Controller('auth')
  @UseInterceptors(DebounceInterceptor)
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('signup')
    signup(@Body(new ValidationPipe()) dto: AuthDto) {
      return this.authService.signup(dto);
    }
  
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body(new ValidationPipe()) dto: AuthDto) {
      return this.authService.signin(dto);
    }

    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refreshtoken')
    refresh(@Body(new ValidationPipe()) dto: RefreshDto ,  @Req() req ) {
      return this.authService.getAccessTokenByRefreshToken(dto.refresh_token,req.user);
    }

  }  