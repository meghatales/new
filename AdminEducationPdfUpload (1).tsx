
// This component will be similar to AdminPdfUpload.tsx but tailored for educational materials
// It will handle file uploads to a specific Firebase Storage path (e.g., /educationPdfs)
// and create corresponding entries in a Firestore collection (e.g., `studyMaterials`)
// with fields like title, category, subcategory, description, and fileUrl.

// src/components/AdminEducationPdfUpload.tsx

`use client`;

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore, storage } from "@/lib/firebase";

const educationCategories = ["School", "College", "University"];
const subcategoriesMap: { [key: string]: string[] } = {
  School: ["Class 10", "Class 12", "Entrance Exams", "Other School Material"],
  College: ["Arts", "Science", "Commerce", "Engineering", "Medical", "Other College Material"],
  University: ["Humanities", "Sciences", "Technology", "Management", "Law", "Other University Material"],
};

const AdminEducationPdfUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(educationCategories[0]);
  const [subcategory, setSubcategory] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setSubcategory(''); // Reset subcategory when category changes
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !title || !category) {
      setError("Please select a file, provide a title, and choose a category.");
      return;
    }
    if (category !== "School" && category !== "College" && category !== "University") {
        setError("Invalid category selected.");
        return;
    }

    setUploading(true);
    setError(null);
    setSuccessMessage(null);

    const storageRef = ref(storage, `educationPdfs/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload error: ", error);
        setError(`Upload failed: ${error.message}`);
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(firestore, "studyMaterials"), {
            title,
            description,
            category,
            subcategory: subcategory || null, // Store empty string or null if not selected
            fileUrl: downloadURL,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: serverTimestamp(),
          });
          setSuccessMessage(`Successfully uploaded "${title}"!`);
          setFile(null);
          setTitle('');
          setDescription('');
          setCategory(educationCategories[0]);
          setSubcategory('');
          setProgress(0);
          // Clear the file input
          const fileInput = document.getElementById('educationPdfFile') as HTMLInputElement;
          if (fileInput) fileInput.value = "";

        } catch (dbError) {
          console.error("Firestore error: ", dbError);
          setError(`Failed to save PDF details to database: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
        }
        setUploading(false);
      }
    );
  };

  const currentSubcategories = subcategoriesMap[category] || [];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">Upload Educational PDF</h2>
      {error && <p className="text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 p-3 rounded-md mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300 p-3 rounded-md mb-4">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category:</label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {educationCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {currentSubcategories.length > 0 && (
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subcategory (Optional):</label>
            <select
              id="subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">-- Select Subcategory --</option>
              {currentSubcategories.map(subcat => (
                <option key={subcat} value={subcat}>{subcat}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="educationPdfFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">PDF File:</label>
          <input
            type="file"
            id="educationPdfFile"
            onChange={handleFileChange}
            accept=".pdf"
            required
            className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-800 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-700"
          />
        </div>
        {uploading && (
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            <p className="text-xs text-center mt-1">Uploading: {Math.round(progress)}%</p>
          </div>
        )}
        <button
          type="submit"
          disabled={uploading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 dark:disabled:bg-gray-500"
        >
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>
    </div>
  );
};

export default AdminEducationPdfUpload;

