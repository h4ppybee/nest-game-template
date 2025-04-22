export interface Room {
  id: string; // 방 ID (UUID 등)
  name?: string; // 방 이름
  isPrivate?: boolean; // 비공개 여부
  password?: string; // 비공개 방 비밀번호
  members: string[]; // 현재 방에 들어있는 사용자 ID 목록
  createdAt: Date;
  updatedAt: Date;
}
