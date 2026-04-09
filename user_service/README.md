# 🔐 NestJS User Authentication API

A production-level REST API built with **NestJS + TypeScript** covering JWT authentication, refresh tokens, role-based access control, and more.

---

## 📁 Project Structure

```
src/
├── auth/
│   ├── decorators/
│   │   ├── get-user.decorator.ts     ← @GetUser() param decorator
│   │   ├── public.decorator.ts       ← @Public() to skip auth
│   │   └── roles.decorator.ts        ← @Roles() for RBAC
│   ├── dto/
│   │   └── auth.dto.ts               ← LoginDto, RefreshTokenDto, ChangePasswordDto
│   ├── guards/
│   │   ├── jwt-auth.guard.ts         ← Protects routes globally
│   │   ├── jwt-refresh.guard.ts      ← For refresh token endpoint
│   │   └── roles.guard.ts            ← Role-based access
│   ├── strategies/
│   │   ├── jwt.strategy.ts           ← Validates access tokens
│   │   └── jwt-refresh.strategy.ts   ← Validates refresh tokens
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── auth.service.spec.ts          ← Unit tests
│
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts        ← Validation + Swagger docs
│   │   └── update-user.dto.ts
│   ├── entities/
│   │   └── user.entity.ts            ← TypeORM entity with hooks
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
│
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts  ← Global error handler
│   └── interceptors/
│       ├── logging.interceptor.ts    ← Request/response logging
│       └── transform.interceptor.ts  ← Standard response envelope
│
├── config/
│   └── app.config.ts                 ← Typed config factory
│
├── app.module.ts                     ← Root module
└── main.ts                           ← Bootstrap with Swagger
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secrets
```

### 3. Create PostgreSQL database
```sql
CREATE DATABASE nest_auth_db;
```

### 4. Run the app
```bash
# Development (with hot reload)
npm run start:dev

# Production build
npm run build && npm run start:prod
```

### 5. Open Swagger docs
```
http://localhost:3000/api/v1/docs
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint                    | Auth Required | Description                  |
|--------|-----------------------------|---------------|------------------------------|
| POST   | `/api/v1/auth/register`     | ❌ Public     | Register new user            |
| POST   | `/api/v1/auth/login`        | ❌ Public     | Login, get tokens            |
| POST   | `/api/v1/auth/refresh`      | Refresh Token | Get new access token         |
| POST   | `/api/v1/auth/logout`       | ✅ JWT        | Invalidate refresh token     |
| POST   | `/api/v1/auth/change-password` | ✅ JWT     | Change password              |
| GET    | `/api/v1/auth/me`           | ✅ JWT        | Get current user             |

### Users
| Method | Endpoint                    | Auth Required | Description                  |
|--------|-----------------------------|---------------|------------------------------|
| GET    | `/api/v1/users`             | ✅ Admin only | Get all users                |
| GET    | `/api/v1/users/me`          | ✅ JWT        | Get own profile              |
| GET    | `/api/v1/users/:id`         | ✅ JWT        | Get user by ID               |
| PATCH  | `/api/v1/users/:id`         | ✅ JWT        | Update user                  |
| DELETE | `/api/v1/users/:id`         | ✅ JWT        | Soft-delete user             |

---

## 🔑 Auth Flow

```
Register/Login
    │
    ▼
Returns { accessToken (15m), refreshToken (7d) }
    │
    ├── Use accessToken in:  Authorization: Bearer <token>
    │
    └── When accessToken expires:
            POST /auth/refresh  { refreshToken: "..." }
                │
                ▼
            New { accessToken, refreshToken }
```

---

## 🏗️ Key Concepts Covered

| Concept              | Where                              |
|----------------------|------------------------------------|
| Modules              | `app.module.ts`, `auth.module.ts`  |
| Controllers          | `auth.controller.ts`               |
| Services             | `auth.service.ts`                  |
| DTOs + Validation    | `dto/` folders                     |
| JWT Auth Guard       | `guards/jwt-auth.guard.ts`         |
| Roles Guard (RBAC)   | `guards/roles.guard.ts`            |
| Custom Decorators    | `decorators/` folder               |
| TypeORM Entity       | `user.entity.ts`                   |
| Exception Filter     | `http-exception.filter.ts`         |
| Interceptors         | `logging`, `transform`             |
| Config Module        | `app.config.ts`                    |
| Swagger Docs         | `main.ts`                          |
| Unit Tests           | `auth.service.spec.ts`             |

---

## 🧪 Running Tests

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

---

## 🔒 Security Best Practices Implemented

- ✅ Passwords hashed with **bcrypt** (10 salt rounds)
- ✅ Access tokens short-lived (**15 minutes**)
- ✅ Refresh token rotation on every use
- ✅ Refresh token **invalidated on logout**
- ✅ `@Exclude()` on sensitive fields (password, refreshToken)
- ✅ `whitelist: true` on ValidationPipe (strips unknown fields)
- ✅ Soft delete (user data preserved, access revoked)
- ✅ Global JWT guard with `@Public()` opt-out pattern
- ✅ Role-based access control (admin vs user)

---

## 📦 Next Steps

1. **Add rate limiting** → `@nestjs/throttler`
2. **Email verification** → Nodemailer + verification token
3. **Password reset** → Time-limited reset tokens
4. **Refresh token hashing** → Hash stored refresh tokens with bcrypt
5. **Database migrations** → Replace `synchronize: true` with TypeORM migrations
6. **Docker** → Add `Dockerfile` + `docker-compose.yml`
7. **Environment validation** → `joi` schema for `.env`