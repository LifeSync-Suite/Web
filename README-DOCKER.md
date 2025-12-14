# Docker Setup for LifeSync Web Application

This document provides instructions for running the LifeSync web application using Docker containers.

## Prerequisites

- [Docker](https://www.docker.com/get-started) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## Files Overview

- `Dockerfile` - Multi-stage production build
- `Dockerfile.dev` - Development build with hot reload
- `docker-compose.yml` - Orchestration for both development and production containers
- `.dockerignore` - Files to exclude from Docker build context

## Quick Start

### 1. Setup Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and set your API endpoint:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENV=development
```

### 2. Run Development Container

Start the development container with hot reload:

```bash
docker-compose up lifesync-web-dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

**Features:**
- Hot module replacement (HMR)
- Source code mounted as volume
- Automatic restart on file changes
- Node modules cached in container volume

### 3. Run Production Container (Optional)

To test the production build locally:

```bash
docker-compose --profile production up lifesync-web-prod
```

The production build will be available at [http://localhost:3001](http://localhost:3001)

## Docker Commands

### Build Images

```bash
# Build development image
docker-compose build lifesync-web-dev

# Build production image
docker-compose build lifesync-web-prod
```

### Start Containers

```bash
# Start in foreground (with logs)
docker-compose up lifesync-web-dev

# Start in background (detached mode)
docker-compose up -d lifesync-web-dev

# Start production container
docker-compose --profile production up -d lifesync-web-prod
```

### Stop Containers

```bash
# Stop running containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs

```bash
# View logs for development container
docker-compose logs -f lifesync-web-dev

# View logs for production container
docker-compose logs -f lifesync-web-prod
```

### Execute Commands in Running Container

```bash
# Open shell in running container
docker-compose exec lifesync-web-dev sh

# Install new package
docker-compose exec lifesync-web-dev pnpm add axios

# Run linter
docker-compose exec lifesync-web-dev pnpm lint

# Generate API types
docker-compose exec lifesync-web-dev pnpm generate:api
```

### Rebuild Container

If you make changes to Dockerfile or dependencies:

```bash
# Rebuild and restart
docker-compose up --build lifesync-web-dev

# Force rebuild from scratch (no cache)
docker-compose build --no-cache lifesync-web-dev
docker-compose up lifesync-web-dev
```

## Development Workflow

### Install New Dependencies

When you install new packages, they're automatically added to the container volume:

```bash
# Inside the container
docker-compose exec lifesync-web-dev pnpm add some-package

# Or restart container to pick up changes from package.json
docker-compose restart lifesync-web-dev
```

### Running Scripts

```bash
# Generate API types from swagger
docker-compose exec lifesync-web-dev pnpm generate:api

# Build icons
docker-compose exec lifesync-web-dev pnpm build:icons

# Run linter
docker-compose exec lifesync-web-dev pnpm lint

# Fix linting issues
docker-compose exec lifesync-web-dev pnpm lint:fix

# Format code
docker-compose exec lifesync-web-dev pnpm format
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "3002:3000"  # Change 3002 to any available port
```

### Container Won't Start

1. Check logs:
   ```bash
   docker-compose logs lifesync-web-dev
   ```

2. Remove old containers and volumes:
   ```bash
   docker-compose down -v
   docker-compose up --build lifesync-web-dev
   ```

### Changes Not Reflecting

1. Ensure volumes are mounted correctly in `docker-compose.yml`
2. Restart the container:
   ```bash
   docker-compose restart lifesync-web-dev
   ```

### Permission Issues

If you encounter permission issues with node_modules:

```bash
# Remove node_modules and rebuild
docker-compose down -v
docker-compose up --build lifesync-web-dev
```

### Out of Memory

Increase Docker memory limit in Docker Desktop settings (minimum 4GB recommended).

## Production Deployment

### Build Production Image

```bash
docker build -t lifesync-web:latest -f Dockerfile .
```

### Run Production Container

```bash
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.lifesync.app/api \
  -e NEXT_PUBLIC_ENV=production \
  --name lifesync-web \
  lifesync-web:latest
```

### Using Docker Compose in Production

Create a `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  lifesync-web:
    image: lifesync-web:latest
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_BASE_URL=https://api.lifesync.app/api
      - NEXT_PUBLIC_ENV=production
    restart: always
```

Run with:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Remote API endpoint | `http://localhost:4000/api` |
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | `30000` |
| `NEXT_PUBLIC_ENV` | Environment name | `development` |
| `BASEPATH` | Base path for the app | `` (empty) |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` |

## Network Configuration

The docker-compose setup creates a bridge network called `lifesync-network`. This allows:

- Communication between web app and other LifeSync services (if running in Docker)
- Isolation from other Docker networks
- Easy integration with reverse proxies (nginx, traefik, etc.)

To connect the LifeSync API backend:

```yaml
# Add to docker-compose.yml
services:
  lifesync-api:
    image: lifesync-api:latest
    networks:
      - lifesync-network
```

## Performance Tips

1. **Use volume caching**: The compose file already excludes `node_modules` from host mounting for better performance
2. **Increase Docker resources**: Allocate at least 4GB RAM and 2 CPU cores
3. **Use production build for testing**: The multi-stage Dockerfile creates optimized builds
4. **Leverage layer caching**: Keep `package.json` changes minimal to use cached layers

## Security Considerations

- Production image runs as non-root user (`nextjs`)
- Use environment variables for sensitive data (never commit secrets)
- JWT tokens are stored in httpOnly cookies (managed by the app)
- Regular security updates: rebuild images periodically

## Additional Resources

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [LifeSync API Documentation](swagger.json)
