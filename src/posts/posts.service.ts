import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { createPostDTO, updatePostDTO } from './DTO'

@Injectable()
export class PostsService {
  constructor (private prisma: PrismaService) {}

  //Create post
  async createPost (dto: createPostDTO, userId: number) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!userExists) throw new ForbiddenException('User does not exist')

      if(!userExists.canPost) throw new ForbiddenException("Unauthorized")

      const post = await this.prisma.post.create({
        data: {
          ...dto,
          authorId: userId,
        },
      })
      return post
    } catch (error) {
      throw error
    }
  }

  //Get posts for specific user
  async getUserPosts (userId: number) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
      if (!userExists) throw new ForbiddenException('User does not exist')

      const posts = await this.prisma.post.findMany({
        where: {
          authorId: userId,
        },
      })

      return posts
    } catch (error) {
      throw error
    }
  }

  //Get posts for all users
  async getPosts () {
    try {
      const posts = await this.prisma.post.findMany({})
      return posts
    } catch (error) {
      throw error
    }
  }

  //Get post by id by all user
  async getPost (id: number) {
    try {
      const post = await this.prisma.post.findUnique({
        where: {
          id: id,
        },
      })
      if (!post) throw new ForbiddenException('Post does not exist')
      return post
    } catch (error) {
      throw error
    }
  }

  //Update post by id
  async updatePost (dto: updatePostDTO, id: number, userId: number) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
      if (!userExists) throw new ForbiddenException('User does not exist')

      const post = await this.prisma.post.findUnique({
        where: {
          id: id,
        },
      })

      if (!post) throw new ForbiddenException('Post does not exist')
      if (post.authorId !== userId) throw new ForbiddenException('Unauthorized')

      const updatedPost = await this.prisma.post.update({
        where: {
          id: id,
        },
        data: {
          ...dto,
        },
      })

      return updatedPost
    } catch (error) {
      throw error
    }
  }

  //Delete post by id
  async deletePost (id: number, userId: number) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
      if (!userExists) throw new ForbiddenException('User does not exist')

      const post = await this.prisma.post.findUnique({
        where: {
          id: id,
        },
      })

      if (!post) throw new ForbiddenException('Post does not exist')
      if (post.authorId !== userId) throw new ForbiddenException('Unauthorized')

      const deletedPost = await this.prisma.post.delete({
        where: {
          id: id,
        },
      })

      return { message: 'Deleted successfully' }
    } catch (error) {
      throw error
    }
  }
}
