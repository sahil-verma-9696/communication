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
import { FriendRequestListener } from './friend-request.listener';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
    FriendsModule,
    NotificationModule,
    SocketModule,
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestsService, FriendRequestListener],
})
export class FriendRequestsModule {}
