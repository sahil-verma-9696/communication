import { Injectable } from '@nestjs/common';
import { AiService } from './ai/ai.service';

@Injectable()
export class AppService {
  constructor(private readonly aiService: AiService) {}
  getHello(): string {
    // const embedding = await this.aiService.checkGeminiHealth();

    // console.log(embedding);

    return `Hello World!`;
  }
}
