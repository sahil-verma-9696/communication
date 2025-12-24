import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FriendRequest,
  FriendRequestSchema,
} from './schema/friendrequests.schema';
import { FriendRequestController } from '../friendrequest/friendrequests.controller';
import { FriendRequestsService } from '../friendrequest/friendrequests.service';
import { FriendsModule } from 'src/friends/friends.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
    FriendsModule,
    NotificationModule,
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestsService],
})
export class FriendRequestsModule {}
