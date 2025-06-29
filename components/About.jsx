'use client';

import { FileText, Globe, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-lg text-gray-600">
            Open-Source Invoice Generator built for everyone. Create professional invoices for free.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            We believe every business should have access to professional invoicing tools. 
            That's why Invoicer is completely free - no subscriptions, no hidden fees, 
            no limitations. Just simple, powerful invoicing for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FileText className="w-12 h-12 text-violet-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Free</h3>
            <p className="text-gray-600">Create invoices. <br/>No subscriptions required.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Open Source</h3>
            <p className="text-gray-600">Transparent code that everyone can see and contribute to.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">User Friendly</h3>
            <p className="text-gray-600">Simple interface that makes invoicing quick and easy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}