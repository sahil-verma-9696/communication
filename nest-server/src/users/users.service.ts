import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(createUserDto: CreateUserDto) {
    const payload: User = {
      passwordHash: createUserDto.password,
      ...createUserDto,
    };
    const newUser = await this.userModel.create(payload);

    if (!newUser) {
      throw new NotFoundException('User not found');
    }

    const user = await this.findOne(newUser._id.toString());

    return user;
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    const ObjectId = new Types.ObjectId(id);
    const user = await this.userModel
      .findById(ObjectId)
      .select('-passwordHash');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * search users
   * ------------
   * query user by name or email, case insensitive
   * @param q
   * @returns Promise<User[]>
   */
  async searchUsers(q: string) {
    const regex = new RegExp(q, 'i');
    const users = await this.userModel
      .find({ $or: [{ name: regex }, { email: regex }] })
      .select('-passwordHash');
    return users;
  }

  async verfiyPassword(id: string, password: string) {
    const ObjectId = new Types.ObjectId(id);
    const user = await this.userModel
      .findById(ObjectId)
      .select('+passwordHash');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await user.comparePassword(password);

    return isMatch;
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ email })
      .select('-passwordHash');

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const ObjectId = new Types.ObjectId(id);
    const user = await this.userModel
      .findByIdAndUpdate(ObjectId, updateUserDto, { new: true })
      .select('-passwordHash');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  remove(id: string) {
    const ObjectId = new Types.ObjectId(id);
    return this.userModel.findByIdAndDelete(ObjectId);
  }
}
