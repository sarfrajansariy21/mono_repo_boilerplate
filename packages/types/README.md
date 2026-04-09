# 📦 Shared Types

The single source of truth for all TypeScript types, interfaces, and enums used across the monorepo.

## Usage

### In Backend (NestJS)
```typescript
import { UserRole } from '@monorepo/types';
```

### In Frontend (React)
```typescript
import { User, ApiResponse } from '@monorepo/types';
```

## Structure
- `index.ts`: Core data models and enums.
- More files can be added as the domain grows (e.g., `product.types.ts`).

> [!IMPORTANT]
> Always update types here instead of local redeclarations to ensure end-to-end type safety.
