
import Link from 'next/link';

// Placeholder data for featured genres - this would come from a database or config
const featuredGenres = [
  { name: 'Comics', href: '/bookstore?genre=Comics', image: '/placeholder-comics.jpg' }, // Replace with actual image paths
  { name: 'Fiction', href: '/bookstore?genre=Fiction', image: '/placeholder-fiction.jpg' },
  { name: 'Fantasy', href: '/bookstore?genre=Fantasy', image: '/placeholder-fantasy.jpg' },
  { name: 'Biography', href: '/bookstore?genre=Biography', image: '/placeholder-biography.jpg' },
];

// Placeholder for CTAs
const ctaButtons = [
  { text: 'Browse Full Bookstore', href: '/bookstore' },
  { text: 'Explore PDF Library', href: '/pdf-library' },
  { text: 'Read Weekly Magazine', href: '/magazine' }, // Assuming a magazine route
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navigation - Assuming a separate Navbar component will be created later */}
      <header className="py-6 bg-white dark:bg-gray-800 shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            MeghaTales
          </Link>
          <div className="space-x-4">
            <Link href="/bookstore" className="hover:text-indigo-500 dark:hover:text-indigo-300">Bookstore</Link>
            <Link href="/pdf-library" className="hover:text-indigo-500 dark:hover:text-indigo-300">PDF Library</Link>
            <Link href="/magazine" className="hover:text-indigo-500 dark:hover:text-indigo-300">Magazine</Link>
            {/* Add other nav links: Education, Stories, Contact, Login/Signup */}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            Welcome to MeghaTales
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Discover a world of books, educational resources, captivating stories, and our weekly magazine.
          </p>
          <div className="space-x-0 sm:space-x-4 space-y-4 sm:space-y-0 flex flex-col sm:flex-row justify-center">
            {ctaButtons.map((cta) => (
              <Link key={cta.text} href={cta.href}
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 dark:text-indigo-300 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-150 ease-in-out"
              >
                {cta.text}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Genres Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10 sm:mb-12">
            Featured Genres
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredGenres.map((genre) => (
              <Link key={genre.name} href={genre.href} className="group block rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-white dark:bg-gray-800">
                {/* Placeholder for image - In a real app, use Next/Image */}
                <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center group-hover:opacity-80 transition-opacity">
                  <span className="text-gray-500 dark:text-gray-400">{genre.name} Image</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {genre.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Explore our collection of {genre.name.toLowerCase()} books.</p>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                    Shop {genre.name} &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Placeholder for Donation Button - to be added if credits allow */}
      {/* 
      <section className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Support MeghaTales</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">Your contributions help us bring more stories and knowledge to everyone.</p>
          <button 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            onClick={() => alert('Donation (₹10 min) - Placeholder Payment Logic')}
          >
            Donate Now
          </button>
        </div>
      </section>
      */}

      {/* Footer - Assuming a separate Footer component will be created later */}
      <footer className="py-8 bg-gray-800 dark:bg-black text-gray-300 dark:text-gray-500">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} MeghaTales. All rights reserved.</p>
          <p className="text-sm mt-2">Placeholder for social media links and contact info.</p>
        </div>
      </footer>
    </div>
  );
}

