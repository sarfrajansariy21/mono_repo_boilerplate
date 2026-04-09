// src/auth/auth.service.ts
import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    user: Partial<User>;
    tokens: AuthTokens;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    // ─── Register ─────────────────────────────────────────────────────────
    async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
        const user = await this.usersService.create(createUserDto);
        const tokens = await this.generateTokens(user);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            user: this.sanitizeUser(user),
            tokens,
        };
    }

    // ─── Login ────────────────────────────────────────────────────────────
    async login(loginDto: LoginDto): Promise<AuthResponse> {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        const tokens = await this.generateTokens(user);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            user: this.sanitizeUser(user),
            tokens,
        };
    }

    // ─── Refresh Tokens ───────────────────────────────────────────────────
    async refreshTokens(userId: string): Promise<AuthTokens> {
        const user = await this.usersService.findOne(userId);

        if (!user || !user.isActive || !user.refreshToken) {
            throw new UnauthorizedException('Access denied');
        }

        const tokens = await this.generateTokens(user);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    // ─── Logout ───────────────────────────────────────────────────────────
    async logout(userId: string): Promise<{ message: string }> {
        await this.usersService.updateRefreshToken(userId, null);
        return { message: 'Logged out successfully' };
    }

    // ─── Change Password ──────────────────────────────────────────────────
    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string,
    ): Promise<{ message: string }> {
        const user = await this.usersService.findOne(userId);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new BadRequestException('Current password is incorrect');
        }

        if (currentPassword === newPassword) {
            throw new ConflictException('New password must differ from current password');
        }

        // Hash and save
        const hashed = await bcrypt.hash(
            newPassword,
            this.configService.get<number>('bcrypt.saltRounds') ?? 10,
        );

        await this.usersService.update(userId, { firstName: user.firstName }); // trigger save
        // Direct password update (bypassing DTO restriction)
        const userRepo = (this.usersService as any).usersRepository;
        await userRepo.update(userId, { password: hashed, refreshToken: null });

        return { message: 'Password changed successfully. Please login again.' };
    }

    // ─── Validate user (used by login) ───────────────────────────────────
    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Your account has been deactivated');
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return user;
    }

    // ─── Token generation ─────────────────────────────────────────────────
    private async generateTokens(user: User): Promise<AuthTokens> {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('jwt.secret'),
                expiresIn: this.configService.get<string>('jwt.expiresIn'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('jwt.refreshSecret'),
                expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
            }),
        ]);

        return { accessToken, refreshToken };
    }

    // ─── Strip sensitive fields from user ────────────────────────────────
    private sanitizeUser(user: User): Partial<User> {
        const { password, refreshToken, ...safe } = user as any;
        return safe;
    }
}