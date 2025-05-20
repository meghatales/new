
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/lib/firebase'; // Assuming firebase config

// Interfaces (can be expanded and moved to a types file)
interface StudyMaterial {
  id: string;
  title: string;
  category: 'School' | 'College' | 'University';
  subcategory?: string; // e.g., Stream, Subject
  description?: string;
  fileUrl: string; // URL to the PDF in Firebase Storage
  // Add other relevant fields like author, publication date, etc.
}

interface EducationalBook {
  id: string;
  title: string;
  author: string;
  category: 'School' | 'College' | 'University';
  subcategory?: string;
  price: number;
  coverImage?: string;
  description?: string;
  // Similar to Bookstore's Book interface
}

const educationCategories = ['All', 'Schools', 'Colleges', 'Universities'];
// Placeholder subcategories - in a real app, these might be dynamic based on category
const subcategoriesMap: { [key: string]: string[] } = {
  Schools: ['All Subjects', 'Class 10', 'Class 12', 'Entrance Exams'],
  Colleges: ['All Streams', 'Arts', 'Science', 'Commerce', 'Engineering', 'Medical'],
  Universities: ['All Fields', 'Humanities', 'Sciences', 'Technology', 'Management', 'Law'],
};

const EducationSection = () => {
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [educationalBooks, setEducationalBooks] = useState<EducationalBook[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');

  // Fetch Study Materials (PDFs)
  useEffect(() => {
    const fetchMaterials = async () => {
      setLoadingMaterials(true);
      setError(null);
      try {
        const materialsCollection = collection(firestore, 'studyMaterials'); // Collection name for PDFs
        let q = query(materialsCollection);
        if (selectedCategory !== 'All') {
          q = query(q, where('category', '==', selectedCategory));
        }
        if (selectedSubcategory !== 'All' && selectedCategory !== 'All') {
          q = query(q, where('subcategory', '==', selectedSubcategory));
        }
        const querySnapshot = await getDocs(q);
        const materialsData: StudyMaterial[] = [];
        querySnapshot.forEach((doc) => {
          materialsData.push({ id: doc.id, ...doc.data() } as StudyMaterial);
        });
        setStudyMaterials(materialsData);
      } catch (err) {
        console.error("Error fetching study materials: ", err);
        setError('Failed to load study materials. Please try again later.');
      }
      setLoadingMaterials(false);
    };
    fetchMaterials();
  }, [selectedCategory, selectedSubcategory]);

  // Fetch Educational Books (Physical Books)
  useEffect(() => {
    const fetchBooks = async () => {
      setLoadingBooks(true);
      // setError(null); // Error state might be shared or separate
      try {
        const booksCollection = collection(firestore, 'educationalBooks'); // Collection for physical edu books
        let q = query(booksCollection);
        if (selectedCategory !== 'All') {
          q = query(q, where('category', '==', selectedCategory));
        }
        if (selectedSubcategory !== 'All' && selectedCategory !== 'All') {
          q = query(q, where('subcategory', '==', selectedSubcategory));
        }
        const querySnapshot = await getDocs(q);
        const booksData: EducationalBook[] = [];
        querySnapshot.forEach((doc) => {
          booksData.push({ id: doc.id, ...doc.data() } as EducationalBook);
        });
        setEducationalBooks(booksData);
      } catch (err) {
        console.error("Error fetching educational books: ", err);
        // setError('Failed to load educational books. Please try again later.');
      }
      setLoadingBooks(false);
    };
    fetchBooks();
  }, [selectedCategory, selectedSubcategory]);

  const currentSubcategories = selectedCategory !== 'All' ? ['All', ...(subcategoriesMap[selectedCategory] || [])] : [];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory('All'); // Reset subcategory when category changes
  };
  
  // Placeholder for Admin PDF Upload - Link to an admin page
  // This would be similar to AdminPdfUpload.tsx but for educational materials

  return (
    <div className="space-y-12">
      {/* Filters */}
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Filter by Category:</h3>
          <div className="flex flex-wrap gap-3">
            {educationCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${selectedCategory === cat
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                    : 'bg-white text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border dark:border-gray-600'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {selectedCategory !== 'All' && currentSubcategories.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Filter by {selectedCategory} Subcategory:</h3>
            <div className="flex flex-wrap gap-3">
              {currentSubcategories.map((subcat) => (
                <button
                  key={subcat}
                  onClick={() => setSelectedSubcategory(subcat)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${selectedSubcategory === subcat
                      ? 'bg-indigo-500 text-white dark:bg-indigo-400'
                      : 'bg-white text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 border dark:border-gray-500'}
                  `}
                >
                  {subcat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Admin Upload Link - Placeholder */}
      <div className="text-right mb-6">
        <Link href="/admin/upload-education-pdf" legacyBehavior>
          <a className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors">
            Admin: Upload Study Material (PDF)
          </a>
        </Link>
      </div>

      {error && <p className="text-center text-red-500 py-10">{error}</p>}

      {/* Study Materials (PDFs) Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 border-b pb-3 dark:border-gray-700">Study Materials (PDFs)</h2>
        {loadingMaterials ? (
          <p className="text-center py-6">Loading study materials...</p>
        ) : studyMaterials.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">No study materials found for the selected filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyMaterials.map((material) => (
              <div key={material.id} className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 flex flex-col">
                <h3 className="text-lg font-semibold mb-1 text-indigo-700 dark:text-indigo-400 truncate" title={material.title}>{material.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Category: {material.category}</p>
                {material.subcategory && <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">Subcategory: {material.subcategory}</p>}
                {material.description && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-3 flex-grow">{material.description}</p>}
                <a 
                  href={material.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto block text-center w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                  // Add subscription/purchase logic here later, similar to PDF Library
                >
                  View/Download PDF (Placeholder)
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Educational Books (Physical) Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 border-b pb-3 dark:border-gray-700">Educational Books (Purchase)</h2>
        {loadingBooks ? (
          <p className="text-center py-6">Loading educational books...</p>
        ) : educationalBooks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">No educational books found for the selected filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {educationalBooks.map((book) => (
              // Similar card structure to Bookstore.tsx
              <div key={book.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 flex flex-col">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-full h-56 object-cover" />
                ) : (
                  <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No Image</span>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-md font-semibold mb-1 truncate" title={book.title}>{book.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">By: {book.author}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">Category: {book.category}</p>
                  {book.subcategory && <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">Sub: {book.subcategory}</p>}
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-3">₹{book.price.toFixed(2)}</p>
                  {/* Add to cart button - needs cart context/logic similar to Bookstore */}
                  <button
                    // onClick={() => addToCart(book)} // Assuming a shared cart or separate education cart
                    onClick={() => alert(`Adding ${book.title} to cart - Placeholder`)}
                    className="mt-auto w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default EducationSection;

