
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '@/lib/firebase'; // Assuming firebase config

// Interfaces for Magazine Content (can be expanded)
interface MagazinePost {
  id: string;
  title: string;
  type: 'Photo' | 'Blog' | 'Feature Article' | 'Story';
  author?: string;
  content?: string; // For blogs, articles, stories
  imageUrl?: string; // For photos, or header images for articles
  publishedAt: any; // Firestore Timestamp
  // Add other relevant fields like summary, tags, etc.
}

const contentTypes: MagazinePost['type'][] = ['Photo', 'Blog', 'Feature Article', 'Story'];

const MagazineSection = () => {
  const [posts, setPosts] = useState<MagazinePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<MagazinePost['type'] | 'All'>('All');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const postsCollection = collection(firestore, 'magazinePosts');
        let q = query(postsCollection, orderBy('publishedAt', 'desc'));

        if (selectedType !== 'All') {
          q = query(postsCollection, where('type', '==', selectedType), orderBy('publishedAt', 'desc'));
        }
        
        // You might want to add pagination here in a real app (e.g., using limit() and startAfter())
        // For now, let's fetch a reasonable number of recent posts
        q = query(q, limit(20)); 

        const querySnapshot = await getDocs(q);
        const postsData: MagazinePost[] = [];
        querySnapshot.forEach((doc) => {
          postsData.push({ id: doc.id, ...doc.data() } as MagazinePost);
        });
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching magazine posts: ", err);
        setError('Failed to load magazine content. Please try again later.');
      }
      setLoading(false);
    };

    fetchPosts();
  }, [selectedType]);

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return 'Date not available';
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="space-y-12">
      {/* Admin Upload Link - Placeholder */}
      <div className="text-right mb-6">
        <Link href="/admin/manage-magazine" legacyBehavior>
          <a className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded transition-colors">
            Admin: Manage Magazine Content
          </a>
        </Link>
      </div>

      {/* Content Type Filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-4">
        <button
          onClick={() => setSelectedType('All')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${selectedType === 'All'
              ? 'bg-teal-600 text-white dark:bg-teal-500'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}
          `}
        >
          All Content
        </button>
        {contentTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${selectedType === type
                ? 'bg-teal-600 text-white dark:bg-teal-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}
            `}
          >
            {type}s
          </button>
        ))}
      </div>

      {error && <p className="text-center text-red-500 py-10">{error}</p>}

      {/* Magazine Posts Grid/List */}
      {loading ? (
        <p className="text-center py-10">Loading magazine content...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          No {selectedType !== 'All' ? selectedType.toLowerCase() : ''} content found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 flex flex-col">
              {post.imageUrl && (
                // In a real app, use Next/Image for optimization
                <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover" />
              )}
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase mb-1">{post.type}</span>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100 truncate" title={post.title}>{post.title}</h3>
                {post.author && <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">By: {post.author}</p>}
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Published: {formatDate(post.publishedAt)}</p>
                {post.content && post.type !== 'Photo' && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-4 flex-grow">
                    {/* Basic way to render content, consider markdown or rich text parser for real app */}
                    {post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}
                  </p>
                )}
                {/* Link to full post page - to be created if needed */}
                <Link href={`/magazine/${post.id}`} legacyBehavior>
                  <a className="mt-auto text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold self-start">
                    Read More &rarr;
                  </a>
                </Link>
                {/* Share buttons - placeholder */}
                <div className="mt-4 pt-3 border-t dark:border-gray-700 text-xs">
                  <button onClick={() => alert(`Sharing ${post.title} - Placeholder`)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-2">Share</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MagazineSection;

