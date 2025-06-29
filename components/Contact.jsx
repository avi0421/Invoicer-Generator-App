'use client';

import { Mail, Phone, MapPin, Github } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <Mail className="w-5 h-5 text-violet-600" />
            <span className="text-gray-700">support@invoicer.com</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <Phone className="w-5 h-5 text-violet-600" />
            <span className="text-gray-700">+91 8123456789</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <MapPin className="w-5 h-5 text-violet-600" />
            <span className="text-gray-700">Mumbai, Maharashtra, India</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <Github className="w-5 h-5 text-violet-600" />
            <a 
              href="https://github.com/avi0421/Invoice-Generator-App" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-violet-600 transition-colors"
            >
              github.com/avi0421/Invoice-Generator-App
            </a>
          </div>
        </div>
        
        <p className="text-gray-600 mt-8">
          Have questions? We're here to help you with your invoicing needs.
        </p>
      </div>
    </div>
  );
}