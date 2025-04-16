import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';

describe('RoomService', () => {
  let roomService: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService],
    }).compile();

    roomService = module.get<RoomService>(RoomService);
  });

  it('should create a room', () => {
    const room = roomService.createRoom({ name: 'Test Room', isPrivate: true, password: '1234' });
    expect(room).toBeDefined();
    expect(room.name).toBe('Test Room');
    expect(room.isPrivate).toBe(true);
    expect(room.password).toBe('1234');
  });

  it('should find a room by ID', () => {
    const room = roomService.createRoom();
    const foundRoom = roomService.findRoom(room.id);
    expect(foundRoom).toEqual(room);
  });

  it('should throw NotFoundException if room does not exist', () => {
    expect(() => roomService.getRoomOrFail('non-existent-id')).toThrow(NotFoundException);
  });

  it('should allow a player to join a room', () => {
    const room = roomService.createRoom({ isPrivate: false });
    const updatedRoom = roomService.joinRoom(room.id, 'player1');
    expect(updatedRoom.members).toContain('player1');
  });

  it('should throw BadRequestException for invalid password in private room', () => {
    const room = roomService.createRoom({ isPrivate: true, password: '1234' });
    expect(() => roomService.joinRoom(room.id, 'player1', 'wrong-password')).toThrow(BadRequestException);
  });

  it('should allow a player to leave a room', () => {
    const room = roomService.createRoom();
    roomService.joinRoom(room.id, 'player1');
    const updatedRoom = roomService.leaveRoom(room.id, 'player1');
    expect(updatedRoom.members).not.toContain('player1');
  });

  it('should delete a room', () => {
    const room = roomService.createRoom();
    roomService.removeRoom(room.id);
    expect(roomService.findRoom(room.id)).toBeNull();
  });

  it('should list all rooms', () => {
    roomService.createRoom({ name: 'Room 1' });
    roomService.createRoom({ name: 'Room 2' });
    const rooms = roomService.getRooms();
    expect(rooms.length).toBe(2);
    expect(rooms.map((r) => r.name)).toEqual(expect.arrayContaining(['Room 1', 'Room 2']));
  });
});
