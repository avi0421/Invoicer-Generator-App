import Link from 'next/link'
import React from 'react'
import { BsCheck2Circle } from "react-icons/bs";

export default function Pricing() {
  return (
    <div className='bg-slate-100 flex flex-col gap-6 py-8 md:py-16 px-4 md:px-16'>
      <div className=''>
        <div className="flex items-center justify-center flex-col mb-12">
          <h2 className='text-2xl md:text-5xl font-semibold mb-4'>
            Free Online Invoice Generator
          </h2>
          <p>No subscriptions, no hidden fees – 100% free to use.</p> 
        </div>
        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
 <div className="bg-white shadow-2xl rounded-lg p-12 flex flex-col items-center text-center">
   {/* Icon */}
   <div className="flex items-center justify-center rounded-full w-16 h-16 bg-violet-100 mb-6">
     <BsCheck2Circle className="text-3xl text-violet-500" />
   </div>
   
   <h4 className="mb-6 text-2xl font-bold text-slate-900">
     Totally Free
   </h4>
   
   <p className="mb-6 text-slate-500">
     Create up to 100 invoices and documents per year. Includes Invoices, 
     Quotations, Pro Forma Invoices, Expenses and more. No subscriptions, 
     no hidden charges.
   </p>
   
   <Link 
     className="font-bold text-violet-700 hover:text-violet-800" 
     href="/invoice/new"
   >
     Create Free Invoice
   </Link>
 </div>
</div>
      </div>
    </div>
  )
}
