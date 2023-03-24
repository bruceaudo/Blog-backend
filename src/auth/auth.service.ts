import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { loginDTO, signupDTO } from './dto'
import * as argon from 'argon2'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService {
  constructor (
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  //Create admin
  async createAdmin (dto: signupDTO) {
    try {
      const hash = await argon.hash(dto.password)
      const admin = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          isAdmin: true,
          password: hash,
        },
      })
      delete admin.password
      return admin
    } catch (error) {
      if (error.code === 'P2002')
        throw new ForbiddenException('Email already in use')

      throw error
    }
  }

  //Usesr register
  async addUser (dto: signupDTO) {
    try {
      const hash = await argon.hash(dto.password)
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          username: dto.username
        },
      })

      const access_token = await this.generateToken(user.id, user.isAdmin)

      delete user.password
      return { user, access_token }

    } catch (error) {
      if (error.code === 'P2002')
        throw new ForbiddenException('Email already in use')

      throw error
    }
  }

  //Users log in
  async login (dto: loginDTO) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      })

      if (!userExists) throw new ForbiddenException('Invalid credentials')

      const passOk = await argon.verify(userExists.password, dto.password)

      if (!passOk) throw new ForbiddenException('Invalid credentials')

      const access_token = await this.generateToken(
        userExists.id,
        userExists.isAdmin,
      )

      delete userExists.password

      return { userExists, access_token }
    } catch (error) {
      throw error
    }
  }

  //Generate jwt token
  generateToken (id: number, isAdmin: boolean) {
    const payload = {
      sub: id,
      isAdmin: isAdmin,
    }

    return this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('SECRET_KEY'),
    })
  }
}
