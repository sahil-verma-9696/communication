import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Friend, FriendSchema } from './schema/friends.schema';
import { FriendsRepo } from './repo/friends.repo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Friend.name, schema: FriendSchema }]),
  ],
  controllers: [FriendsController],
  providers: [FriendsService, FriendsRepo],
  exports: [FriendsService],
})
export class FriendsModule {}
