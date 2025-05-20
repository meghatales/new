# MeghaTales Website Deployment Guide

This document provides instructions for deploying the MeghaTales website to Vercel or running it locally.

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git (optional, for version control)
- A Vercel account (for production deployment)
- Firebase account (for authentication, database, and storage)

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "MeghaTales"
3. Enable the following services:
   - Authentication (Email/Password and Google)
   - Firestore Database
   - Storage

4. Set up Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google Sign-In

5. Set up Firestore:
   - Create a Firestore database in production mode
   - Start with the following collections:
     - `users`
     - `books`
     - `pdfs`
     - `studyMaterials`
     - `magazinePosts`

6. Set up Storage:
   - Create storage buckets for:
     - PDF files
     - Book images
     - Magazine content

7. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app (create one if none exists)
   - Copy the Firebase configuration object

8. Create a `.env` file in the root of the project with the following variables (replace with your Firebase config):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment to Vercel

Vercel is the recommended platform for deploying Next.js applications.

1. Create an account on [Vercel](https://vercel.com) if you don't have one.

2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy the application:
   ```bash
   vercel
   ```

5. For production deployment:
   ```bash
   vercel --prod
   ```

6. Configure environment variables:
   - Go to your project on the Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add all the Firebase environment variables listed above

7. Custom domain setup:
   - Go to your project on the Vercel dashboard
   - Navigate to Settings > Domains
   - Add your custom domain (meghatales.xyz)
   - Follow the instructions to configure DNS settings with your domain registrar

## Alternative Deployment Options

### Static Export (for static hosting platforms)

1. Build the application:
   ```bash
   npm run build
   ```

2. Export the application:
   ```bash
   next export
   ```

3. The static site will be generated in the `out` directory, which can be deployed to any static hosting service.

### Node.js Server (for traditional hosting)

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

3. The server will run on port 3000 by default. You can use a process manager like PM2 to keep it running.

## Post-Deployment Tasks

1. Set up Firebase security rules for Firestore and Storage
2. Create admin accounts
3. Upload initial content (books, PDFs, magazine articles)
4. Test all features in the production environment
5. Set up monitoring and analytics

## Troubleshooting

- If you encounter build errors related to ESLint, you can disable ESLint during build by adding `eslint: { ignoreDuringBuilds: true }` to your `next.config.ts` file.
- For Firebase authentication issues, ensure that the authorized domains in Firebase Authentication settings include your deployment URL.
- For storage permission issues, check your Firebase Storage security rules.
