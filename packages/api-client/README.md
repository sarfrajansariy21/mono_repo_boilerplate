# 📡 API Client

A shared Axios-based service for communicating with the `user-auth-api`.

## Features
- **Centralized Interceptors**: Handles `Authorization` headers and 401 Unauthorized responses globally.
- **In-Memory Token Management**: Provides a secure closure for storing access tokens during the session.
- **Pre-configured Instance**: Easy `createApiClient()` factory for different environments.

## Usage

```typescript
import { createApiClient, setAccessToken } from '@monorepo/api-client';

const api = createApiClient('https://api.example.com');

// Set token after login
setAccessToken('your.jwt.token');

// All subsequent calls automatically include the token
const response = await api.get('/auth/me');
```
