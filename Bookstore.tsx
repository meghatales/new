
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase'; // Assuming firebase config is in lib/firebase.ts

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  coverImage?: string; // URL to cover image
  description?: string;
  // Add other relevant fields like ISBN, publisher, publicationDate, etc.
}

interface CartItem extends Book {
  quantity: number;
}

const genres = ['All', 'Comics', 'Fiction', 'Fantasy', 'Horror', 'Biography'];

const Bookstore = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const booksCollection = collection(firestore, 'books');
        let q = query(booksCollection);
        if (selectedGenre !== 'All') {
          q = query(booksCollection, where('genre', '==', selectedGenre));
        }
        const querySnapshot = await getDocs(q);
        const booksData: Book[] = [];
        querySnapshot.forEach((doc) => {
          booksData.push({ id: doc.id, ...doc.data() } as Book);
        });
        setBooks(booksData);
      } catch (err) {
        console.error("Error fetching books: ", err);
        setError('Failed to load books. Please try again later.');
      }
      setLoading(false);
    };

    fetchBooks();
  }, [selectedGenre]);

  const addToCart = (book: Book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === book.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...book, quantity: 1 }];
      }
    });
    // For now, just log, in real app this might show a notification
    console.log(`Added ${book.title} to cart.`);
  };

  const removeFromCart = (bookId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prevCart => prevCart.map(item =>
      item.id === bookId ? { ...item, quantity } : item
    ));
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    // Placeholder for checkout logic - API integration needed
    alert(`Checkout initiated for a total of ₹${cartTotal.toFixed(2)}. This is a placeholder.`);
    // Clear cart after successful checkout (in a real scenario)
    // setCart([]); 
  };

  if (loading) return <p className="text-center py-10">Loading books...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div className="relative">
      {/* Genre Filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-4">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${selectedGenre === genre 
                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Book Grid */}
      {books.length === 0 && !loading && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">No books found for "{selectedGenre}" genre.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 flex flex-col">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full h-64 object-cover" />
            ) : (
              <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">No Image</span>
              </div>
            )}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-1 truncate" title={book.title}>{book.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">By: {book.author}</p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">Genre: {book.genre}</p>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">₹{book.price.toFixed(2)}</p>
              {book.description && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-3 flex-grow">{book.description}</p>}
              <button
                onClick={() => addToCart(book)}
                className="mt-auto w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shopping Cart Modal/Off-canvas (Basic Implementation) */}
      <button 
        onClick={() => setIsCartOpen(!isCartOpen)} 
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg z-40"
        aria-label="Open Cart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
            {cart.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </button>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-xl p-6 flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Your cart is empty.</p>
            ) : (
              <div className="flex-grow">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b dark:border-gray-700 py-3">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 border rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 border rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700">+</button>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.032 3.22.094m1.28 3.962c.341.052.682.107 1.021.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-auto border-t dark:border-gray-700 pt-4">
                <div className="flex justify-between font-semibold mb-4">
                  <span>Total:</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
                >
                  Proceed to Checkout (Placeholder)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* TODO: Implement Delivery Logic (Shillong vs Outside Shillong) during Checkout */}
    </div>
  );
};

export default Bookstore;

