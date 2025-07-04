'use client';

import { useState } from 'react';

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-6 px-0 text-left focus:outline-none focus:ring-0"
        onClick={onToggle}
        aria-expanded={isOpen}>
        <h3 className="text-lg font-semibold text-gray-900 pr-8">{question}</h3>
        <span className="text-2xl text-gray-600 font-light flex-shrink-0">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="pb-6 pr-8">
          <div className="text-gray-700 leading-relaxed">{answer}</div>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "How can I make an invoice for free?",
      answer: (
        <div>
  <a href="/" className="text-blue-600 font-medium hover:underline">Invoicer</a> allows you to create invoices for free using professionally designed templates. You can customize invoices  and easily save or download them in just a few clicks.
</div>

      )
    },
    {
      question: "Which is the best free invoice generator?",
      answer: (
        <div>
          <span className="text-blue-600 font-medium">Invoicer</span> is one of the best free invoice generators for freelancers, small businesses, and startups. It lets you fully customize invoice fields, download PDF versions & save them.
        </div>
      )
    },
    {
      question: "Is Invoicer invoice generator really free?",
      answer: (
        <div>
          <span className="font-semibold text-gray-900">Yes!</span> <span className="text-blue-600 font-medium">Invoicer</span> is free to use and allows you to generate invoices with no hidden charges. You can manage clients, access templates, and keep your business invoicing streamlined.
        </div>
      )
    },
    {
      question: "Can I add more details to my invoices?",
      answer: "Yes, Invoicer lets you add shipping details, discounts, custom notes, payment terms, and additional fields to both client and item sections."
    },
    {
      question: "Can I save my invoices in this online invoice generator?",
      answer: "Yes. All invoices you create with Invoicer are securely saved to your account. You can access & delete them anytime by logging in."
    },
    // {
    //   question: "Can I save my client details on this invoice maker?",
    //   answer: "Absolutely. Invoicer includes a client management system so you don’t have to enter client details every time. Save and reuse data for faster invoicing."
    // },
    // {
    //   question: "Can I receive payments using this invoice generator?",
    //   answer: "Yes, you can include your bank details or UPI ID on the invoice to receive payments directly from clients. Invoicer does not charge or mediate payments."
    // },
    // {
    //   question: "Can I use these invoices for filing taxes?",
    //   answer: "Yes. Invoicer helps with GST-compliant invoices and provides basic reports for tax filing."
    // },
    // {
    //   question: "Can I generate a PDF invoice using this invoice generator?",
    //   answer: "Yes, Invoicer lets you download each invoice as a high-quality PDF with one click. You can print as pdf or share it directly via email."
    // },
    {
      question: "Do I have to create an Invoicer account to use this online invoice generator?",
      answer: "Yes, a free Invoicer account is required to save your data and access your invoices later."
    },
    // {
    //   question: "Will there be any ads on the invoices?",
    //   answer: "No. Invoicer invoices do not include any ads. users may see a small 'Generated by Invoicer' label."
    // },
    {
      question: "What happens to my data when I want to leave?",
      answer: "Invoicer ensures that your information is secure and always accessible, even if you decide to stop using the service."
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions (FAQ)
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openItems[index] || false}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
