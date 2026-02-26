# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Navigation - 一个现代化的人工智能网站导航系统，帮助用户发现、分享和管理优质的 AI 工具与资源。

## Common Commands

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint

# Database
npx prisma migrate dev  # Run database migrations
npx prisma studio       # Open Prisma database GUI

# Data Initialization
npm run init-data       # Initialize seed data (uses ts-node)
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router) + React 18 + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **UI**: Tailwind CSS + shadcn/ui (Radix UI primitives) + Framer Motion
- **State Management**: Jotai (atoms), React Query, SWR

### Route Structure
- `(admin)` - Admin panel routes (e.g., `/admin`, `/admin/settings`)
- `(app)` - Public app routes (e.g., `/about`, `/rankings`, `/submit`)
- `/api` - API routes (RESTful endpoints)

### Database Models (Prisma)
- `Website` - AI 网站数据 (title, url, description, thumbnail, visits, likes, status)
- `Category` - 分类 (name, slug)
- `Setting` - 站点设置 (key-value)
- `FooterLink` - 底部链接

### Key Files
- `prisma/schema.prisma` - Database schema
- `src/lib/db/db.ts` - Database utilities and caching
- `src/lib/tasks/cron.ts` - Scheduled tasks
- `src/lib/sync/` - Backup and OSS sync functionality

### Environment Variables
- `DATABASE_URL` / `DIRECT_URL` - PostgreSQL connection
- `ADMIN_PASSWORD` - Admin login password
- `JWT_SECRET` - JWT token secret
- `OSS_*` - Optional OSS backup configuration

## Development Notes

- Admin routes are under `/admin` with simple password authentication (JWT-based)
- Website status workflow: pending → approved/rejected
- Thumbnail generation uses Playwright for scraping website screenshots
- Theme support via `next-themes` with system/light/dark modes
