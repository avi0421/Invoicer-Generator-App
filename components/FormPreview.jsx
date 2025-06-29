"use client";

import React from "react";
import PreviewTable from "./PreviewTable";

export default function FormPreview({ data }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header with INVOICE title and professional branding */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 tracking-wide">INVOICE</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">by Invoicer</p>
      </div>

      {/* Company Information */}
      <div className="mb-8">
        <div className="text-gray-800">
          {data.companyName && <div className="text-lg font-semibold">{data.companyName}</div>}
          {data.invoiceAuthor && <div>{data.invoiceAuthor}</div>}
          {data.companyAddress && <div>{data.companyAddress}</div>}
          {data.companyCity && <div>{data.companyCity}</div>}
          {data.companyCountry && <div>{data.companyCountry}</div>}
        </div>
      </div>

      {/* Bill To and Invoice Details */}
      <div className="flex justify-between mb-8">
        {/* Bill To */}
        <div className="w-1/2">
          <h3 className="font-semibold text-gray-800 mb-2">Bill To:</h3>
          <div className="text-gray-700">
            {data.clientCompany && <div className="font-medium">{data.clientCompany}</div>}
            {data.clientAddress && <div>{data.clientAddress}</div>}
            {data.clientCity && <div>{data.clientCity}</div>}
            {data.clientCountry && <div>{data.clientCountry}</div>}
          </div>
        </div>

        {/* Invoice Details */}
        <div className="w-1/2 text-right">
          <div className="space-y-1">
            {data.invoiceNumber && (
              <div className="flex justify-end">
                <span className="font-semibold text-gray-600 mr-2">Invoice #:</span>
                <span className="text-gray-800">{data.invoiceNumber}</span>
              </div>
            )}
            {data.invoiceDate && (
              <div className="flex justify-end">
                <span className="font-semibold text-gray-600 mr-2">Date:</span>
                <span className="text-gray-800">{data.invoiceDate}</span>
              </div>
            )}
            {data.invoiceDueDate && (
              <div className="flex justify-end">
                <span className="font-semibold text-gray-600 mr-2">Due Date:</span>
                <span className="text-gray-800">{data.invoiceDueDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <PreviewTable data={data.tableData || []} />
      </div>

      {/* Footer/Notes Section */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        {/* Notes */}
        {data.notes && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
            <div className="text-sm text-gray-600 whitespace-pre-wrap">{data.notes}</div>
          </div>
        )}

        {/* Terms and Conditions */}
        {data.termsAndConditions && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Terms and Conditions</h4>
            <div className="text-sm text-gray-600 whitespace-pre-wrap">{data.termsAndConditions}</div>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}