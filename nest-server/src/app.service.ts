import { Injectable } from '@nestjs/common';
import { AiService } from './ai/ai.service';

@Injectable()
export class AppService {
  constructor(private readonly aiService: AiService) {}
  async getHello(): Promise<string> {
    const embedding = await this.aiService.embedText('hello');

    console.log(embedding);

    return `Hello World! ${process.env.JWT_EXPIRATION_TIME}`;
  }
}
