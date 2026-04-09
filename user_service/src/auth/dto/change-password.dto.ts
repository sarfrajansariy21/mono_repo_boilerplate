// src/auth/dto/change-password.dto.ts
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiProperty({ example: 'OldPass@123' })
    @IsString()
    currentPassword: string;

    @ApiProperty({ example: 'NewPass@456' })
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: 'Password too weak',
    })
    newPassword: string;
}
