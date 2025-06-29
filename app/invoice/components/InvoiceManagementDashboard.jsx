"use client";
// C:\Users\avina\Desktop\invoicer-saas-app\app\invoice\components\InvoiceManagementDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Plus, Calendar, DollarSign, FileText, Building, RefreshCw } from 'lucide-react';
import Link from 'next/link'; // Replace ThemeLink with Next.js Link
import { CiMail } from 'react-icons/ci';

const InvoiceManagementDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Fetch invoices from API with authentication
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      // Debug logging
      console.log('Auth token:', token ? 'Token exists' : 'No token found');
      console.log('Token length:', token ? token.length : 0);
      
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch('/api/invoices', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.text();
        console.log('Error response:', errorData);
        
        if (response.status === 401) {
          // Clear invalid token
          localStorage.removeItem('token');
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to fetch invoices: ${response.status}`);
      }

      const data = await response.json();
      setInvoices(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Calculate total amount for an invoice
  const calculateInvoiceTotal = (tableData) => {
    if (!tableData || !Array.isArray(tableData)) return 0;
    
    return tableData.reduce((total, item) => {
      const qty = parseFloat(item.qty) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const tax = parseFloat(item.tax) || 0;
      
      const subtotal = qty * unitPrice;
      const taxAmount = (subtotal * tax) / 100;
      return total + subtotal + taxAmount;
    }, 0);
  };

  // Filter invoices based on search and status
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const matchesSearch = 
        invoice.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  // Calculate dashboard stats
  const dashboardStats = useMemo(() => {
    const totalInvoices  = invoices.length;
    const draftInvoices  = invoices.filter(inv => inv.status === "draft").length;
    const sentInvoices   = invoices.filter(inv => inv.status === "sent").length;
    const paidInvoices   = invoices.filter(inv => inv.status === "paid").length;

    const totalAmount = invoices.reduce(
      (sum, inv) => sum + calculateInvoiceTotal(inv.tableData),
      0
    );

    return {
      totalInvoices,
      draftInvoices,
      sentInvoices,
      totalAmount,
      paidInvoices,
    };
  }, [invoices]);

  // Delete invoice with authentication
  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        const token = getAuthToken();
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`/api/invoices/${invoiceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          setInvoices(invoices.filter(inv => inv._id !== invoiceId));
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else {
          throw new Error('Failed to delete invoice');
        }
      } catch (err) {
        alert('Error deleting invoice: ' + err.message);
      }
    }
  };

  // View invoice details
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 mb-4">Error: {error}</p>
            <div className="space-x-4">
              <button 
                onClick={fetchInvoices}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Retry
              </button>
              {error.includes('Authentication') && (
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Go to Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
              <p className="text-gray-600 mt-1">Manage and track all your invoices</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={fetchInvoices}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              
              {/* FIXED: Replace ThemeLink with Next.js Link */}
              <Link
                href="/invoice/new"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Invoice</span>
              </Link>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalInvoices}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardStats.totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Invoices</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{invoice.invoiceNumber || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.companyName || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.clientCompany || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(invoice.invoiceDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(calculateInvoiceTotal(invoice.tableData))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(invoice._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Detail Modal */}
        {showModal && selectedInvoice && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Invoice Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Invoice Preview */}
                <div className="bg-white p-8 rounded-lg border">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
                    <p className="text-sm text-gray-500 mt-1">#{selectedInvoice.invoiceNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">From:</h4>
                      <div className="text-gray-600">
                        <div className="font-medium">{selectedInvoice.companyName}</div>
                        <div>{selectedInvoice.invoiceAuthor}</div>
                        <div>{selectedInvoice.companyAddress}</div>
                        <div>{selectedInvoice.companyCity}</div>
                        <div>{selectedInvoice.companyCountry}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">To:</h4>
                      <div className="text-gray-600">
                        <div className="font-medium">{selectedInvoice.clientCompany}</div>
                        <div>{selectedInvoice.clientAddress}</div>
                        <div>{selectedInvoice.clientCity}</div>
                        <div>{selectedInvoice.clientCountry}</div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  {selectedInvoice.tableData && selectedInvoice.tableData.length > 0 && (
                    <div className="mb-8">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Tax %</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.tableData.map((item, index) => {
                            const qty = parseFloat(item.qty) || 0;
                            const unitPrice = parseFloat(item.unitPrice) || 0;
                            const tax = parseFloat(item.tax) || 0;
                            const subtotal = qty * unitPrice;
                            const taxAmount = (subtotal * tax) / 100;
                            const total = subtotal + taxAmount;

                            return (
                              <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">{item.itemDescription}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{qty}</td>
                                <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(unitPrice)}</td>
                                <td className="border border-gray-300 px-4 py-2 text-right">{tax}%</td>
                                <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(total)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div className="mt-4 text-right">
                        <div className="text-xl font-bold">
                          Total: {formatCurrency(calculateInvoiceTotal(selectedInvoice.tableData))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedInvoice.notes && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Notes:</h4>
                      <p className="text-gray-600">{selectedInvoice.notes}</p>
                    </div>
                  )}

                  {selectedInvoice.termsAndConditions && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Terms and Conditions:</h4>
                      <p className="text-gray-600">{selectedInvoice.termsAndConditions}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceManagementDashboard;