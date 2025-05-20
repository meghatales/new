// src/components/admin/ManageMagazineContent.tsx
`use client`;

import { useState, useEffect, FormEvent } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { firestore, storage } from '@/lib/firebase';

interface MagazinePost {
  id: string;
  title: string;
  type: 'Photo' | 'Blog' | 'Feature Article' | 'Story';
  author?: string;
  content?: string;
  imageUrl?: string;
  imageFileName?: string; // To store the file name for deletion
  publishedAt: any; 
}

const contentTypes: MagazinePost['type'][] = ['Photo', 'Blog', 'Feature Article', 'Story'];

const ManageMagazineContent = () => {
  const [posts, setPosts] = useState<MagazinePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for adding/editing posts
  const [isEditing, setIsEditing] = useState<MagazinePost | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MagazinePost['type']>(contentTypes[0]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(firestore, 'magazinePosts'), orderBy('publishedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MagazinePost));
      setPosts(postsData);
    } catch (err) {
      console.error("Error fetching posts: ", err);
      setError('Failed to load magazine posts.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setCurrentImageUrl(URL.createObjectURL(e.target.files[0])); // Preview new image
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setTitle('');
    setType(contentTypes[0]);
    setAuthor('');
    setContent('');
    setImageFile(null);
    setCurrentImageUrl(undefined);
    setUploadProgress(0);
    setIsSubmitting(false);
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !type) {
      setError('Title and Type are required.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    let finalImageUrl = isEditing?.imageUrl || undefined;
    let finalImageFileName = isEditing?.imageFileName || undefined;

    try {
      if (imageFile) {
        // If there's an old image and we're uploading a new one, delete the old one from storage
        if (isEditing && isEditing.imageFileName) {
          const oldImageRef = ref(storage, `magazineImages/${isEditing.imageFileName}`);
          try {
            await deleteObject(oldImageRef);
          } catch (deleteErr) {
            console.warn("Could not delete old image: ", deleteErr);
            // Continue even if old image deletion fails
          }
        }

        const newImageFileName = `${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, `magazineImages/${newImageFileName}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        finalImageUrl = await new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            (error) => {
              console.error("Upload error: ", error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
        finalImageFileName = newImageFileName;
      }

      const postData: Omit<MagazinePost, 'id' | 'publishedAt'> & { publishedAt?: any } = {
        title,
        type,
        author: author || undefined,
        content: content || undefined,
        imageUrl: finalImageUrl,
        imageFileName: finalImageFileName,
      };

      if (isEditing) {
        const postRef = doc(firestore, 'magazinePosts', isEditing.id);
        await updateDoc(postRef, {
          ...postData,
          // publishedAt will not be updated on edit, or set to serverTimestamp() if you want to track last modified
        });
      } else {
        postData.publishedAt = serverTimestamp();
        await addDoc(collection(firestore, 'magazinePosts'), postData);
      }
      
      resetForm();
      fetchPosts(); // Refresh the list
    } catch (err) {
      console.error("Error submitting post: ", err);
      setError(`Failed to ${isEditing ? 'update' : 'add'} post. ${err instanceof Error ? err.message : ''}`);
    }
    setIsSubmitting(false);
  };

  const handleEdit = (post: MagazinePost) => {
    setIsEditing(post);
    setTitle(post.title);
    setType(post.type);
    setAuthor(post.author || '');
    setContent(post.content || '');
    setCurrentImageUrl(post.imageUrl);
    setImageFile(null); // Clear file input, user must re-select if they want to change image
  };

  const handleDelete = async (postId: string, imageFileName?: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      if (imageFileName) {
        const imageRef = ref(storage, `magazineImages/${imageFileName}`);
        await deleteObject(imageRef).catch(err => console.warn("Could not delete image from storage: ", err));
      }
      await deleteDoc(doc(firestore, 'magazinePosts', postId));
      fetchPosts(); // Refresh list
    } catch (err) {
      console.error("Error deleting post: ", err);
      setError('Failed to delete post.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Form for Adding/Editing Posts */}
      <form onSubmit={handleSubmit} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{isEditing ? 'Edit' : 'Add New'} Magazine Post</h3>
        {error && <p className="text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 p-2 rounded">{error}</p>}
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title*</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2" />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type*</label>
          <select id="type" value={type} onChange={e => setType(e.target.value as MagazinePost['type'])} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2">
            {contentTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
          <input type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2" />
        </div>

        {(type === 'Blog' || type === 'Feature Article' || type === 'Story') && (
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
            <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={6} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2"></textarea>
          </div>
        )}

        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image (for Photos, or header for articles/blogs)</label>
          <input type="file" id="imageFile" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-700 file:text-indigo-600 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-600" />
          {currentImageUrl && <img src={currentImageUrl} alt="Preview" className="mt-2 h-32 object-contain" />}
          {uploadProgress > 0 && uploadProgress < 100 && <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2"><div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${uploadProgress}%`}}></div></div>}
        </div>

        <div className="flex items-center space-x-4">
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 dark:disabled:bg-gray-500">
            {isSubmitting ? 'Submitting...' : (isEditing ? 'Update Post' : 'Add Post')}
          </button>
          {isEditing && <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel Edit</button>}
        </div>
      </form>

      {/* List of Existing Posts */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Existing Magazine Posts</h3>
        {isLoading ? <p>Loading posts...</p> : posts.length === 0 ? <p>No posts found.</p> : (
          <ul className="space-y-4">
            {posts.map(post => (
              <li key={post.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{post.title} <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full ml-2">{post.type}</span></h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Author: {post.author || 'N/A'}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Published: {post.publishedAt?.toDate ? post.publishedAt.toDate().toLocaleDateString() : 'N/A'}</p>
                  {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="h-16 w-auto mt-2 rounded"/>}
                </div>
                <div className="space-x-2 flex-shrink-0 mt-1">
                  <button onClick={() => handleEdit(post)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
                  <button onClick={() => handleDelete(post.id, post.imageFileName)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageMagazineContent;

