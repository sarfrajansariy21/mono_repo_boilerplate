// src/users/users.service.ts
import {
    Injectable,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    // ─── Create ──────────────────────────────────────────────────────────
    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email.toLowerCase() },
        });

        if (existingUser) {
            throw new ConflictException('A user with this email already exists');
        }

        try {
            const user = this.usersRepository.create({
                ...createUserDto,
                email: createUserDto.email.toLowerCase(),
            });
            return await this.usersRepository.save(user);
        } catch {
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    // ─── Read ─────────────────────────────────────────────────────────────
    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException(`User with ID "${id}" not found`);
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email: email.toLowerCase() },
        });
    }

    // ─── Update ──────────────────────────────────────────────────────────
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (updateUserDto.email) {
            const emailTaken = await this.usersRepository.findOne({
                where: { email: updateUserDto.email.toLowerCase() },
            });
            if (emailTaken && emailTaken.id !== id) {
                throw new ConflictException('Email is already in use');
            }
        }

        Object.assign(user, {
            ...updateUserDto,
            email: updateUserDto.email?.toLowerCase() ?? user.email,
        });

        return this.usersRepository.save(user);
    }

    // ─── Refresh token ────────────────────────────────────────────────────
    async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
        await this.usersRepository.update(id, { refreshToken });
    }

    // ─── Soft delete (deactivate) ─────────────────────────────────────────
    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        user.isActive = false;
        user.refreshToken = null;
        await this.usersRepository.save(user);
    }
}