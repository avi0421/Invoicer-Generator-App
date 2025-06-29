"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineEye, AiOutlinePlus } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteStatus, setDeleteStatus] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/invoices');
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete invoice');
      }

      setDeleteStatus({ type: 'success', message: 'Invoice deleted successfully!' });
      fetchInvoices(); // Refresh the list
    } catch (err) {
      setDeleteStatus({ type: 'error', message: err.message });
    }

    // Clear status after 3 seconds
    setTimeout(() => setDeleteStatus(null), 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateTotal = (tableData) => {
    if (!tableData || !Array.isArray(tableData)) return 0;
    return tableData.reduce((total, item) => {
      const amount = parseFloat(item.amount) || 0;
      return total + amount;
    }, 0);
  };

  // Filter invoices based on search term and status
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientCompany?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-8 px-4 md:px-16">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading invoices...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 min-h-screen py-8 px-4 md:px-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 md:px-16">
      {/* Status Message */}
      {deleteStatus && (
        <div className={`mb-4 p-3 rounded-md ${
          deleteStatus.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {deleteStatus.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Invoices</h1>
        <Link 
          href="/invoice/new"
          className="flex items-center space-x-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
        >
          <AiOutlinePlus />
          <span>Create New Invoice</span>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice number, company, or client..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {invoices.length === 0 ? 'No invoices created yet' : 'No invoices match your search'}
            </div>
            {invoices.length === 0 && (
              <Link 
                href="/invoice/new"
                className="inline-flex items-center space-x-2 bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors"
              >
                <AiOutlinePlus />
                <span>Create Your First Invoice</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.clientCompany || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.invoiceDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.invoiceDueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${calculateTotal(invoice.tableData).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/invoices/${invoice._id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Invoice"
                        >
                          <AiOutlineEye size={16} />
                        </Link>
                        <Link
                          href={`/invoices/${invoice._id}/edit`}
                          className="text-violet-600 hover:text-violet-900 p-1 rounded"
                          title="Edit Invoice"
                        >
                          <AiOutlineEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(invoice._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Invoice"
                        >
                          <AiOutlineDelete size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredInvoices.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Showing {filteredInvoices.length} of {invoices.length} invoices</span>
            <span>
              Total Value: ${filteredInvoices.reduce((total, invoice) => 
                total + calculateTotal(invoice.tableData), 0
              ).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}