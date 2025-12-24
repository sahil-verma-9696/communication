import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { User } from './schema/users.schema';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserId = new Types.ObjectId().toString();

  const mockUser = {
    _id: mockUserId,
    email: 'test@mail.com',
    passwordHash: 'hashed-password',
    comparePassword: jest.fn(),
  };

  /**
   * Mock mongoose query builder
   */
  const mockQuery = (result: any) => ({
    select: jest.fn().mockResolvedValue(result),
  });

  const mockUserModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ----------------------------
  // CREATE
  // ----------------------------
  describe('create()', () => {
    it('should create user and return user without password', async () => {
      mockUserModel.create.mockResolvedValue({ _id: mockUserId });

      jest.spyOn(service, 'findOne').mockResolvedValue({
        _id: mockUserId,
        email: mockUser.email,
      } as any);

      const result = await service.create({
        email: mockUser.email,
        password: '123456',
      } as any);

      expect(mockUserModel.create).toHaveBeenCalled();
      expect(service.findOne).toHaveBeenCalledWith(mockUserId);
      expect(result.email).toBe(mockUser.email);
    });

    it('should throw if user creation fails', async () => {
      mockUserModel.create.mockResolvedValue(null);

      await expect(
        service.create({ email: 'a@b.com', password: '123' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ----------------------------
  // FIND ALL
  // ----------------------------
  describe('findAll()', () => {
    it('should return all users', async () => {
      mockUserModel.find.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(result.length).toBe(1);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });

  // ----------------------------
  // FIND ONE
  // ----------------------------
  describe('findOne()', () => {
    it('should return user by id', async () => {
      mockUserModel.findById.mockReturnValue(
        mockQuery({ _id: mockUserId, email: mockUser.email }),
      );

      const result = await service.findOne(mockUserId);

      expect(result.email).toBe(mockUser.email);
      expect(mockUserModel.findById).toHaveBeenCalledWith(
        new Types.ObjectId(mockUserId),
      );
    });

    it('should throw if user not found', async () => {
      mockUserModel.findById.mockReturnValue(mockQuery(null));

      await expect(service.findOne(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ----------------------------
  // VERIFY PASSWORD
  // ----------------------------
  describe('verfiyPassword()', () => {
    it('should return true if password matches', async () => {
      mockUser.comparePassword.mockResolvedValue(true);

      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.verfiyPassword(mockUserId, '123456');

      expect(result).toBe(true);
      expect(mockUser.comparePassword).toHaveBeenCalledWith('123456');
    });

    it('should throw if user not found', async () => {
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(service.verfiyPassword(mockUserId, '123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ----------------------------
  // GET BY EMAIL
  // ----------------------------
  describe('getUserByEmail()', () => {
    it('should return user by email', async () => {
      mockUserModel.findOne.mockReturnValue(
        mockQuery({ email: mockUser.email }),
      );

      const result = await service.getUserByEmail(mockUser.email);

      expect(result.email).toBe(mockUser.email);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: mockUser.email,
      });
    });

    it('should throw if user not found', async () => {
      mockUserModel.findOne.mockReturnValue(mockQuery(null));

      await expect(service.getUserByEmail('not@found.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ----------------------------
  // UPDATE
  // ----------------------------
  describe('update()', () => {
    it('should update user', async () => {
      mockUserModel.findByIdAndUpdate.mockReturnValue(
        mockQuery({ email: 'updated@mail.com' }),
      );

      const result = await service.update(mockUserId, {
        email: 'updated@mail.com',
      } as any);

      expect(result.email).toBe('updated@mail.com');
    });

    it('should throw if update fails', async () => {
      mockUserModel.findByIdAndUpdate.mockReturnValue(mockQuery(null));

      await expect(
        service.update(mockUserId, { email: 'x' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ----------------------------
  // REMOVE
  // ----------------------------
  describe('remove()', () => {
    it('should delete user', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue(mockUser);

      const result = await service.remove(mockUserId);

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(
        new Types.ObjectId(mockUserId),
      );
      expect(result).toEqual(mockUser);
    });
  });
});
