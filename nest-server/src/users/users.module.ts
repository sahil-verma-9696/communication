import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/users.schema';
import { UsersRepo } from './repos/users.repo';
import { AccountLifecycleRepo } from './repos/account_lifecycle.repo';
import { AccountRepo } from './repos/account.repo';
import { Account, AccountSchema } from './schema/account.schema';
import {
  AccountLifecycle,
  AccountLifecycleSchema,
} from './schema/account_lifecycle.schema';
import { FriendRequestsModule } from 'src/friendrequest/friendrequests.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    MongooseModule.forFeature([
      { name: AccountLifecycle.name, schema: AccountLifecycleSchema },
    ]),
    FriendRequestsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepo, AccountRepo, AccountLifecycleRepo],
  exports: [UsersService, UsersRepo, AccountRepo, AccountLifecycleRepo],
})
export class UsersModule {}
