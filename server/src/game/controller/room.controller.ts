import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReqCreateRoom } from '../room/room.bean';
import { RoomService } from '../room/room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  getRooms() {
    const rooms = this.roomService.getRooms();
    return {
      rooms,
    };
  }

  @Post('create')
  createRoom(@Body() body: ReqCreateRoom) {
    const room = this.roomService.createRoom(body);
    return { room };
  }
}
