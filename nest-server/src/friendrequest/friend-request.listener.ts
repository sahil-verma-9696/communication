import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FriendRequest,
  FriendRequestDocument,
  FriendRequestStatus,
} from './schema/friendrequests.schema';
import { SocketService } from '../socket/socket.service';
import { ChangeStream } from 'mongodb';

@Injectable()
export class FriendRequestListener implements OnModuleInit, OnModuleDestroy {
  private changeStream: ChangeStream<FriendRequestDocument>;

  constructor(
    @InjectModel(FriendRequest.name)
    private friendRequestModel: Model<FriendRequestDocument>,
    private socketService: SocketService,
  ) {}

  onModuleInit() {
    this.changeStream = this.friendRequestModel.watch([], {
      fullDocument: 'updateLookup',
    });

    this.changeStream.on('change', (change) => {
      // 1️⃣ Friend request CREATED
      if (change.operationType === 'insert') {
        const doc = change.fullDocument;

        this.socketService.sendNotification(doc.receiver.toString(), {
          type: 'FRIEND_REQUEST',
          requestId: doc._id,
          senderId: doc.sender,
        });
      }

      // 2️⃣ Friend request UPDATED
      if (change.operationType === 'update') {
        const doc = change.fullDocument;

        if (doc && doc.status === FriendRequestStatus.ACCEPTED) {
          this.socketService.sendNotification(doc.sender.toString(), {
            type: 'FRIEND_REQUEST_ACCEPTED',
            userId: doc.receiver,
          });

          this.socketService.sendNotification(doc.receiver.toString(), {
            type: 'FRIEND_REQUEST_ACCEPTED',
            userId: doc.sender,
          });
        }
      }
    });
  }

  async onModuleDestroy() {
    await this.changeStream?.close();
  }
}
