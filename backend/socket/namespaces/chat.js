import chalk from "chalk";
import { MessageService } from "../../services/MessageService.js";
import { NotificationService } from "../../services/NotificationService.js";
import { UserService } from "../../services/UserService.js";
import { MessageHandler } from "../handlers/MessageHandler.js";
import { NotificationHandler } from "../handlers/NotificationHandler.js";
import { PresenceHandler } from "../handlers/PresenceHandler.js";

export function chatNamespaceHandler(namespace) {
  // Initialize services
  const messageService = new MessageService();
  const notificationService = new NotificationService();
  const userService = new UserService();

  // Initialize handlers
  const presenceHandler = new PresenceHandler(namespace);
  const messageHandler = new MessageHandler(
    messageService,
    notificationService
  );
  const notificationHandler = new NotificationHandler(notificationService);

  return (socket) => {
    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Presence events
    socket.on("join_chat", presenceHandler.handleJoinChat(socket));
    socket.on("leave_chat", presenceHandler.handleLeaveChat(socket));
    socket.on("typing", presenceHandler.handleTyping(socket));

    // Message events
    socket.on("message", messageHandler.handleSendMessage(socket));

    // TODO
    socket.on("group_message", messageHandler.handleSendMessage(socket));
    
    socket.on("read", messageHandler.handleMarkAsRead(socket));
    socket.on("delete", messageHandler.handleDeleteMessage(socket));

    // Notification events
    socket.on(
      "get_notifications",
      notificationHandler.handleGetNotifications(socket)
    );
    socket.on(
      "mark_notifications_read",
      notificationHandler.handleMarkNotificationsAsRead(socket)
    );
  };
}
