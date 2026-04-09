import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto, ChangePasswordDto } from './dto';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("./auth.service").AuthResponse>;
    login(loginDto: LoginDto): Promise<import("./auth.service").AuthResponse>;
    refresh(user: User): Promise<import("./auth.service").AuthTokens>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getMe(user: User): User;
}
