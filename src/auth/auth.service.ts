import * as bcrypt from 'bcrypt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersDto } from '../users/dto/users.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UsersCreateDto } from '../users/dto/users-create.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async signIn(user: UsersCreateDto): Promise<AuthResponseDto> {
    const foundUser = await this.userService.findOneByUsername(user.username);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    const passwordsMatch = await bcrypt.compare(
      user.password,
      foundUser.password,
    );
    if (!passwordsMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    delete foundUser.password;
    const token: string = await this.generateUserToken(foundUser);
    return { user: foundUser, token };
  }

  public async signUp(user: UsersCreateDto): Promise<AuthResponseDto> {
    const foundUser = await this.userService.findOneByUsername(user.username);
    if (foundUser) {
      throw new ConflictException('User already exists');
    }
    const passwordHash: string = await this.hashPassword(user.password);
    const newUser = await this.userService.createUser({
      ...user,
      password: passwordHash,
    });
    delete newUser.password;
    const token: string = await this.generateUserToken(newUser);
    return { user: newUser, token };
  }

  private async generateUserToken(user: UsersDto): Promise<string> {
    return await this.jwtService.signAsync({ user });
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      password,
      Number(this.configService.get('salt_rounds')),
    );
  }
}
