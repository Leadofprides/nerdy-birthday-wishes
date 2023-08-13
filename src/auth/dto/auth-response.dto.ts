import { ApiProperty } from '@nestjs/swagger';
import { UsersDto } from '../../users/dto/users.dto';

export class AuthResponseDto {
  @ApiProperty()
  readonly user: UsersDto;

  @ApiProperty()
  readonly token: string;
}
