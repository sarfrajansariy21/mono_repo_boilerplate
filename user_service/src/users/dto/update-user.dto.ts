// src/users/dto/update-user.dto.ts
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// All fields optional, but password cannot be updated via this DTO
// (use a dedicated change-password endpoint instead)
export class UpdateUserDto extends PartialType(
    OmitType(CreateUserDto, ['password'] as const),
) { }