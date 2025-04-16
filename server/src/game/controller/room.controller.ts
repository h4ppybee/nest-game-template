import { Controller, Post } from '@nestjs/common';
import { RoomService } from '../room/room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('get_rooms')
  getRooms() {
    const rooms = this.roomService.getRooms();
    return {
      rooms,
    };
  }
}
