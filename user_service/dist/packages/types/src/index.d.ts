export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}
export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}
export interface ApiResponse<T> {
    data: T;
    message: string;
    statusCode: number;
}
