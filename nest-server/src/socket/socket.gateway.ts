import {
  ConnectedSocket,
  MessageBody,
  // ConnectedSocket,
  // MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  // SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/auth.guard';
import events from './constants/events';
// import events from './constants/events';

// type SocketWithData = Socket & {
//   data: JwtPayload;
// };

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'ngrok-skip-browser-warning',
    ],
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly socketService: SocketService,
    private jwtService: JwtService,
  ) {}

  afterInit() {
    // 🔥 Give server access to SocketService
    this.socketService.setServer(this.server);
  }

  async handleConnection(client: Socket) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException();
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      client.data.user = payload; // attach user to socket

      this.socketService.addOnlineUser(payload.sub, client.id);

      console.log('User connected:', payload.username, payload.email);
    } catch (err) {
      console.log(err);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('User disconnected:', client.data?.user?.sub);
  }

  @SubscribeMessage(events.JOIN_CHAT)
  handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(chatId); // 🔥 THIS IS THE ROOM JOIN
    console.log(`User ${client.data.user.sub} joined chat room ${chatId}`);
  }

  @SubscribeMessage(events.LEAVE_CHAT)
  handleLeaveChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(chatId); // 🔥 THIS IS THE ROOM LEAVE
    console.log(`User ${client.data.user.sub} left chat room ${chatId}`);
  }
}
