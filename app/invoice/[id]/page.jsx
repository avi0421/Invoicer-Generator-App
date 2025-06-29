// C:\Users\avina\Desktop\invoicer-saas-app\app\invoice\[id]\page.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FormPreview from '@/components/FormPreview';
import { useReactToPrint } from "react-to-print";
import { AiOutlinePrinter, AiOutlineEdit, AiOutlineArrowLeft } from "react-icons/ai";
import { CiMail } from "react-icons/ci";
import Link from 'next/link';

export default function ViewInvoice() {
  const router = useRouter();
  const params = useParams();
  const invoiceRef = useRef();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/invoices/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoice');
      }
      
      const invoice = await response.json();
      setInvoiceData(invoice);
      
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
  });

  const calculateTotal = (tableData) => {
    if (!tableData || !Array.isArray(tableData)) return 0;
    return tableData.reduce((total, item) => {
      const amount = parseFloat(item.amount) || 0;
      return total + amount;
    }, 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-8 px-4 md:px-16">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading invoice...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 min-h-screen py-8 px-4 md:px-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
        <Link 
          href="/invoices" 
          className="flex items-center space-x-2 text-violet-600 hover:text-violet-800"
        >
          <AiOutlineArrowLeft />
          <span>Back to Invoices</span>
        </Link>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="bg-slate-50 min-h-screen py-8 px-4 md:px-16">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Invoice not found</div>
          <Link 
            href="/invoices" 
            className="flex items-center space-x-2 text-violet-600 hover:text-violet-800 justify-center"
          >
            <AiOutlineArrowLeft />
            <span>Back to Invoices</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-slate-50 py-8 md:py-8 px-4 md:px-16'>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/invoices" 
            className="flex items-center space-x-2 text-violet-600 hover:text-violet-800"
          >
            <AiOutlineArrowLeft />
            <span>Back to Invoices</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Invoice #{invoiceData.invoiceNumber}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span>Status: 
                <span className={`ml-1 px-2 py-1 text-xs font-semibold rounded-full ${
                  invoiceData.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoiceData.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                  invoiceData.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {invoiceData.status || 'draft'}
                </span>
              </span>
              <span>Created: {formatDate(invoiceData.createdAt)}</span>
              <span>Total: ${calculateTotal(invoiceData.tableData).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button onClick={handlePrint} className='flex items-center space-x-2 px-3 py-2 rounded-sm border border-violet-600 hover:bg-violet-50'>
            <AiOutlinePrinter />
            <span>Print/Download</span>
          </button>
        </div>
        
        <div className="flex gap-4">
          <Link
            href={`/invoice/${id}/edit`}
            className='flex font-semibold items-center space-x-2 px-3 py-2 rounded-sm border border-violet-600 text-violet-600 hover:bg-violet-50'
          >
            <AiOutlineEdit />
            <span>Edit Invoice</span>
          </Link>
          <button className='flex text-violet-600 font-semibold items-center space-x-2 px-3 py-2 rounded-sm border border-violet-600 hover:bg-violet-50'>
            <CiMail />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* INVOICE PREVIEW */}
      <div ref={invoiceRef}>
        <FormPreview data={invoiceData} />
      </div>

      {/* INVOICE DETAILS SUMMARY */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Company Information</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Company:</strong> {invoiceData.companyName || 'N/A'}</div>
              <div><strong>Author:</strong> {invoiceData.invoiceAuthor || 'N/A'}</div>
              <div><strong>Address:</strong> {invoiceData.companyAddress || 'N/A'}</div>
              <div><strong>City:</strong> {invoiceData.companyCity || 'N/A'}</div>
              <div><strong>Country:</strong> {invoiceData.companyCountry || 'N/A'}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Client Information</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Company:</strong> {invoiceData.clientCompany || 'N/A'}</div>
              <div><strong>Address:</strong> {invoiceData.clientAddress || 'N/A'}</div>
              <div><strong>City:</strong> {invoiceData.clientCity || 'N/A'}</div>
              <div><strong>Country:</strong> {invoiceData.clientCountry || 'N/A'}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong className="text-gray-700">Invoice Date:</strong>
              <div className="text-gray-600">{formatDate(invoiceData.invoiceDate)}</div>
            </div>
            <div>
              <strong className="text-gray-700">Due Date:</strong>
              <div className="text-gray-600">{formatDate(invoiceData.invoiceDueDate)}</div>
            </div>
            <div>
              <strong className="text-gray-700">Total Amount:</strong>
              <div className="text-gray-900 font-semibold text-lg">
                ${calculateTotal(invoiceData.tableData).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}