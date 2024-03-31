import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { AuthDto, RefreshDto } from './dto';
import { RefreshTokenGuard } from './guard';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('signup')
    signup(@Body() dto: AuthDto) {
      return this.authService.signup(dto);
    }
  
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: AuthDto) {
      return this.authService.signin(dto);
    }

    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refreshtoken')
    refresh(@Body() dto: RefreshDto ,  @Req() req ) {
      return this.authService.getAccessTokenByRefreshToken(dto.refresh_token,req.user);
    }

  }  