import { PartialType } from '@nestjs/mapped-types';
import { User } from '../schema/users.schema';

export class UpdateUserDto extends PartialType(User) {}
