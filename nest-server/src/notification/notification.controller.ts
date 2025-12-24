import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import * as authGuard from 'src/auth/auth.guard';

@Controller('notifications')
@UseGuards(authGuard.AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // ------------------------------------
  // GET ALL NOTIFICATIONS (USER)
  // ------------------------------------
  @Get()
  async getMyNotifications(@Request() req: authGuard.AuthRequest) {
    const userId = req.user.sub;
    return this.notificationService.getUserNotifications(userId);
  }

  // ------------------------------------
  // GET UNREAD COUNT
  // ------------------------------------
  @Get('unread-count')
  async getUnreadCount(@Request() req: authGuard.AuthRequest) {
    const userId = req.user.sub;
    return {
      count: await this.notificationService.getUnreadCount(userId),
    };
  }

  // ------------------------------------
  // MARK ONE AS READ
  // ------------------------------------
  @Patch(':id/read')
  async markAsRead(
    @Request() req: authGuard.AuthRequest,
    @Param('id') notificationId: string,
  ) {
    const userId = req.user.sub;
    return this.notificationService.markAsRead(userId, notificationId);
  }

  // ------------------------------------
  // MARK ALL AS READ
  // ------------------------------------
  @Patch('read-all')
  async markAllAsRead(@Request() req: authGuard.AuthRequest) {
    const userId = req.user.sub;
    return this.notificationService.markAllAsRead(userId);
  }

  // ------------------------------------
  // DELETE NOTIFICATION
  // ------------------------------------
  @Delete(':id')
  async deleteNotification(
    @Request() req: authGuard.AuthRequest,
    @Param('id') notificationId: string,
  ) {
    const userId = req.user.sub;
    return this.notificationService.remove(userId, notificationId);
  }
}
