import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CommonUtil } from '@root/common/common.util';
import { Room } from './room.schema';

@Injectable()
export class RoomService {
  /**
   * 메모리에 방을 저장하는 맵 (key: roomId, value: Room)
   * - 실제 운영환경에서는 DB에 저장
   * */
  private rooms: Map<string, Room> = new Map();

  /**
   * 방 생성
   * - 새로운 roomId를 생성
   * - Room 객체를 생성해 rooms 맵에 저장
   */
  createRoom(options?: { name?: string; isPrivate?: boolean; password?: string }): Room {
    const roomId = CommonUtil.uuid(); // 고유 ID (uuid) / 혹은 짧은 코드 등
    const now = new Date();

    const newRoom: Room = {
      id: roomId,
      name: options?.name || `Room-${roomId.slice(0, 6)}`,
      isPrivate: options?.isPrivate || false,
      password: options?.password,
      members: [],
      createdAt: now,
      updatedAt: now,
    };

    this.rooms.set(roomId, newRoom);
    return newRoom;
  }

  /**
   * 방 찾기
   * - 존재하지 않으면 null
   */
  findRoom(roomId: string): Room | null {
    const room = this.rooms.get(roomId);
    return room || null;
  }

  /**
   * 방이 존재하는지 확인 & 반환
   * - 존재하지 않으면 예외
   */
  getRoomOrFail(roomId: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new NotFoundException(`Room not found: ${roomId}`);
    }
    return room;
  }

  /**
   * 방에 입장
   * - 비공개 방이면 비밀번호 검증
   * - 이미 있는 플레이어인지 확인
   */
  joinRoom(roomId: string, playerId: string, password?: string): Room {
    const room = this.getRoomOrFail(roomId);

    // 비공개 방이면 비밀번호 확인
    if (room.isPrivate) {
      if (!password || password !== room.password) {
        throw new BadRequestException('Invalid room password.');
      }
    }

    // 이미 들어있는 사용자면 중복 방지
    if (room.members.includes(playerId)) {
      return room;
    }

    // 플레이어 추가
    room.members.push(playerId);
    room.updatedAt = new Date();
    this.rooms.set(roomId, room); // 수정사항 반영

    return room;
  }

  /**
   * 방에서 나가기
   */
  leaveRoom(roomId: string, playerId: string): Room {
    const room = this.getRoomOrFail(roomId);
    const idx = room.members.indexOf(playerId);
    if (idx !== -1) {
      room.members.splice(idx, 1);
      room.updatedAt = new Date();
      this.rooms.set(roomId, room);
    }
    return room;
  }

  /**
   * 방 삭제(폭파)
   * - 방장이 나가거나 게임 종료 시 호출 가능
   */
  removeRoom(roomId: string): void {
    const room = this.getRoomOrFail(roomId);
    this.rooms.delete(roomId);
  }

  /**
   * 방 목록 조회
   * - 실제 운영환경이라면 페이징/검색이 필요할 수 있음
   */
  getRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  getMembers(roomId: string): string[] {
    const room = this.getRoomOrFail(roomId);
    return room.members;
  }
}
