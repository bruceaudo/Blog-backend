import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { createCommentDTO } from './DTO'

@Injectable()
export class CommentsService {
  constructor (private prisma: PrismaService) {}

  //Create comment
  async createComment (postid: number, dto: createCommentDTO, userId: number) {
    try {
      const post = await this.prisma.post.findUnique({
        where: {
          id: postid,
        },
      })
      if (!post) throw new ForbiddenException('Post does not exist')

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
      if (!user) throw new ForbiddenException('User does not exist')

      const comment = await this.prisma.comment.create({
        data: {
          ...dto,
          postId: postid,
          authorId: userId,
        },
      })

      return comment
    } catch (error) {
      throw error
    }
  }

  //Get comments for a specific post
    async getComments(postId: number) {
        try {
            const post = await this.prisma.post.findUnique({
                where: {
                  id: postId
              }
            })
            if(!post) throw new ForbiddenException("Post does not exist")
          const comments = await this.prisma.comment.findMany({
              where: {
                postId: postId
            }
          })
          
          return comments
      } catch (error) {
        throw error
      }
    }
    

    //Delete comment
    async deleteComment(id: number, userId: number) {
        try {
            const comment = await this.prisma.comment.findUnique({
                where: {
                    id: id
                }
            })
            if (!comment) throw new ForbiddenException("Comment does not exist")
            
            if (comment.authorId !== userId) throw new ForbiddenException("Unauthorized")
            
            const deletedComment = await this.prisma.comment.delete({
                where: {
                    id:id
                }
            })

            return {message:"Comment deleted successfully"}
        } catch (error) {
            throw error
        }
    }
  
  //Update comment
    async updateComment(id: number, userId: number, dto: createCommentDTO) {
        try {
            const comment = await this.prisma.comment.findUnique({
                where: {
                    id: id
                }
            })
            if (!comment) throw new ForbiddenException("Comment does not exist")
            
            if (comment.authorId !== userId) throw new ForbiddenException("Unauthorized")
            
            const updatedComment = await this.prisma.comment.update({
                where: {
                    id:id
              },
              data: {
                ...dto
              }
            })

            return updatedComment
        } catch (error) {
            throw error
        }
    }
}
