import { ForbiddenException, Injectable } from '@nestjs/common'
import { resetDTO, updateDTO } from 'src/auth/dto'
import { PrismaService } from 'src/prisma/prisma.service'
import * as argon from 'argon2'

@Injectable()
export class UserService {
  constructor (private prisma: PrismaService) {}
  //Get all users
  async getUsers () {
    try {
      const users = await this.prisma.user.findMany({})
      return users
    } catch (error) {
      throw error
    }
  }

  //Allow users to post
  async allowPosting (id: number) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id
        }
      })
      if(!userExists) throw new ForbiddenException("User does not exist")
      const user = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          canPost: true,
        },
      })
      return user
    } catch (error) {
      throw error
    }
  }

  //Get user by id
  async getUser (id: number) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      })

      if (!userExists) throw new ForbiddenException('User does not exist')
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      })

      delete user.password

      return user
    } catch (error) {
      throw error
    }
  }

  //Update user by id
  async updateUser (dto: updateDTO, userId: number) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
      if (!userExists) throw new ForbiddenException('User does not exist')
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      })

      delete updatedUser.password

      return updatedUser
    } catch (error) {
      throw error
    }
  }

  //Reset password
  async resetPassword (dto: resetDTO, userId: number) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!userExists) throw new ForbiddenException('User does not exists')

      const hash = await argon.hash(dto.password)
      const resetPassword = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hash,
        },
      })
      return { message: 'Password reset successful' }
    } catch (error) {
      throw error
    }
  }

  //Delete user by id
  async deleteUser (userId: number) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!userExists) throw new ForbiddenException('User does not exists')

      const deleteUser = await this.prisma.user.delete({
        where: {
          id: userId,
        },
      })

      return { message: 'User deleted successfully' }
    } catch (error) {
      throw error
    }
  }

  //Upload profile pic
  async updateProfile (filename: string, userId: number) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!userExists) throw new ForbiddenException('User does not exist')

      const updateProfilePic = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          profilePic: filename,
        },
      })

      return updateProfilePic
    } catch (error) {
      throw error
    }
  }
}
