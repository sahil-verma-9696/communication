import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import events from './constants/events';
import { BrowserInfo, SocketWithData } from './socket.gateway';

/**
 * Add Online params
 * ----------------
 */
export type AddOnlineUserParams = {
  userId: string;
  deviceId: string;
  browserInfo: BrowserInfo;
  socketId: string;
};

@Injectable()
export class SocketService {
  private server: Server;

  // userId → Set of socketIds (supports multi-tabs)
  private onlineUsers = new Map<
    string, // userId
    {
      /**
       * Map  <DeviceId : < DeviceInfo >>
       * ---------------------
       */
      devices: Map<
        string, // deviceId
        {
          /**
           * BrowserInfo
           * --------------
           */
          info: BrowserInfo;
          /**
           * Set of socketIds
           * ------------------
           */
          sockets: Set<string>; // socketIds (tabs)
          lastSeen: Date;
        }
      >;
    }
  >();

  setServer(server: Server) {
    this.server = server;
  }

  /**
   * Add online user to onlineUsers Map
   * ----------------------------------
   * @description Add online user to onlineUsers Map `in-memory`
   */
  addOnlineUser({
    userId,
    deviceId,
    browserInfo,
    socketId,
  }: AddOnlineUserParams) {
    if (!this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, { devices: new Map() });
    }

    const user = this.onlineUsers.get(userId)!;

    if (!user.devices.has(deviceId)) {
      user.devices.set(deviceId, {
        info: browserInfo,
        sockets: new Set(),
        lastSeen: new Date(),
      });
    }

    const device = user.devices.get(deviceId)!;
    device.sockets.add(socketId);
    device.lastSeen = new Date();
  }

  /**
   * Remove online user from onlineUsers Map
   * ---------------------------------------
   * @description Cleans up socket → device → user
   */
  removeOnlineUser(socket: SocketWithData) {
    const { userId, deviceId } = socket.data;

    if (!userId || !deviceId) return;

    const user = this.onlineUsers.get(userId);
    if (!user) return;

    const device = user.devices.get(deviceId);
    if (!device) return;

    // Remove socket (tab)
    device.sockets.delete(socket.id);

    // If no tabs left on this device → remove device
    if (device.sockets.size === 0) {
      user.devices.delete(deviceId);
    }

    // If no devices left → user is fully offline
    if (user.devices.size === 0) {
      this.onlineUsers.delete(userId);
      return;
    }

    // OPTIONAL: device-level update
    device.lastSeen = new Date();
  }

  /**
   * Broadcast online users to Everyone
   * -----------------------
   */
  brodcastOnlineUsers() {
    if (!this.server) return;

    const activeUsers = this.getOnlineUsersDTO();

    this.server.emit(events.ONLINE_USERS, activeUsers);
  }

  sendNotification(userId: string, payload: any) {
    const sockets = this.getUserSockets(userId);

    if (!sockets.length || !this.server) return;

    for (const socketId of sockets) {
      this.server.to(socketId).emit(events.NOTIFICATION, payload);
    }
  }

  // TODO : create room
  sendMessage(chatId: string, senderId: string, payload: any) {
    const senderSockets = this.getUserSockets(senderId);
    if (!senderSockets || !this.server) return;
    for (const socketId of senderSockets) {
      this.server.to(chatId).except(socketId).emit(events.MESSAGE, payload);
    }
  }

  private getOnlineUsersDTO() {
    return Array.from(this.onlineUsers.entries()).map(([userId, user]) => ({
      userId,
      devices: user.devices.size,
      lastSeen: Math.max(
        ...Array.from(user.devices.values()).map((d) => d.lastSeen.getTime()),
      ),
    }));
  }

  /**
   * GET user sockets
   * ----------------
   */
  private getUserSockets(userId: string): string[] {
    return Array.from(
      this.onlineUsers.get(userId)?.devices.values() ?? [],
    ).flatMap((device) => Array.from(device.sockets));
  }

  /**
   * GET device sockets
   * ------------------
   */
  getDeviceSockets(userId: string, deviceId: string): string[] {
    return Array.from(
      this.onlineUsers.get(userId)?.devices.get(deviceId)?.sockets ?? [],
    );
  }

  /**
   * GET user online status
   * ---------------------
   */
  isUserOnline(userId: string): boolean {
    return (this.onlineUsers.get(userId)?.devices.size ?? 0) > 0;
  }
}
