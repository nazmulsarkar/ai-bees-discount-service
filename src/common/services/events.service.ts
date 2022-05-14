import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Pusher from 'pusher';
import { TriggerEventDto } from '../dto/events.dto';
import { EventChannel, EventType } from '../enums/pusher-events.enum';
import { ChatEventDto } from '../types/chat-event.dto';
import { NotificationEventDto } from '../types/notification-event.type';

@Injectable()
export class EventsService {
  private pusher: Pusher;

  constructor(private readonly configService: ConfigService) {
    this.pusher = new Pusher({
      appId: this.configService.get('PUSHER_APP_ID'),
      key: this.configService.get('PUSHER_KEY'),
      secret: this.configService.get('PUSHER_SECRET'),
      cluster: this.configService.get('PUSHER_CLUSTER'),
      useTLS: true,
    });
  }

  public async creatNotificationEvent(payload: NotificationEventDto) {
    const CHANNEL = `${
      EventChannel.NOTIFICATION
    }${payload.recipientId.toString()}`;

    console.log(CHANNEL);

    await this.triggerEvent({
      channel: CHANNEL,
      event: EventType.NEW_NOTIFICATION,
      data: {
        notification: payload.notification,
        unreadCound: payload.unreadCount,
      },
    });
  }

  public async unreadCountEvent({
    unreadCount,
    recipientId,
  }: Omit<NotificationEventDto, 'notification'>) {
    const CHANNEL = `${EventChannel.NOTIFICATION}${recipientId.toString()}`;

    await this.triggerEvent({
      channel: CHANNEL,
      event: EventType.UNREAD_NOTI_COUNT,
      data: {
        unreadCound: unreadCount,
      },
    });
  }

  public async newChatEvent({ roomId, payload }: ChatEventDto) {
    const CHANNEL = `${EventChannel.CHAT}${roomId.toString()}`;

    await this.triggerEvent({
      channel: CHANNEL,
      event: EventType.NEW_CHAT,
      data: payload,
    });
  }

  public async triggerEvent({ channel, event, data }: TriggerEventDto) {
    return this.pusher.trigger(channel, event, {
      ...data,
    });
  }
}
