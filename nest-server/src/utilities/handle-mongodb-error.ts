import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';
import { MongoServerError } from 'mongodb';

export async function handleMongoDbErrors<T>(
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    // Duplicate key error
    if (error instanceof MongoServerError && error.code === 11000) {
      const fields = Object.keys(error.keyPattern || {});
      throw new ConflictException(
        `${fields.join(', ') || 'Resource'} already exists`,
      );
    }

    // Validation error
    if (error instanceof MongooseError.ValidationError) {
      throw new BadRequestException(
        Object.values(error.errors).map((e) => e.message),
      );
    }

    // Cast error (invalid ObjectId)
    if (error instanceof MongooseError.CastError) {
      throw new BadRequestException(`Invalid value for field '${error.path}'`);
    }

    // Unknown error
    if (error instanceof Error) {
      throw new InternalServerErrorException(error.message);
    }

    throw new InternalServerErrorException('Database operation failed');
  }
}
