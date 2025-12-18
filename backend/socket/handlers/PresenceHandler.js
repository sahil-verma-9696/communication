import chalk from "chalk";

/**
 * @typedef {Object} OnlineUserStatus
 * @property {"online" | "offline" | "active"} status - The current status of the user.
 * @property {string} lastSeen - Timestamp of when the user was last seen.
 * @property {string} [for] - The friend ID the status is associated with (optional).
 */

/**
 * @typedef {Object} JoinChatData
 * @property {string} friendId - The ID of the friend for whom the user is joining.
 */

/**
 * @typedef {Object} LeaveChatData
 * @description Optional payload when user leaves (reserved for future use).
 */

/**
 * @typedef {Object} TypingEvent
 * @property {string} recipient_id - The ID of the recipient user.
 * @property {"typing" | "stopped"} status - Typing status of the user.
 */

export class PresenceHandler {
  constructor(namespace) {
    this.namespace = namespace;
  }

  /**
   * Handles a user joining the chat by marking them as online,
   * updating their status, and notifying other clients.
   *
   * @function handleJoinChat
   * @memberof PresenceHandler
   *
   * @param {Socket} socket - The connected socket instance representing the user.
   * @returns {Function} An async function that processes the join event.
   *
   * @callback joinChatCallback
   * @param {JoinChatData} data - The data passed from the client when joining chat.
   *
   * @fires namespace#get_online_users - Emits updated list of online users to all clients.
   * @fires socket#online_user - Broadcasts the new online user's details to others.
   * @fires socket#error - Emits an error event if something goes wrong.
   *
   * @description
   * - Adds the user to the `onlineUsersIds` set.
   * - Updates `idToStatusMap` with the user's online status, last seen time, and friend reference.
   * - Logs the event for debugging.
   * - Emits the updated online users map to all clients.
   * - Broadcasts the user's online status to other connected clients.
   */
  handleJoinChat(socket) {
    return async (data) => {
      try {
        socket.onlineUsersIds.add(socket.userId);
        socket.idToStatusMap.set(
          socket.userId,
          /** @type {OnlineUserStatus} */ ({
            status: "online",
            lastSeen: new Date().toString(),
            for: data.friendId,
          })
        );

        console.log(
          chalk.magenta("[JOIN CHAT] "),
          chalk.cyanBright(`[ONLINE USERS]`),
          socket.onlineUsersIds
        );

        this.namespace.emit(
          "get_online_users",
          Object.fromEntries(socket.idToStatusMap)
        );

        socket.broadcast.emit("online_user", {
          user_id: socket.userId,
          user_name: socket.user.name,
          user_avatar: socket.user.avatar || null,
          timestamp: new Date(),
          status: "online",
        });
      } catch (error) {
        console.error("Get online users error:", error);
        socket.emit("error", {
          event: "online_user",
          message: "Failed to get online users",
        });
      }
    };
  }

  /**
   * Handles a user leaving the chat by removing them from the online users list,
   * updating their status, and notifying other clients.
   *
   * @function handleLeaveChat
   * @memberof PresenceHandler
   *
   * @param {Socket} socket - The connected socket instance representing the user.
   * @returns {Function} An async function that processes the leave event.
   *
   * @callback leaveChatCallback
   * @param {LeaveChatData} data - Optional data provided by the client on leave.
   *
   * @fires namespace#get_online_users - Emits updated list of online users to all clients.
   * @fires socket#online_user - Broadcasts the user's offline status to others.
   *
   * @description
   * - Removes the user from the `onlineUsersIds` set.
   * - Updates `idToStatusMap` with the user's last seen time and sets status to `active` (while broadcasting `offline`).
   * - Logs the event for debugging.
   * - Emits the updated online users map to all clients.
   * - Broadcasts the user's offline status to other connected clients.
   */
  handleLeaveChat(socket) {
    return async (data) => {
      socket.onlineUsersIds.delete(socket.userId);
      socket.idToStatusMap.set(
        socket.userId,
        /** @type {OnlineUserStatus} */ ({
          status: "active",
          lastSeen: new Date().toString(),
        })
      );

      console.log(
        chalk.magenta("[LEAVE CHAT] "),
        chalk.cyanBright(`[ONLINE USERS]`),
        socket.onlineUsersIds
      );

      this.namespace.emit(
        "get_online_users",
        Object.fromEntries(socket.idToStatusMap)
      );

      socket.broadcast.emit("online_user", {
        user_id: socket.userId,
        timestamp: new Date(),
        status: "offline",
      });
    };
  }

  /**
   * Handles typing indicators by notifying the recipient when a user
   * starts or stops typing in a chat.
   *
   * @function handleTyping
   * @memberof PresenceHandler
   *
   * @param {Socket} socket - The connected socket instance representing the user.
   * @returns {Function} A function that processes typing events.
   *
   * @callback typingCallback
   * @param {TypingEvent} data - The typing event data.
   *
   * @fires socket#typing - Emits typing status to the intended recipient.
   *
   * @description
   * - Validates the recipient ID.
   * - Constructs a typing payload containing the user ID, name, status, and timestamp.
   * - Emits the typing event to the recipient's personal room.
   */
  handleTyping(socket) {
    return (data) => {
      if (!data.recipient_id) return;

      const typingData = {
        user_id: socket.userId,
        user_name: socket.user.name,
        status: data.status,
        timestamp: new Date(),
      };

      socket.to(`user_${data.recipient_id}`).emit("typing", typingData);
    };
  }
}
