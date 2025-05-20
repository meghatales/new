# MeghaTales Website - Editing Guide

This document provides instructions for editing and extending the MeghaTales website.

## Project Structure

The project follows the Next.js App Router structure:

```
meghatales-app/
├── public/            # Static assets
├── src/
│   ├── app/           # App router pages and layouts
│   │   ├── layout.tsx # Root layout
│   │   ├── page.tsx   # Home page
│   │   ├── auth/      # Authentication pages
│   │   ├── bookstore/ # Bookstore pages
│   │   ├── pdf-library/ # PDF Library pages
│   │   ├── education/ # Education section pages
│   │   ├── magazine/  # Magazine section pages
│   │   ├── admin/     # Admin pages
│   │   └── dashboard/ # User dashboard pages
│   ├── components/    # Reusable components
│   │   ├── auth/      # Authentication components
│   │   ├── layout/    # Layout components
│   │   ├── theme/     # Theme components
│   │   ├── admin/     # Admin components
│   │   └── dashboard/ # Dashboard components
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utility functions and libraries
│       └── firebase.ts # Firebase configuration
└── next.config.ts     # Next.js configuration
```

## Key Components and Files

### Firebase Configuration

The Firebase configuration is in `src/lib/firebase.ts`. Update this file with your Firebase credentials.

### Authentication

- `src/components/auth/LoginForm.tsx`: Email and Google login form
- `src/components/auth/SignUpForm.tsx`: User registration form
- `src/components/auth/AuthGuard.tsx`: Component to protect routes that require authentication
- `src/hooks/useAuth.ts`: Custom hook for authentication state

### PDF Library

- `src/components/PdfLibrary.tsx`: Main component for displaying PDFs
- `src/components/AdminPdfUpload.tsx`: Component for admin to upload PDFs

### Bookstore

- `src/components/Bookstore.tsx`: Main component for the bookstore
- Book data is stored in Firestore

### Education Section

- `src/components/EducationSection.tsx`: Main component for education resources
- `src/components/AdminEducationPdfUpload.tsx`: Component for uploading educational PDFs

### Magazine Section

- `src/components/MagazineSection.tsx`: Main component for the magazine
- `src/components/admin/ManageMagazineContent.tsx`: Admin component for managing magazine content

### User Dashboard

- `src/components/dashboard/UserDashboard.tsx`: User dashboard component

## Adding New Features

### Adding a New Page

1. Create a new directory in `src/app/` for your page
2. Add a `page.tsx` file with your page component
3. Update navigation in `src/components/layout/Navbar.tsx` to include your new page

### Adding a New Component

1. Create a new file in the appropriate directory under `src/components/`
2. Import and use your component in the relevant page or other components

### Adding New Firebase Collections

1. Update the Firebase security rules to include your new collection
2. Use the Firestore API to interact with your new collection

## Styling

The project uses Tailwind CSS for styling. You can:

1. Add Tailwind classes directly to components
2. Create new utility classes in `src/app/globals.css`
3. Extend the Tailwind configuration in `tailwind.config.js`

## Common Tasks

### Updating the Homepage

Edit `src/app/page.tsx` to update the homepage content.

### Adding New Book Categories

1. Update the category list in `src/components/Bookstore.tsx`
2. Add new books to the Firestore database with the new category

### Modifying the PDF Preview Timer

The 30-minute preview timer logic is in `src/components/PdfLibrary.tsx`. Modify the timer duration or reset logic there.

### Changing Payment Options

The payment placeholder is in various components. Replace with your actual payment gateway integration.

### Adding Admin Users

Admin users are managed through Firebase Authentication. You can:
1. Set custom claims in Firebase Authentication
2. Create an admin role in your Firestore database

## Troubleshooting

### Firebase Connection Issues

- Check your Firebase configuration in `src/lib/firebase.ts`
- Ensure your Firebase project has the necessary services enabled
- Verify your security rules allow the operations you're trying to perform

### Build Errors

- Run `npm run lint` to check for linting errors
- Check for TypeScript errors with `npm run type-check`
- Ensure all required environment variables are set

### Authentication Problems

- Check Firebase Authentication settings
- Verify authorized domains in Firebase console
- Check browser console for errors

## Best Practices

1. Always test changes locally before deploying
2. Use TypeScript types for all components and functions
3. Keep components small and focused on a single responsibility
4. Use React hooks for shared logic
5. Follow the Next.js App Router patterns for routing and layouts
6. Use server components where possible for better performance
7. Keep Firebase security rules up to date with your data model
