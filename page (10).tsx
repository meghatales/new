// src/app/dashboard/page.tsx
import UserDashboard from "@/components/dashboard/UserDashboard";
import AuthGuard from "@/components/auth/AuthGuard"; // To protect the route

export default function DashboardPage() {
  return (
    <AuthGuard>
      <main className="container mx-auto px-4 py-8">
        <UserDashboard />
      </main>
    </AuthGuard>
  );
}

