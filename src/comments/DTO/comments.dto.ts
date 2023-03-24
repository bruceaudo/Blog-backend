import { IsNotEmpty, IsString } from 'class-validator'

export class createCommentDTO {
  @IsString()
  @IsNotEmpty()
  comment: string
}
