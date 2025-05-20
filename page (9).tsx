// src/app/auth/login/page.tsx
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="container mx-auto px-4 py-12 flex justify-center items-start min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign In</h1>
        <LoginForm />
      </div>
    </main>
  );
}

