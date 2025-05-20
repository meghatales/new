

// Admin PDF Upload Component (Placeholder - to be on a separate admin route)
const AdminPdfUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("Fiction"); // Default genre
  const [subject, setSubject] = useState(""); // Optional for education
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !title || !genre) {
      setUploadError("Please provide a file, title, and genre.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      // 1. Upload file to Firebase Storage
      const storageRef = ref(storage, `pdfs/${Date.now()}_${file.name}`);
      const uploadTask = await import('firebase/storage').then(module => module.uploadBytes(storageRef, file));
      const downloadURL = await import('firebase/storage').then(module => module.getDownloadURL(uploadTask.ref));

      // 2. Add PDF metadata to Firestore
      const pdfsCollection = collection(firestore, 'pdfs');
      await import('firebase/firestore').then(module => module.addDoc(pdfsCollection, {
        title,
        genre,
        subject: subject || null, // Store as null if empty
        url: downloadURL,
        fileName: file.name,
        uploadedAt: import('firebase/firestore').then(module => module.serverTimestamp()),
      }));

      setUploadSuccess(`Successfully uploaded "${title}"!`);
      setTitle("");
      setGenre("Fiction");
      setSubject("");
      setFile(null);
      // Optionally, clear the file input
      const fileInput = document.getElementById('pdf-upload-input') as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (err) {
      console.error("Error uploading PDF: ", err);
      setUploadError("Failed to upload PDF. Please try again.");
    }
    setUploading(false);
  };

  const genresForUpload = ['Comics', 'Fiction', 'Fantasy', 'Horror', 'Biography', 'Education'];

  return (
    <div className="mt-12 p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Upload New PDF</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Genre:</label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {genresForUpload.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject (Optional, for Education genre):</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label htmlFor="pdf-upload-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">PDF File:</label>
          <input
            type="file"
            id="pdf-upload-input"
            accept=".pdf"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-600 file:text-indigo-700 dark:file:text-indigo-50 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-700"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
        {uploadError && <p className="text-sm text-red-600 text-center">{uploadError}</p>}
        {uploadSuccess && <p className="text-sm text-green-600 text-center">{uploadSuccess}</p>}
      </form>
    </div>
  );
};

