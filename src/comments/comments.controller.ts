import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { JwtAuthGuard } from 'src/auth/authguard'
import { User } from 'src/auth/decorator'
import { CommentsService } from './comments.service'
import { createCommentDTO } from './DTO'

@Controller('comments')
export class CommentsController {
  constructor (
    private commentsService: CommentsService,
    private authService: AuthService,
  ) {}
  //Create comment
  @UseGuards(JwtAuthGuard)
  @Post(':postid')
  createComment(@User() user, @Param('postid', ParseIntPipe) postid: number, @Body() dto: createCommentDTO) {
      const userId: number = user.userId
      return this.commentsService.createComment(postid, dto, userId)
  }

  //Get all comments
  @Get(':postid')
  getComments(@Param('postid', ParseIntPipe) postid: number) {
      return this.commentsService.getComments(postid)
  }
    
    //Delete comment
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteComment(@Param('id', ParseIntPipe) id: number, @User() user) {
        const userId: number = user.userId
        return this.commentsService.deleteComment(id, userId)
    }
  
  //Update comment
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateComment(@Param('id', ParseIntPipe) id: number, @User() user, @Body() dto: createCommentDTO) {
        const userId: number = user.userId
        return this.commentsService.updateComment(id, userId, dto)
    }
}
