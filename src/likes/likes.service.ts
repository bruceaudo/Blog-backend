import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { likesDTO } from './DTO'

@Injectable()
export class LikesService {
  constructor (private prisma: PrismaService) {}

  // Like/Unlike post
  async likePost (postId: number, userId: number) {
    try {
      const postExists = await this.prisma.post.findUnique({
        where: {
          id: postId,
        },
      })
      if (!postExists) throw new ForbiddenException('Post does not exist')

      const userExists = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
      if (!userExists) throw new ForbiddenException('User does not exist')

      let data = postExists.likes
      data += 1

      const updatedPost = await this.prisma.post.update({
        where: {
          id: postId
        },
        data: {
          likes: data
        }
      })


      return updatedPost
    } catch (error) {
      throw error
    }
  }
}
