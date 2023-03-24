import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), AuthModule, PrismaModule, UserModule, MulterModule.register({
    dest: './uploads'
  }), PostsModule, CommentsModule, LikesModule],
})
export class AppModule {}
