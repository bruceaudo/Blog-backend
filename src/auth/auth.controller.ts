import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './authguard'
import { User } from './decorator'
import { loginDTO, signupDTO } from './dto'

//Update user, delete user, get all users, get user by id is found in user folder

@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  //Create admin
  @Post('admin')
  createAdmin (@Body() dto: signupDTO) {
    return this.authService.createAdmin(dto)
  }

  //Users register
  @Post('register')
  addUser (@Body() dto: signupDTO) {
    return this.authService.addUser(dto)
  }

  //Users and admin log in
  @Post('login')
  login (@Body() dto: loginDTO) {
    return this.authService.login(dto)
  }
}
