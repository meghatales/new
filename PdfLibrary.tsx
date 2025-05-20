'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore, storage } from '@/lib/firebase'; // Assuming firebase config is in lib/firebase.ts
import { ref, getDownloadURL } from 'firebase/storage';

interface PDFDoc {
  id: string;
  title: string;
  genre: string;
  subject?: string; // Optional, for education section
  url: string; // Download URL from Firebase Storage
  // Add other relevant fields like description, author, etc.
}

const PdfLibrary = () => {
  const [pdfs, setPdfs] = useState<PDFDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTimeLeft, setPreviewTimeLeft] = useState<number>(1800); // 30 minutes in seconds

  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true);
      setError(null);
      try {
        const pdfsCollection = collection(firestore, 'pdfs'); // 'pdfs' is the collection name
        let q = query(pdfsCollection);
        if (selectedGenre !== 'all') {
          q = query(pdfsCollection, where('genre', '==', selectedGenre));
        }
        const querySnapshot = await getDocs(q);
        const pdfsData: PDFDoc[] = [];
        querySnapshot.forEach((doc) => {
          pdfsData.push({ id: doc.id, ...doc.data() } as PDFDoc);
        });
        setPdfs(pdfsData);
      } catch (err) {
        console.error("Error fetching PDFs: ", err);
        setError('Failed to load PDFs. Please try again later.');
      }
      setLoading(false);
    };

    fetchPdfs();
  }, [selectedGenre]);

  // Placeholder for genres - this would ideally come from a config or another collection
  const genres = ['all', 'Comics', 'Fiction', 'Fantasy', 'Horror', 'Biography', 'Education'];

  const handlePreview = async (pdf: PDFDoc) => {
    // For simplicity, using the direct URL. In a real app, you might generate a temporary signed URL
    // or use a more secure preview mechanism if the PDFs are sensitive.
    setPreviewUrl(pdf.url);
    setPreviewTimeLeft(1800); // Reset timer for new preview
    // Start timer logic here (e.g., using setInterval)
  };

  const handleUnlock = (pdfId: string) => {
    // Placeholder for payment logic
    alert(`Unlock PDF ${pdfId} - Placeholder for payment of ₹50+`);
    // After successful payment, grant full access (e.g., set a flag in user's profile or local storage)
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (previewUrl && previewTimeLeft > 0) {
      timer = setInterval(() => {
        setPreviewTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (previewTimeLeft === 0 && previewUrl) {
      setPreviewUrl(null); // Pause access
      alert('Daily free preview time limit reached for this PDF.');
    }
    return () => clearInterval(timer);
  }, [previewUrl, previewTimeLeft]);

  if (loading) return <p className="text-center">Loading PDFs...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">PDF Preview</h2>
              <p>Time left: {Math.floor(previewTimeLeft / 60)}:{('0' + (previewTimeLeft % 60)).slice(-2)}</p>
              <button onClick={() => setPreviewUrl(null)} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">Close</button>
            </div>
            <iframe src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`} className="w-full h-full border-0" title="PDF Preview"></iframe>
            {previewTimeLeft === 0 && (
                <div className="mt-4 text-center">
                    <p className="mb-2">Preview time expired.</p>
                    <button 
                        onClick={() => handleUnlock('some_pdf_id')} // Replace 'some_pdf_id' with actual PDF ID
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Unlock Full PDF (₹50+)
                    </button>
                </div>
            )}
          </div>
        </div>
      )}

      {pdfs.length === 0 && !loading && (
        <p className="text-center">No PDFs found for the selected genre.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pdfs.map((pdf) => (
          <div key={pdf.id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-2 truncate" title={pdf.title}>{pdf.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Genre: {pdf.genre}</p>
            {pdf.subject && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Subject: {pdf.subject}</p>}
            {/* In a real app, you might show a thumbnail here */}
            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-2">
              <button
                onClick={() => handlePreview(pdf)}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Preview (30 min)
              </button>
              <button
                onClick={() => handleUnlock(pdf.id)}
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Unlock (₹50+)
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* TODO: Implement Admin PDF Upload functionality */}
      {/* This would typically be on a separate admin page/route */}
    </div>
  );
};

export default PdfLibrary;

