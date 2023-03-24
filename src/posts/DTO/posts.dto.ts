import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class createPostDTO {
  @IsString()
  @IsNotEmpty()
  title: string
  @IsString()
  @IsNotEmpty()
  summary: string
  @IsString()
  @IsNotEmpty()
  content: string
}

export class updatePostDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  summary: string
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  published: boolean
  @IsNumber()
  @IsNotEmpty()
  likes: number
}
