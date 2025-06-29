// app/dashboard/page.jsx
"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import InvoiceManagementDashboard from '../invoice/components/InvoiceManagementDashboard';
import { LogOut, User } from 'lucide-react';

const DashboardPage = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Invoicer Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">{user.name || user.email}</span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content - Only InvoiceManagementDashboard */}
      <InvoiceManagementDashboard />
    </div>
  );
};

export default DashboardPage;