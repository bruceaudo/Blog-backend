import { Body, Controller, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { JwtAuthGuard } from 'src/auth/authguard'
import { User } from 'src/auth/decorator'
import { likesDTO } from './DTO'
import { LikesService } from './likes.service'

@Controller('likes')
export class LikesController {
  constructor (
    private likesService: LikesService,
    private authService: AuthService,
  ) {}

  //Like/Unlike a post
  @UseGuards(JwtAuthGuard)
  @Patch(':postId')
  likePost(@Param('postId', ParseIntPipe) postId: number, @User() user) {
      const userId: number = user.userId
      return this.likesService.likePost(postId, userId)
  }
}
