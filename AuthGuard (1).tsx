// src/components/auth/AuthGuard.tsx
`use client`;

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        router.push('/auth/login'); // Redirect to login if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
        {/* You can replace this with a more sophisticated loading spinner */}
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the redirect in useEffect,
    // but as a fallback or if redirection is slow:
    return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-xl">Redirecting to login...</p>
        </div>
    ); 
  }

  return <>{children}</>; // Render children if authenticated
};

export default AuthGuard;

