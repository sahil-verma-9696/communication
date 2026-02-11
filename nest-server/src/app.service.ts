import { Injectable } from '@nestjs/common';
import { AiService } from './ai/ai.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AppService {
  constructor(
    private readonly aiService: AiService,
    private eventEmitter: EventEmitter2,
  ) {}
  getHello(): string {
    // const embedding = await this.aiService.checkGeminiHealth();

    // console.log(embedding);

    this.eventEmitter.emit('test', 'hello');

    return `Hello World!`;
  }

  @OnEvent('test')
  handleMessageCreated(payload: any) {
    console.log('Event Received : ', payload);
  }
}
