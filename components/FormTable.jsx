"use client"
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function FormTable({ updateTableData, onSubmit, formData = {} }) {
  const [tableData, setTableData] = useState([
    {
      itemDescription: "",
      qty: "",
      unitPrice: "",
      tax: "",
      amount: ""
    },
    {
      itemDescription: "",
      qty: "",
      unitPrice: "",
      tax: "",
      amount: ""
    }
  ]);

  const [preview, setPreview] = useState(false);

  function handleInputChange(index, e) {
    const { name, value } = e.target;
    const updatedData = [...tableData];
    updatedData[index][name] = value;
    
    // Auto-calculate amount when qty, unitPrice, or tax changes
    if (name === "qty" || name === "unitPrice" || name === "tax") {
      const qty = parseFloat(updatedData[index].qty);
      const price = parseFloat(updatedData[index].unitPrice);
      const tax = parseFloat(updatedData[index].tax);
      
      if (!isNaN(qty) && !isNaN(price)) {
        let amount = qty * price;
        
        // Add tax if it's a valid number
        if (!isNaN(tax)) {
          amount = amount + (amount * tax / 100);
        }
        
        updatedData[index].amount = amount.toFixed(2);
      } else {
        updatedData[index].amount = "";
      }
    }
    
    setTableData(updatedData);
    
    // Call the prop function if provided
    if (updateTableData) {
      updateTableData(updatedData);
    }
    
    console.log(tableData);
  }

  function addRow() {
    const newRow = { itemDescription: "", qty: "", unitPrice: "", tax: "", amount: "" };
    const updatedData = [...tableData, newRow];
    setTableData(updatedData);
    console.log(updatedData);
  }

  function removeRow(index) {
    if (tableData.length <= 1) {
      console.log('Cannot remove last row');
      return;
    }
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
    console.log(updatedData);
  }

  return (
    <div className="p-4">
      <div className="overflow-x-auto border rounded-lg my-6">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="px-4 py-3">Item Description</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Unit Price</th>
              <th className="px-4 py-3">Tax</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3"><span className="sr-only">Delete</span></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    className="bg-transparent h-8 w-full text-base p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    name="itemDescription"
                    value={row.itemDescription}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Item Description"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    className="bg-transparent h-8 w-16 text-base p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    name="qty"
                    value={row.qty}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="2"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    className="bg-transparent h-8 w-20 text-base p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    name="unitPrice"
                    value={row.unitPrice}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="5.00"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    className="bg-transparent h-8 w-16 text-base p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    name="tax"
                    value={row.tax}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="18"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    className="bg-transparent h-8 w-24 text-base p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    name="amount"
                    value={row.amount}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="100.00"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <button 
                    type="button" 
                    onClick={() => removeRow(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          onClick={addRow}
          className="my-3 flex items-center space-x-2 text-violet-600 font-bold hover:text-violet-800"
        >
          <Plus className="w-4 h-4" />
          <span>Add Line Item</span>
        </button>
      </div>

      {/* Only render button if onSubmit prop is provided */}
      {onSubmit && (
        <button
          onClick={() => onSubmit(tableData)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Invoice
        </button>
      )}
    </div>
  );
}