import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { handleMongoDbErrors } from 'src/utilities/handle-mongodb-error';
import { User, UserDocument } from '../schema/users.schema';
import { CreateUserDto } from '../dto/create-user';

/**
 * Users Repository
 * ----------------
 *
 * It is responsible for `interacting with the database`.
 * handle error and exceptions regarding the database.
 */
@Injectable()
export class UsersRepo {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  createUser(user: CreateUserDto): Promise<UserDocument | null> {
    return handleMongoDbErrors(() => this.userModel.create(user));
  }

  findAllUsers(): Promise<UserDocument[]> {
    return handleMongoDbErrors(() => this.userModel.find());
  }

  findUserById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return handleMongoDbErrors(() =>
      this.userModel.findById(new Types.ObjectId(id)),
    );
  }

  findUserByEmail(email: string): Promise<UserDocument | null> {
    return handleMongoDbErrors(() => this.userModel.findOne({ email }));
  }

  findUserByName(name: string): Promise<UserDocument | null> {
    return handleMongoDbErrors(() => this.userModel.findOne({ name }));
  }

  updateUserById(
    id: string | Types.ObjectId,
    user: Partial<User>,
  ): Promise<UserDocument | null> {
    return handleMongoDbErrors(() =>
      this.userModel.findByIdAndUpdate(new Types.ObjectId(id), user),
    );
  }

  deleteUserById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return handleMongoDbErrors(() =>
      this.userModel.findByIdAndDelete(new Types.ObjectId(id)),
    );
  }

  searchForAUser(
    q: string,
    currentUserId: string | Types.ObjectId,
  ): Promise<UserDocument[]> {
    return handleMongoDbErrors(() =>
      this.userModel
        .find({
          $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }],
          _id: { $ne: new Types.ObjectId(currentUserId) },
        })
        .limit(10),
    );
  }
}
