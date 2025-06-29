"use client";

import FormPreview from '@/components/FormPreview';
import FormTable from '@/components/FormTable';
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from 'react';
import { AiOutlineCloudDownload, AiOutlinePrinter, AiOutlineCloudUpload } from "react-icons/ai";
import { BsLayoutTextWindowReverse } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { useAuth } from '@/lib/authContext';

export default function CreateInvoice() {
  const { user, token } = useAuth();
  const invoiceRef = useRef();

  const [preview, setPreview] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [formdata, setFormData] = useState({
    companyName: "",
    invoiceAuthor: "",
    companyAddress: "",
    companyCity: "",
    companyCountry: "",
    clientCompany: "",
    clientAddress: "",
    clientCity: "",
    clientCountry: "",
    invoiceNumber: "",
    invoiceDate: "",
    invoiceDueDate: "",
    notes: "",
    termsAndConditions: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formdata, [name]: value });
  }

  function updateTableData(data) {
    setTableData(data);
  }

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
  });

  function handleFormSubmit(e) {
    e.preventDefault();
    
    const allFormData = {
      ...formdata,
      tableData,
    };
    
    setCombinedData(allFormData);
    setPreview(!preview);
  }

  const handleSaveOnline = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Try to get token from localStorage as fallback
      const fallbackToken = localStorage.getItem('token');
      const fallbackUser = localStorage.getItem('user');

      // Use token from context first, fallback to localStorage
      const finalToken = token || fallbackToken;
      const finalUser = user || (fallbackUser ? JSON.parse(fallbackUser) : null);

      // Check if user is authenticated
      if (!finalUser || !finalToken) {
        throw new Error('Please log in to save invoices online.');
      }

      const dataToSave = preview ? combinedData : {
        ...formdata,
        tableData,
      };

      // Basic validation
      if (!dataToSave.companyName || !dataToSave.invoiceNumber) {
        throw new Error('Company name and invoice number are required');
      }

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${finalToken}`,
        },
        body: JSON.stringify({
          ...dataToSave,
          userId: finalUser.id || finalUser._id,
          createdAt: new Date().toISOString(),
          status: 'draft'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save invoice');
      }

      const result = await response.json();
      setSaveStatus({ type: 'success', message: `Invoice saved successfully! ID: ${result.insertedId}` });
      
      // If we're not in preview mode, switch to preview after saving
      if (!preview) {
        const allFormData = {
          ...formdata,
          tableData,
        };
        setCombinedData(allFormData);
        setPreview(true);
      }

    } catch (error) {
      setSaveStatus({ type: 'error', message: error.message });
    } finally {
      setIsSaving(false);
      // Clear status after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className='bg-slate-50 py-8 md:py-8 px-4 md:px-16'>
      {/* STATUS MESSAGE */}
      {saveStatus && (
        <div className={`mb-4 p-3 rounded-md ${
          saveStatus.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {saveStatus.message}
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button onClick={() => setPreview(!preview)} className='px-3 py-2 rounded-sm border border-violet-600'>
            <div className='flex items-center space-x-2'>
              <BsLayoutTextWindowReverse />
              <span>{preview ? "Edit Form" : "Preview"}</span>
            </div>
          </button>
          <button onClick={handlePrint} className='flex items-center space-x-2 px-3 py-2 rounded-sm border border-violet-600'>
            <AiOutlinePrinter />
            <span>Print/Download</span>
          </button>
          
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSaveOnline}
            disabled={isSaving}
            className={`flex font-semibold items-center space-x-2 px-3 py-2 rounded-sm border border-violet-600 ${
              isSaving 
                ? 'text-gray-400 border-gray-300 cursor-not-allowed' 
                : 'text-violet-600 hover:bg-violet-50'
            }`}
          >
            <AiOutlineCloudUpload className={isSaving ? 'animate-spin' : ''} />
            <span>{isSaving ? 'Saving...' : 'Save Online'}</span>
          </button>
        </div>
      </div>

      {/* FORM OR PREVIEW */}
      {preview ? (
        <div ref={invoiceRef}>
          <FormPreview data={combinedData} />
        </div>
      ) : (
        <form 
          onSubmit={handleFormSubmit} 
          className="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 mx-auto max-w-5xl"
        >
          {/* INVOICE TITLE with Professional Branding */}
          <div className="flex flex-col items-center mb-4">
            <h1 className="text-4xl font-bold text-gray-800 tracking-wide">INVOICE</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">by Invoicer</p>
          </div>

          {/* Company Info */}
          <div className="flex flex-col text-black w-1/2 mt-6">
            {["companyName", "invoiceAuthor", "companyAddress", "companyCity", "companyCountry"].map((field, idx) => (
              <input
                key={idx}
                className="h-7 text-base p-1 mb-2 placeholder:text-slate-400 border border-gray-300 rounded"
                type="text"
                name={field}
                placeholder={field === "companyName" ? "Your Company" :
                            field === "invoiceAuthor" ? "Your Name" :
                            field === "companyAddress" ? "Company Address" :
                            field === "companyCity" ? "City, State, Zip" :
                            "Country e.g. INDIA"}
                value={formdata[field]}
                onChange={handleInputChange}
              />
            ))}
          </div>

          {/* Client + Invoice Info */}
          <div className="flex justify-between gap-4">
            <div className="flex flex-col text-black w-1/2 mt-6">
              <h2 className='mb-2 font-semibold'>Bill To</h2>
              {["clientCompany", "clientAddress", "clientCity", "clientCountry"].map((field, idx) => (
                <input
                  key={idx}
                  className="h-7 text-base p-1 mb-2 placeholder:text-slate-400 border border-gray-300 rounded"
                  type="text"
                  name={field}
                  placeholder={field === "clientCompany" ? "Client Company" :
                              field === "clientAddress" ? "Client Address" :
                              field === "clientCity" ? "City, State, Zip" :
                              "Country e.g. INDIA"}
                  value={formdata[field]}
                  onChange={handleInputChange}
                />
              ))}
            </div>

            <div className="flex flex-col text-black w-1/2 mt-6">
              <div className="flex gap-2 mb-2 items-center">
                <label className="text-slate-500 font-bold" htmlFor="invoiceNumber">Invoice #</label>
                <input
                  className="h-7 text-base p-1 flex-1 border border-gray-300 rounded"
                  type="text"
                  name="invoiceNumber"
                  placeholder="INV-202"
                  value={formdata.invoiceNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex gap-2 mb-2 items-center">
                <label className="text-slate-500 font-bold" htmlFor="invoiceDate">Invoice Date</label>
                <input
                  className="h-7 text-base p-1 flex-1 border border-gray-300 rounded"
                  type="date"
                  name="invoiceDate"
                  value={formdata.invoiceDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex gap-2 mb-2 items-center">
                <label className="text-slate-500 font-bold" htmlFor="invoiceDueDate">Due Date</label>
                <input
                  className="h-7 text-base p-1 flex-1 border border-gray-300 rounded"
                  type="date"
                  name="invoiceDueDate"
                  value={formdata.invoiceDueDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <FormTable updateTableData={updateTableData}/>

          {/* Notes Section */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
            <textarea
              className="w-full h-20 text-base p-3 placeholder:text-slate-400 border border-gray-300 rounded resize-none focus:outline-none focus:border-violet-500"
              name="notes"
              placeholder="Write your notes here..."
              value={formdata.notes}
              onChange={handleInputChange}
            />
          </div>

          {/* Terms and Conditions Section */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Terms and Conditions</label>
            <textarea
              className="w-full h-24 text-base p-3 placeholder:text-slate-400 border border-gray-300 rounded resize-none focus:outline-none focus:border-violet-500"
              name="termsAndConditions"
              placeholder="Write your terms and conditions here..."
              value={formdata.termsAndConditions}
              onChange={handleInputChange}
            />
          </div>

          {/* Submit Button */}
          <button className='bg-violet-600 py-2.5 px-6 text-white rounded mt-6' type='submit'>
            Create Invoice
          </button>
        </form>
      )}
    </div>
  );
}