import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Helper: extract the invoice ID from the URL so we don't rely on `params`
const getIdFromUrl = (url) => {
  const parts = url.pathname.split("/");           // ['', 'api', 'invoices', '<id>', 'send']
  const idx = parts.indexOf("invoices");
  return idx !== -1 ? parts[idx + 1] : null;
};

export async function POST(request) {
  /* ────── 1. Validate ID ────── */
  const id = getIdFromUrl(request.nextUrl);
  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

  try {
    /* ────── 2. Fetch the invoice ────── */
    const res = await fetch(`${baseUrl}/api/invoices/${id}`);
    if (!res.ok) {
      return NextResponse.json({ error: "Invoice fetch failed" }, { status: res.status });
    }
    const invoice = await res.json();

    /* ────── 3. Make sure we have a recipient ────── */
    if (!invoice?.clientAddress) {
      return NextResponse.json({ error: "Client email not found" }, { status: 400 });
    }

    /* ────── 4. Create Nodemailer transporter with Mailtrap ────── */
    const transporter = nodemailer.createTransporter({
      host: process.env.MAILTRAP_HOST,
      port: parseInt(process.env.MAILTRAP_PORT),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    /* ────── 5. Compute total ────── */
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

    const total = calculateInvoiceTotal(invoice.tableData);

    /* ────── 6. Create HTML email template ────── */
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #${invoice.invoiceNumber}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
        }
        .invoice-title {
            font-size: 28px;
            font-weight: bold;
            color: #007bff;
            margin: 0;
        }
        .invoice-number {
            font-size: 16px;
            color: #666;
            margin-top: 5px;
        }
        .company-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .company-info > div {
            flex: 1;
        }
        .company-info h3 {
            color: #007bff;
            margin-bottom: 10px;
        }
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .invoice-table th,
        .invoice-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .invoice-table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .invoice-table .amount {
            text-align: right;
        }
        .total-section {
            text-align: right;
            margin-top: 20px;
        }
        .total-amount {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .notes {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        @media (max-width: 600px) {
            .company-info {
                flex-direction: column;
            }
            body {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="invoice-title">INVOICE</h1>
        <p class="invoice-number">#${invoice.invoiceNumber}</p>
    </div>

    <div class="company-info">
        <div>
            <h3>From:</h3>
            <strong>${invoice.companyName || 'N/A'}</strong><br>
            ${invoice.invoiceAuthor || ''}<br>
            ${invoice.companyAddress || ''}<br>
            ${invoice.companyCity || ''}<br>
            ${invoice.companyCountry || ''}
        </div>
        <div>
            <h3>To:</h3>
            <strong>${invoice.clientCompany || 'N/A'}</strong><br>
            ${invoice.clientAddress || ''}<br>
            ${invoice.clientCity || ''}<br>
            ${invoice.clientCountry || ''}
        </div>
    </div>

    <div>
        <p><strong>Invoice Date:</strong> ${invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('en-IN') : 'N/A'}</p>
        <p><strong>Due Date:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : 'N/A'}</p>
    </div>

    ${invoice.tableData && invoice.tableData.length > 0 ? `
    <table class="invoice-table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Tax %</th>
                <th class="amount">Amount</th>
            </tr>
        </thead>
        <tbody>
            ${invoice.tableData.map(item => {
                const qty = parseFloat(item.qty) || 0;
                const unitPrice = parseFloat(item.unitPrice) || 0;
                const tax = parseFloat(item.tax) || 0;
                const subtotal = qty * unitPrice;
                const taxAmount = (subtotal * tax) / 100;
                const itemTotal = subtotal + taxAmount;
                
                return `
                <tr>
                    <td>${item.itemDescription || 'N/A'}</td>
                    <td>${qty}</td>
                    <td>₹${unitPrice.toFixed(2)}</td>
                    <td>${tax}%</td>
                    <td class="amount">₹${itemTotal.toFixed(2)}</td>
                </tr>
                `;
            }).join('')}
        </tbody>
    </table>
    ` : ''}

    <div class="total-section">
        <div class="total-amount">Total: ₹${total.toFixed(2)}</div>
    </div>

    <div style="text-align: center;">
        <a href="${baseUrl}/invoices/${id}" class="btn">View Invoice Online</a>
    </div>

    ${invoice.notes ? `
    <div class="notes">
        <h4>Notes:</h4>
        <p>${invoice.notes}</p>
    </div>
    ` : ''}

    ${invoice.termsAndConditions ? `
    <div class="notes">
        <h4>Terms and Conditions:</h4>
        <p>${invoice.termsAndConditions}</p>
    </div>
    ` : ''}

    <div class="footer">
        <p>Thank you for your business!</p>
        <p>This invoice was generated automatically by ${invoice.companyName || 'Invoice System'}.</p>
    </div>
</body>
</html>
    `;

    /* ────── 7. Send the email ────── */
    const mailOptions = {
      from: `"${invoice.companyName}" <${process.env.MAILTRAP_FROM_EMAIL}>`,
      to: invoice.clientAddress,
      subject: `Invoice #${invoice.invoiceNumber} from ${invoice.companyName}`,
      html: emailHTML,
      // Optional: Add text version
      text: `
Invoice #${invoice.invoiceNumber}

From: ${invoice.companyName}
To: ${invoice.clientCompany}

Total Amount: ₹${total.toFixed(2)}

View the full invoice online: ${baseUrl}/invoices/${id}

Thank you for your business!
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: "Invoice sent successfully",
      recipient: invoice.clientAddress 
    });

  } catch (err) {
    console.error("/api/invoices/[id]/send error", err);
    return NextResponse.json({ 
      error: "Failed to send invoice", 
      details: err.message 
    }, { status: 500 });
  }
}