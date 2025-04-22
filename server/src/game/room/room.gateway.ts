import { NotFoundException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Room } from './room.schema';
import { RoomService } from './room.service';

@WebSocketGateway()
export class RoomGateway {
  constructor(private readonly roomService: RoomService) {}

  @SubscribeMessage('enterRoom')
  handleEnterRoom(@MessageBody() data: Room, @ConnectedSocket() client: Socket) {
    const room = this.roomService.findRoom(data.id);
    if (!room) {
      throw new NotFoundException(`Room not found: ${data.id}`);
    }

    this.roomService.joinRoom(room.id, client.id);

    const members = this.roomService.getMembers(room.id);
    client.join(room.id);
    client.to(room.id).emit('roomMembers', members);
    client.emit('roomMembers', members);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
    const room = this.roomService.findRoom(data.roomId);
    if (!room) {
      throw new NotFoundException(`Room not found: ${data.roomId}`);
    }

    this.roomService.leaveRoom(room.id, client.id);

    const members = this.roomService.getMembers(room.id);
    client.leave(room.id);
    client.to(room.id).emit('roomMembers', members);
    client.emit('roomMembers', []);
  }
}
