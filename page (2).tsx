import AdminPdfUpload from "@/components/AdminPdfUpload";

export default function AdminUploadPage() {
  // Add authentication/authorization checks here in a real application
  // For now, we assume the user is authorized if they reach this page.

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin - Upload PDF</h1>
      <AdminPdfUpload />
    </main>
  );
}

