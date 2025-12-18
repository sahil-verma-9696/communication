export class NotificationHandler {
    constructor(notificationService) {
      this.notificationService = notificationService;
    }
  
    handleGetNotifications(socket) {
      return async () => {
        try {
          const notifications =
            await this.notificationService.getUnreadNotifications(socket.userId);
          socket.emit("notifications", {
            notifications,
            count: notifications.length,
          });
        } catch (error) {
          console.error("Get notifications error:", error);
          socket.emit("error", {
            event: "get_notifications",
            message: "Failed to get notifications",
          });
        }
      };
    }
  
    handleMarkNotificationsAsRead(socket) {
      return async (data) => {
        try {
          await this.notificationService.markNotificationsAsRead(
            data.notification_ids || [],
            socket.userId
          );
          socket.emit("notifications_marked_read", {
            notification_ids: data.notification_ids,
            confirmed: true,
          });
        } catch (error) {
          console.error("Mark notifications read error:", error);
          socket.emit("error", {
            event: "mark_notifications_read",
            message: "Failed to mark notifications as read",
          });
        }
      };
    }
  }