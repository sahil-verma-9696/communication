import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import {
  FriendRequest,
  FriendRequestStatus,
} from '../schema/friendrequests.schema';
import { FriendRequestsService } from '../friendrequests.service';
import { FriendsService } from '../../friends/friends.service';

describe('FriendRequestsService', () => {
  let service: FriendRequestsService;

  const userId = new Types.ObjectId().toString();
  const friendId = new Types.ObjectId().toString();
  const requestId = new Types.ObjectId().toString();

  const mockFriendRequest = {
    _id: requestId,
    sender: new Types.ObjectId(userId),
    receiver: new Types.ObjectId(friendId),
    status: FriendRequestStatus.PENDING,
    save: jest.fn(),
  };

  const mockFriendRequestModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  };

  const mockFriendsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendRequestsService,
        {
          provide: getModelToken(FriendRequest.name),
          useValue: mockFriendRequestModel,
        },
        {
          provide: FriendsService,
          useValue: mockFriendsService,
        },
      ],
    }).compile();

    service = module.get<FriendRequestsService>(FriendRequestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ----------------------------------
  // SEND REQUEST
  // ----------------------------------
  describe('sendRequest()', () => {
    it('should throw if user sends request to self', async () => {
      await expect(service.sendRequest(userId, userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if pending request already exists', async () => {
      mockFriendRequestModel.findOne.mockResolvedValue({
        status: FriendRequestStatus.PENDING,
      });

      await expect(service.sendRequest(userId, friendId)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw if accepted request already exists', async () => {
      mockFriendRequestModel.findOne.mockResolvedValue({
        status: FriendRequestStatus.ACCEPTED,
      });

      await expect(service.sendRequest(userId, friendId)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should re-send request if previous request was rejected', async () => {
      const rejectedRequest = {
        ...mockFriendRequest,
        status: FriendRequestStatus.REJECTED,
        save: jest.fn(),
      };

      mockFriendRequestModel.findOne.mockResolvedValue(rejectedRequest);

      const result = await service.sendRequest(userId, friendId);

      expect(rejectedRequest.status).toBe(FriendRequestStatus.PENDING);
      expect(rejectedRequest.save).toHaveBeenCalled();
      expect(result).toBe(rejectedRequest);
    });

    it('should create new request if none exists', async () => {
      mockFriendRequestModel.findOne.mockResolvedValue(null);
      mockFriendRequestModel.create.mockResolvedValue(mockFriendRequest);

      const result = await service.sendRequest(userId, friendId);

      expect(mockFriendRequestModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockFriendRequest);
    });
  });

  // ----------------------------------
  // FIND ALL
  // ----------------------------------
  describe('findAll()', () => {
    it('should return incoming friend requests', async () => {
      mockFriendRequestModel.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([mockFriendRequest]),
      });

      const result = await service.findAll(friendId);

      expect(result.length).toBe(1);
    });
  });

  // ----------------------------------
  // FIND ONE
  // ----------------------------------
  describe('findOne()', () => {
    it('should return request if user is receiver', async () => {
      mockFriendRequestModel.findById.mockResolvedValue({
        ...mockFriendRequest,
        receiver: new Types.ObjectId(userId),
      });

      const result = await service.findOne(userId, requestId);

      expect(result).toBeDefined();
    });

    it('should throw if request not found', async () => {
      mockFriendRequestModel.findById.mockResolvedValue(null);

      await expect(service.findOne(userId, requestId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if user is not receiver', async () => {
      mockFriendRequestModel.findById.mockResolvedValue({
        ...mockFriendRequest,
        receiver: new Types.ObjectId(friendId),
      });

      await expect(service.findOne(userId, requestId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ----------------------------------
  // ACCEPT REQUEST
  // ----------------------------------
  describe('acceptRequest()', () => {
    it('should accept friend request and create friendship', async () => {
      const request = {
        ...mockFriendRequest,
        receiver: userId,
        status: FriendRequestStatus.PENDING,
        save: jest.fn(),
      };

      mockFriendRequestModel.findById.mockResolvedValue(request);
      mockFriendsService.create.mockResolvedValue({ id: 'friendship-id' });

      const result = await service.acceptRequest(userId, requestId);

      expect(request.status).toBe(FriendRequestStatus.ACCEPTED);
      expect(request.save).toHaveBeenCalled();
      expect(mockFriendsService.create).toHaveBeenCalled();
      expect(result.message).toBe('Friend request accepted');
    });

    it('should throw if request not found', async () => {
      mockFriendRequestModel.findById.mockResolvedValue(null);

      await expect(service.acceptRequest(userId, requestId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if user is not receiver', async () => {
      mockFriendRequestModel.findById.mockResolvedValue({
        ...mockFriendRequest,
        receiver: friendId,
      });

      await expect(service.acceptRequest(userId, requestId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw if friendship creation fails', async () => {
      const request = {
        ...mockFriendRequest,
        receiver: userId,
        status: FriendRequestStatus.PENDING,
        save: jest.fn(),
      };

      mockFriendRequestModel.findById.mockResolvedValue(request);
      mockFriendsService.create.mockResolvedValue(null);

      await expect(service.acceptRequest(userId, requestId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ----------------------------------
  // REJECT REQUEST
  // ----------------------------------
  describe('rejectRequest()', () => {
    it('should reject friend request', async () => {
      const request = {
        ...mockFriendRequest,
        receiver: userId,
        status: FriendRequestStatus.PENDING,
        save: jest.fn(),
      };

      mockFriendRequestModel.findById.mockResolvedValue(request);

      const result = await service.rejectRequest(userId, requestId);

      expect(request.status).toBe(FriendRequestStatus.REJECTED);
      expect(request.save).toHaveBeenCalled();
      expect(result.message).toBe('Friend request rejected');
    });

    it('should throw if request already processed', async () => {
      mockFriendRequestModel.findById.mockResolvedValue({
        ...mockFriendRequest,
        receiver: userId,
        status: FriendRequestStatus.ACCEPTED,
      });

      await expect(service.rejectRequest(userId, requestId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
