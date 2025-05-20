// src/app/admin/manage-magazine/page.tsx
import ManageMagazineContent from "@/components/admin/ManageMagazineContent";

export default function ManageMagazinePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin: Manage Magazine Content</h1>
      <ManageMagazineContent />
    </main>
  );
}

