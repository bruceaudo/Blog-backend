import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { JwtAuthGuard } from 'src/auth/authguard'
import { User } from 'src/auth/decorator'
import { resetDTO, updateDTO } from 'src/auth/dto'
import { UserService } from './user.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import path from 'path'
import {v4 as uuidv4} from 'uuid'
import { Observable, of } from 'rxjs'
import { editFileName, imageFileFilter } from './middlewares'

@Controller('user')
export class UserController {
  constructor (
    private userService: UserService,
    private authService: AuthService,
  ) {}

  //Get all users
  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers (@User() user) {
    const isAdmin: boolean = user.isAdmin
    if (!isAdmin) throw new ForbiddenException('Unauthorized')
    return this.userService.getUsers()
  }

  //Allow user to post
  @UseGuards(JwtAuthGuard)
    @Patch('allow/:id')
  allowPosting(@Param('id', ParseIntPipe) id: number, @User() user) {
    const isAdmin: boolean = user.isAdmin
    if(!isAdmin) throw new ForbiddenException("Unauthorized")
    return this.userService.allowPosting(id)
   }
  
  //Get user by id
  @Get(':id')
  getUser (@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUser(id)
  }

  //Update user by id
  @UseGuards(JwtAuthGuard)
  @Patch()
  updateUser (@Body() dto: updateDTO, @User() user) {
    const userId: number = user.userId
    return this.userService.updateUser(dto, userId)
  }

  //Reset password
  @UseGuards(JwtAuthGuard)
  @Patch('reset')
  resetPassword (@User() user, @Body() dto: resetDTO) {
    const userId: number = user.userId
    return this.userService.resetPassword(dto, userId)
  }

  //Update profile picture
    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: editFileName,
        }),
        fileFilter: imageFileFilter
    }))
    uploadFile(@UploadedFile() file, @User() user) {
        const response = {
            originalname: file.originalname,
            filename: file.filename,
        }
        const userId: number = user.userId
        const filename: string = response.filename
        return this.userService.updateProfile(filename, userId)
    
  }

  //Delete user by id
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser (@User() user) {
    const userId: number = user.userId
    return this.userService.deleteUser(userId)
  }
}
