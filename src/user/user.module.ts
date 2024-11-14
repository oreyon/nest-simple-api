import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailService } from 'src/common/mail.service';

@Module({
  providers: [UserService, MailService],
  controllers: [UserController],
})
export class UserModule {}
