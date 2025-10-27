import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsBoolean, IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { Match } from '../../common/validators/match';

export class RegisterDto {
  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'Alice Silva', description: 'Nome e Sobrenome' })
  @IsString()
  @Matches(/^\s*\S+\s+\S+.*$/, { message: 'name must contain at least first and last name' })
  name!: string;

  @ApiProperty({ minLength: 6, description: 'Must match password' })
  @IsString()
  @MinLength(6)
  @Match('password', { message: 'confirm_password must match password' })
  confirm_password!: string;

  @ApiProperty({ description: 'User agrees with Terms and Privacy' })
  @IsBoolean()
  @Equals(true, { message: 'accept_terms must be true' })
  accept_terms!: boolean;
}
