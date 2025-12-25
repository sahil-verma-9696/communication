import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import events from './constants/events';

@Injectable()
export class SocketService {
  private server: Server;

  // userId → Set of socketIds (supports multi-tabs)
  private onlineUsers = new Map<string, Set<string>>();

  setServer(server: Server) {
    this.server = server;
  }

  addOnlineUser(userId: string, socketId: string) {
    if (!this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, new Set());
    }
    this.onlineUsers.get(userId)!.add(socketId);
  }

  removeOnlineUser(userId: string, socketId: string) {
    const sockets = this.onlineUsers.get(userId);
    if (!sockets) return;

    sockets.delete(socketId);

    if (sockets.size === 0) {
      this.onlineUsers.delete(userId);
    }
  }

  sendNotification(userId: string, payload: any) {
    const sockets = this.onlineUsers.get(userId);
    if (!sockets || !this.server) return;

    for (const socketId of sockets) {
      this.server.to(socketId).emit(events.NOTIFICATION, payload);
    }
  }
}
