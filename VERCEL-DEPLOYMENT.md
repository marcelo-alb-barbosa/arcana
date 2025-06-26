# Vercel Deployment Guide

This guide provides instructions for deploying the ARCANA project on Vercel.

## Prerequisites

- A Vercel account
- Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Import your Git repository
4. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: (leave as default, it's configured in vercel.json)
   - Output Directory: (leave as default, it's configured in vercel.json)

## Environment Variables

For security reasons, you should set the following environment variables in the Vercel dashboard under your project's "Settings" > "Environment Variables" section:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@host:port/database` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | A random string (use a generator) |
| `NEXTAUTH_URL` | Your production URL | `https://arcana-game.com` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | From Google Cloud Console |
| `INSTAGRAM_CLIENT_ID` | Instagram OAuth client ID | From Meta Developer Dashboard |
| `INSTAGRAM_CLIENT_SECRET` | Instagram OAuth client secret | From Meta Developer Dashboard |
| `STRIPE_SECRET_KEY` | Stripe secret API key | From Stripe Dashboard |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable API key | From Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | From Stripe Dashboard |

## Vercel Configuration

The project includes a `vercel.json` file that configures:

- Build command
- Output directory
- Framework detection
- Region deployment (Washington, D.C. - iad1)
- Clean URLs
- Security headers
- Caching rules for static assets
- API routing
- Environment variables for build time

## Database Setup

This project uses Prisma with PostgreSQL. You have two options for the database:

1. **Vercel Postgres**: You can use Vercel's built-in Postgres service
   - Go to "Storage" in your Vercel dashboard
   - Create a new Postgres database
   - Vercel will automatically set up the `DATABASE_URL` environment variable

2. **External PostgreSQL**: You can use any PostgreSQL provider
   - Set up a PostgreSQL database with your preferred provider
   - Add the connection string as the `DATABASE_URL` environment variable

## Troubleshooting

If you encounter build errors:

1. Check the build logs in the Vercel dashboard
2. Verify that all environment variables are correctly set
3. Ensure your database is accessible from Vercel's servers
4. Check that the Prisma schema is compatible with your database

## Production Checks

After deployment:

1. Verify that authentication works correctly
2. Test payment flows with Stripe test mode
3. Check that all pages load properly
4. Verify that API routes are functioning
5. Test the application on different devices and browsers