import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/auth.guard';
import events from './constants/events';
import chalk from 'chalk';

/**
 * Data to be attached to Socket
 * ------------------------------
 */
export type SocketData = { userId: string; deviceId: string; email: string };

/**
 * 🔥 Extend Socket with `user` property
 * --------------------------------------
 */
export type SocketWithData = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>;

/**
 * Expected BrowserInfo from Client
 * --------------------------------
 */
export interface BrowserInfo {
  browser?: string;
  browserVersion?: string;

  os?: string;
  osVersion?: string;

  deviceType: 'mobile' | 'tablet' | 'desktop';

  userAgent: string;
  language: string;

  screen: {
    width: number;
    height: number;
  };

  timezone: string;
}

/**
 * Expected SocketAuthPayload from Client
 * -------------------------------------
 */
export interface SocketAuthPayload {
  token: string;
  deviceId: string;
  browserInfo: BrowserInfo;
}

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

  async handleConnection(client: SocketWithData) {
    try {
      /**
       * GET token from Client
       * ---------------------
       * @description Extract access_token via `auth: { token: string }` or `authorization header`.
       */
      const token =
        (client.handshake.auth['token'] as string) ||
        client.handshake.headers?.authorization?.split(' ')[1];

      /**
       * GET browserInfo and deviceId from Client
       * ----------------------------------------
       */
      const { browserInfo, deviceId } =
        (client.handshake.auth as SocketAuthPayload) || {};

      if (!token || !deviceId || !browserInfo)
        throw new UnauthorizedException(
          'Invalid credentials. Required token, deviceId and browserInfo.',
        );

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      if (!payload) throw new UnauthorizedException('Invalid credentials.');

      /**
       * Attach user to Socket
       * ---------------------
       * @description Attach user to Socket in `in-memory`.
       */
      client.data = { userId: payload.sub, deviceId, email: payload.email };

      /**
       * Add user to onlineUsers
       * -----------------------
       * @description Add user to onlineUsers in `in-memory`.
       */
      this.socketService.addOnlineUser({
        userId: payload.sub,
        socketId: client.id,
        deviceId,
        browserInfo,
      });

      this.socketService.brodcastOnlineUsers();

      console.log(
        chalk.magenta('[SOCKET_CONNECTED]'),
        chalk.yellow(
          `userId: ${client.data.userId} email: ${client.data.email} socketId: ${client.id}`,
        ),
      );
    } catch (err) {
      console.log(err);
      client.disconnect();
    }
  }

  handleDisconnect(client: SocketWithData) {
    this.socketService.removeOnlineUser(client);

    this.socketService.brodcastOnlineUsers();

    console.log(
      chalk.magenta('[SOCKET_DISCONNECTED]'),
      chalk.red(
        `userId: ${client.data.userId} email: ${client.data.email} socketId: ${client.id}`,
      ),
    );
  }

  // @SubscribeMessage(events.JOIN_CHAT)
  // async handleJoinChat(
  //   @MessageBody() chatId: string,
  //   @ConnectedSocket() client: SocketWithData,
  // ) {
  //   await client.join(chatId); // 🔥 THIS IS THE ROOM JOIN
  //   console.log(`User ${client.data.user.sub} joined chat room ${chatId}`);
  // }

  // @SubscribeMessage(events.LEAVE_CHAT)
  // async handleLeaveChat(
  //   @MessageBody() chatId: string,
  //   @ConnectedSocket() client: SocketWithData,
  // ) {
  //   await client.leave(chatId); // 🔥 THIS IS THE ROOM LEAVE
  //   console.log(`User ${client.data.user.sub} left chat room ${chatId}`);
  // }
}
