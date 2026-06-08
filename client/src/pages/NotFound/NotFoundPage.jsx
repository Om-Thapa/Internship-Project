import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FCF8] px-6 py-12">
      <div className="text-center max-w-xl w-full">
        
        {/* Decorative Visual Element */}
        <div className="relative flex justify-center mb-8">
          <div className="absolute inset-0 bg-[#16A34A] opacity-10 blur-3xl rounded-full w-48 h-48 mx-auto -top-4"></div>
          <h1 className="relative text-9xl font-black tracking-tight text-[#16A34A] select-none">
            404
          </h1>
        </div>

        {/* Message Content */}
        <h2 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
          Page not found
        </h2>
        
        <p className="mt-4 text-base leading-7 text-[#111827]/70 max-w-md mx-auto">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved, deleted, or perhaps the URL has a typo.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#15803D] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#16A34A] transition-colors duration-200"
          >
            Go back home
          </Link>
          
          <Link
            to="/contact"
            className="text-sm font-semibold text-[#111827] hover:text-[#16A34A] transition-colors duration-200 flex items-center gap-1"
          >
            Contact Us <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

      </div>
    </div>
  );
}