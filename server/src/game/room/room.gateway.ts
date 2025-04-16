import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Room } from './room.schema';
import { RoomService } from './room.service';

// chat.gateway.ts
@WebSocketGateway()
export class RoomGateway {
  constructor(private readonly roomService: RoomService) {}

  @SubscribeMessage('enterRoom')
  handleMessage(@MessageBody() data: Room, @ConnectedSocket() client: Socket) {
    const room = this.roomService.findRoom(data.id);
    if (!room) {
      this.roomService.createRoom(data);
    }

    this.roomService.joinRoom(room.id, client.id);

    const members = this.roomService.getMembers(room.id);
    client.emit('roomMembers', members);
  }
}
