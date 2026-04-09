// src/users/entities/user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '@monorepo/types';
export { UserRole };

@Entity('users')
export class User {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Expose()
    @Column({ unique: true, length: 100 })
    email: string;

    @Expose()
    @Column({ length: 50 })
    firstName: string;

    @Expose()
    @Column({ length: 50 })
    lastName: string;

    @Exclude() // Never expose password in responses
    @Column()
    password: string;

    @Expose()
    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Expose()
    @Column({ default: true })
    isActive: boolean;

    @Exclude()
    @Column({ type: 'text', nullable: true })
    refreshToken: string | null;

    @Expose()
    @CreateDateColumn()
    createdAt: Date;

    @Expose()
    @UpdateDateColumn()
    updatedAt: Date;

    // ─── Virtual getter ───────────────────────────────────────────────────
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    // ─── Hooks ───────────────────────────────────────────────────────────
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        // Only hash if the password field was actually changed
        if (this.password && !this.password.startsWith('$2b$')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    // ─── Helper method ───────────────────────────────────────────────────
    async validatePassword(plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, this.password);
    }
}