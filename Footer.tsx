import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">MeghaTales</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Books, Education, and Stories from Meghalaya
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              About
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              Contact
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              Privacy
            </a>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} MeghaTales. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
