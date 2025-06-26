# Database Setup with Prisma and PostgreSQL

This project uses Prisma ORM with PostgreSQL running in Docker. Follow these instructions to set up and use the database.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) installed on your machine
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) package manager

## Setup Instructions

### 1. Start the PostgreSQL Database

```bash
# Start the PostgreSQL container
docker-compose up -d
```

This will start a PostgreSQL database container with the configuration specified in the `docker-compose.yml` file.

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using pnpm
pnpm install
```

### 3. Generate Prisma Client

```bash
# Using npm
npm run prisma:generate

# Or using pnpm
pnpm prisma:generate
```

### 4. Push Schema to Database

For development, you can use db push to quickly update your database schema:

```bash
# Using npm
npm run db:push

# Or using pnpm
pnpm db:push
```

For production environments, use migrations instead:

```bash
# Using npm
npm run prisma:migrate

# Or using pnpm
pnpm prisma:migrate
```

### 5. Explore Your Database (Optional)

Prisma Studio provides a visual interface to view and edit your data:

```bash
# Using npm
npm run prisma:studio

# Or using pnpm
pnpm prisma:studio
```

This will open Prisma Studio in your browser at http://localhost:5555.

## Using Prisma in Your Code

Import the Prisma client in your code:

```typescript
import prisma from '@/lib/prisma';

// Example: Get all users
async function getUsers() {
  const users = await prisma.user.findMany();
  return users;
}

// Example: Create a user
async function createUser(data) {
  const user = await prisma.user.create({
    data,
  });
  return user;
}
```

## Database Schema

The database schema is defined in `prisma/schema.prisma`. To modify the schema:

1. Edit the `schema.prisma` file
2. Run `npm run db:push` or `npm run prisma:migrate` to update the database
3. Run `npm run prisma:generate` to update the Prisma client

## Environment Variables

The database connection is configured using the `DATABASE_URL` environment variable in the `.env` file:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/arc_db?schema=public"
```

For production, make sure to update this URL with your production database credentials.

## Troubleshooting

- **Connection Issues**: Ensure Docker is running and the PostgreSQL container is up
- **Schema Push Errors**: Check for conflicts in your schema or existing data
- **Prisma Client Generation Errors**: Make sure your schema is valid

For more help, refer to the [Prisma documentation](https://www.prisma.io/docs/).