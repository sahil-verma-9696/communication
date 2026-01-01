import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MessageEmbedding,
  MessageEmbeddingSchema,
} from './schema/messageEmbeding.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MessageEmbedding.name,
        schema: MessageEmbeddingSchema,
      },
    ]),
  ],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
