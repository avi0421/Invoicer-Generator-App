'use client';

import Link from 'next/link';
import { FaFileInvoiceDollar } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Logo and Title */}
        <Link href="/" className="flex justify-center items-center gap-2 text-2xl font-bold text-white mb-4">
          <FaFileInvoiceDollar className="text-2xl"/>
          Invoicer
        </Link>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Open-Source Invoice Generator built for the one.
        </p>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 dark:text-gray-300 mb-6">
  <Link href="/about" className="hover:underline">About</Link>
  <Link href="/contact" className="hover:underline">Contact</Link>
</div>

        {/* Copyright */}
        <span className="text-xs text-gray-500">
          © 2025 <a href="#" className="hover:underline">Invoicer™</a>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
