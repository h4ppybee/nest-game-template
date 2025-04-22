import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ReqCreateRoom {
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsString()
  password?: string;
}
