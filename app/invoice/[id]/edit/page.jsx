"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FormPreview from '@/components/FormPreview';
import FormTable from '@/components/FormTable';
import { useReactToPrint } from "react-to-print";
import { AiOutlinePrinter, AiOutlineCloudUpload, AiOutlineArrowLeft } from "react-icons/ai";
import { BsLayoutTextWindowReverse } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import Link from 'next/link';

export default function EditInvoice() {
  const router = useRouter();
  const { id } = useParams();
  const invoiceRef = useRef();

  /* --- state declarations (same as user code) --- */
  const [loading, setLoading] = useState(true);
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
    status: "draft",
  });

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
      
      // Set form data
      setFormData({
        companyName: invoice.companyName || "",
        invoiceAuthor: invoice.invoiceAuthor || "",
        companyAddress: invoice.companyAddress || "",
        companyCity: invoice.companyCity || "",
        companyCountry: invoice.companyCountry || "",
        clientCompany: invoice.clientCompany || "",
        clientAddress: invoice.clientAddress || "",
        clientCity: invoice.clientCity || "",
        clientCountry: invoice.clientCountry || "",
        invoiceNumber: invoice.invoiceNumber || "",
        invoiceDate: invoice.invoiceDate || "",
        invoiceDueDate: invoice.invoiceDueDate || "",
        status: invoice.status || "draft"
      });
      
      // Set table data
      setTableData(invoice.tableData || []);
      
      // Set combined data for preview
      setCombinedData(invoice);
      
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setSaveStatus({ type: 'error', message: 'Failed to load invoice' });
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdateInvoice = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const dataToSave = preview ? combinedData : {
        ...formdata,
        tableData,
      };

      // Basic validation
      if (!dataToSave.companyName || !dataToSave.invoiceNumber) {
        throw new Error('Company name and invoice number are required');
      }

      const response = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update invoice');
      }

      setSaveStatus({ type: 'success', message: 'Invoice updated successfully!' });
      
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
      console.error('Error updating invoice:', error);
      setSaveStatus({ type: 'error', message: error.message });
    } finally {
      setIsSaving(false);
      // Clear status after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    }
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
        <div className="flex items-center gap-4">
          <Link 
            href="/invoices" 
            className="flex items-center space-x-2 text-violet-600 hover:text-violet-800"
          >
            <AiOutlineArrowLeft />
            <span>Back to Invoices</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Invoice #{formdata.invoiceNumber}
          </h1>
        </div>
      </div>

      {/* ACTION BUTTONS */}
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
            onClick={handleUpdateInvoice}
            disabled={isSaving}
            className={`flex font-semibold items-center space-x-2 px-3 py-2 rounded-sm border border-violet-600 ${
              isSaving 
                ? 'text-gray-400 border-gray-300 cursor-not-allowed' 
                : 'text-violet-600 hover:bg-violet-50'
            }`}
          >
            <AiOutlineCloudUpload className={isSaving ? 'animate-spin' : ''} />
            <span>{isSaving ? 'Updating...' : 'Update Invoice'}</span>
          </button>
          <button className='flex text-violet-600 font-semibold items-center space-x-2 px-3 py-2 rounded-sm border border-violet-600 hover:bg-violet-50'>
            <CiMail />
            <span>Send</span>
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
          {/* INVOICE TITLE */}
          <div className="flex justify-center mb-4">
            <h1 className="text-4xl font-bold text-gray-800 tracking-wide">INVOICE</h1>
          </div>

          {/* Status and Basic Info */}
          <div className="mb-6 flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-slate-500 font-bold">Status:</label>
              <select
                name="status"
                value={formdata.status}
                onChange={handleInputChange}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
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
          <FormTable updateTableData={updateTableData} initialData={tableData} />

          {/* Submit Button */}
          <button className='bg-violet-600 py-2.5 px-6 text-white rounded mt-4' type='submit'>
            Update Preview
          </button>
        </form>
      )}
    </div>
  );
}