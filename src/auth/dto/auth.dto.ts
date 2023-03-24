import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class loginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string
  @IsString()
  @IsNotEmpty()
  password: string
}

export class signupDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string
  @IsString()
  @IsNotEmpty()
  password: string
  @IsString()
  @IsNotEmpty()
  username: string
}

export class updateDTO {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string
  @IsNotEmpty()
  @IsOptional()
  username?: string
  @IsNotEmpty()
  @IsOptional()
  profilePic?: string
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  isAdmin?: boolean
}

export class resetDTO {
  @IsString()
  @IsNotEmpty()
  password: string
}
