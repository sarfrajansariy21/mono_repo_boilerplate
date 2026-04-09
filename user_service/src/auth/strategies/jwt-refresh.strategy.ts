// src/auth/strategies/jwt-refresh.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.refreshSecret'),
            passReqToCallback: true, // So we can access req.body.refreshToken
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const refreshToken = req.body?.refreshToken as string;
        const user = await this.usersService.findOne(payload.sub);

        if (!user || !user.isActive || !user.refreshToken) {
            throw new UnauthorizedException('Refresh token is invalid or expired');
        }

        // Check stored refresh token matches (plain comparison — hash in production)
        if (user.refreshToken !== refreshToken) {
            throw new UnauthorizedException('Refresh token mismatch');
        }

        return { ...user, refreshToken };
    }
}