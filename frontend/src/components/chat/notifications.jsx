"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatSocketContext } from "@/contexts/ChatSocket";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/contexts/Global";

export function Notifications({ onMarkAllAsRead }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user } = useGlobalContext();
  const { socket } = useChatSocketContext();

  // 🔔 WebSocket handler for new notifications
  useEffect(() => {
    if (!socket) return;
    const wsNotificationHandler = (data) => {
      console.log("new_notification:", data);
      setUnreadCount(data.count);
    };
    socket.on("new_notification", wsNotificationHandler);
    return () => {
      socket.off("new_notification", wsNotificationHandler);
    };
  }, [socket]);

  // 🔥 Fetch notifications only when dropdown opens
  const handleOpenChange = async (open) => {
    if (open) {
      await getUnreadedNotifications(
        user._id,
        setNotifications,
        setUnreadCount
      );
    }
  };

  const onMarkAsRead = (notificationId) => {
    return async (e) => {
      await markNotificationAsRead(notificationId);
    };
  };

  const onDelete = (notificationId, setNotifications) => async (e) => {
    setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    await deleteNotification(notificationId);
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-transparent"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-3 border-b last:border-b-0 ${
                        !n.is_read ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-sm">
                              {n.type + " by " + n.metadata?.sender_name}
                            </p>
                            {!n.is_read && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {n.metadata?.message_preview}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(n.created_at).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex space-x-1">
                          {!n.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={onMarkAsRead?.(n._id, setNotifications)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDelete?.(n._id, setNotifications)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function getUnreadedNotifications(
  userId,
  setNotification,
  setUnreadCount
) {
  const res = await fetch(
    `http://localhost:8000/notifications/user/${userId}`,
    {
      credentials: "include",
    }
  );
  const data = await res.json();
  console.log("fetched:", data);
  setNotification(data.data.notifications);
  setUnreadCount(data.data.notifications.filter((n) => !n.is_read).length);
}

async function markNotificationAsRead(notificationId) {
  await fetch(`http://localhost:8000/notifications/${notificationId}/read`, {
    method: "PUT",
    credentials: "include",
  });
}

async function deleteNotification(notificationId) {
  await fetch(`http://localhost:8000/notifications/${notificationId}`, {
    method: "DELETE",
    credentials: "include",
  });
}
