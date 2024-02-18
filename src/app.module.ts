import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { FormController } from './form/form.controller';
import { UserController } from './user/user.controller';
import { Form } from './form/form.entity';

//rwQuZGnIqVry1gu8
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://admin:rwQuZGnIqVry1gu8@cluster0.iyhiakq.mongodb.net/?retryWrites=true&w=majority',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    TypeOrmModule.forFeature([Form, User]),
  ],
  controllers: [AppController, FormController, UserController],
  providers: [AppService],
})
export class AppModule {}
