"use client";

import React from 'react';

export default function PreviewTable({ data }) {
  // Debug: Log the data to see what we're receiving
  console.log('PreviewTable data:', data);

  // Ensure data is an array
  const tableData = Array.isArray(data) ? data : [];

  // Calculate totals
  const calculateTotals = () => {
    if (!tableData || tableData.length === 0) {
      return {
        subtotal: 0,
        totalTax: 0,
        grandTotal: 0
      };
    }

    let subtotal = 0;
    let totalTax = 0;

    tableData.forEach(item => {
      const qty = parseFloat(item.qty) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const taxRate = parseFloat(item.tax) || 0;

      const itemTotal = qty * unitPrice;
      const itemTax = (itemTotal * taxRate) / 100;

      subtotal += itemTotal;
      totalTax += itemTax;
    });

    return {
      subtotal: subtotal,
      totalTax: totalTax,
      grandTotal: subtotal + totalTax
    };
  };

  const totals = calculateTotals();

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="w-full">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left p-3 font-semibold">ITEM DESCRIPTION</th>
              <th className="text-center p-3 font-semibold">QTY</th>
              <th className="text-right p-3 font-semibold">UNIT PRICE</th>
              <th className="text-right p-3 font-semibold">TAX (%)</th>
              <th className="text-right p-3 font-semibold">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((item, index) => {
                const qty = parseFloat(item.qty) || 0;
                const unitPrice = parseFloat(item.unitPrice) || 0;
                const taxRate = parseFloat(item.tax) || 0;
                const itemTotal = qty * unitPrice;
                const itemTax = (itemTotal * taxRate) / 100;
                const finalAmount = itemTotal + itemTax;

                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.description || '-'}</td>
                    <td className="p-3 text-center">{qty}</td>
                    <td className="p-3 text-right">{formatCurrency(unitPrice)}</td>
                    <td className="p-3 text-right">{taxRate}%</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(finalAmount)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No items added to invoice
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="mt-6 flex justify-end">
        <div className="w-80">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Subtotal:</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Tax:</span>
              <span>{formatCurrency(totals.totalTax)}</span>
            </div>
            <div className="flex justify-between py-3 text-lg font-bold">
              <span>TOTAL AMOUNT:</span>
              <span>{formatCurrency(totals.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}