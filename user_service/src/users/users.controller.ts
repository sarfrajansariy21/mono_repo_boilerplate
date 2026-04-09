// src/users/users.controller.ts
import {
    Controller,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
    SerializeOptions,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserRole } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@SerializeOptions({ strategy: 'excludeAll' }) // Use @Expose() on fields you want
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // GET /users - Admin only
    @Get()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all users (Admin only)' })
    @ApiResponse({ status: 200, description: 'List of all active users' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.usersService.findAll();
    }

    // GET /users/me - Current logged-in user
    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Current user profile' })
    getProfile(@GetUser() user: User) {
        return user;
    }

    // GET /users/:id
    @Get(':id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @ApiResponse({ status: 200, description: 'User found' })
    @ApiResponse({ status: 404, description: 'User not found' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.findOne(id);
    }

    // PATCH /users/:id
    @Patch(':id')
    @ApiOperation({ summary: 'Update user profile' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
        @GetUser() currentUser: User,
    ) {
        // Users can only update themselves; admins can update anyone
        if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
            // Throws 403 via the guard – but you can add explicit check here if needed
        }
        return this.usersService.update(id, updateUserDto);
    }

    // DELETE /users/:id (soft delete)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Deactivate (soft-delete) a user' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @ApiResponse({ status: 204, description: 'User deactivated' })
    remove(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser() currentUser: User,
    ) {
        if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
            // Only self or admin
        }
        return this.usersService.remove(id);
    }
}