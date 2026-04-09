# 🚀 Production Deployment Guide

This document outlines the steps required to deploy the NestJS Monorepo to a production environment using **Docker** and **Docker Compose**.

---

## 📋 Prerequisites

1.  **Server**: A Linux VPS (Ubuntu 22.04+ recommended) with at least 2GB RAM.
2.  **Tools**: 
    - [Docker](https://docs.docker.com/engine/install/)
    - [Docker Compose](https://docs.docker.com/compose/install/)
3.  **Database**: A PostgreSQL instance (local or managed).

---

## 🛠️ Step 1: Environment Configuration

Create a `.env.production` file in the root directory:

```env
# Database
DB_URL=postgresql://user:password@host:port/dbname?sslmode=require

# Secrets
JWT_SECRET=your_super_secret_access_token_key
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key

# App Names (Should match package.json names)
WEB_APP=web-service
ADMIN_APP=admin-service
BACKEND_APP=user-auth-api
```

---

## 🏗️ Step 2: Deployment Commands

### 1. Build and Run
From the root directory, run:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 2. Verify Status
Check if all containers are healthy:
```bash
docker-compose -f docker-compose.prod.yml ps
```

### 3. Monitoring Logs
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🌐 Step 3: Domain & DNS

The Nginx configuration is set to listen on port 80. You should point your DNS records to your server's IP:

- `example.com` -> Server IP
- `admin.example.com` -> Server IP
- `api.example.com` -> Server IP

> [!TIP]
> **SSL (HTTPS)**: Use [Certbot](https://certbot.eff.org/) with the Nginx plugin to automatically fetch and configure SSL certificates for your domains.

---

## 🔄 Lifecycle Management

### Updating the App
To deploy new changes without manually stopping everything:
```bash
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

### Database Migrations
If you have new migrations, run them inside the backend container:
```bash
docker-compose -f docker-compose.prod.yml exec api npm run migration:run
```

---

## 🛡️ Best Practices Checklist

- [ ] Disable `DB_SYNCHRONIZE` in production (use migrations).
- [ ] Use strong, unique secrets for JWT.
- [ ] Configure a firewall (ufw) to allow only ports 80, 443, and 22.
- [ ] Setup log rotation for Docker.
