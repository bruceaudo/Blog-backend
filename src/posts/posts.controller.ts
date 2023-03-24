import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { JwtAuthGuard } from 'src/auth/authguard'
import { User } from 'src/auth/decorator'
import { updateDTO } from 'src/auth/dto'
import { createPostDTO, updatePostDTO } from './DTO'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  constructor (private authService: AuthService, private postsService: PostsService) {}

  //Create post
  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@User() user, @Body() dto: createPostDTO) {
      const userId:number = user.userId
      return this.postsService.createPost(dto, userId)
  }

  //Get posts for specific user
  @UseGuards(JwtAuthGuard)
  @Get()
  getUserPosts(@User() user) {
      const userId: number = user.userId
      return this.postsService.getUserPosts(userId)
  }

  //Get posts for all users
  @Get('all')
  getPosts() {
      return this.postsService.getPosts()
  }

  //Get post by id by all user
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
      return this.postsService.getPost(id)
  }

  //Update post by id
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updatePost(@Param('id', ParseIntPipe) id: number, @User() user, @Body() dto: updatePostDTO) {
      const userId: number = user.userId
      return this.postsService.updatePost(dto, id, userId)
  }

  //Delete post by id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePost (@Param('id', ParseIntPipe) id: number, @User() user) {
    const userId: number = user.userId
    return this.postsService.deletePost(id, userId)
  }
}
