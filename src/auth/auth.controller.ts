import { Controller, Post, Body } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UsersCreateDto } from '../users/dto/users-create.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 200, type: AuthResponseDto })
  @Post('signin')
  signIn(@Body() user: UsersCreateDto): Promise<AuthResponseDto> {
    return this.authService.signIn(user);
  }

  @ApiResponse({ status: 201, type: AuthResponseDto })
  @Post('signup')
  signUp(@Body() user: UsersCreateDto): Promise<AuthResponseDto> {
    return this.authService.signUp(user);
  }
}
