import { UserRole } from '@monorepo/types';
export { UserRole };
export declare class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
    get fullName(): string;
    hashPassword(): Promise<void>;
    validatePassword(plainPassword: string): Promise<boolean>;
}
