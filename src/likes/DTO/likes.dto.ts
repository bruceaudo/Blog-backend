import { IsBoolean, IsNotEmpty } from 'class-validator'

export class likesDTO {
  @IsBoolean()
  @IsNotEmpty()
  isLiked: boolean
}
