# ✅ Validation

Shared validation logic and schemas used by both frontend forms and backend DTOs.

## Tech Stack
- **Class-Validator** (Backend usage)
- **Shared Schemas** (JSON-based or Zod-ready)

## Best Practices
- Define complex regex (passwords, emails) here so they don't drift between web and backend.
- Export standard error messages for internationalization consistency.
