# Invoice Generator App

A modern Next.js web application for creating and managing professional invoices with multi-user support and cloud storage.

## 🚀 Features

- **Multi-User Support** - Multiple users can create accounts and manage their own invoices
- **Professional Invoice Creation** - Generate clean, professional-looking invoices
- **Client Management** - Store and manage client information per user
- **Tax Calculations** - Automatic tax calculations with customizable rates
- **PDF Export** - Export invoices as PDF documents
- **Invoice Templates** - Multiple professional templates to choose from
- **Invoice Tracking** - Track paid/unpaid status and due dates
- **Cloud Storage** - Secure data storage with MongoDB Atlas
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Next.js 14+** - React framework
- **MongoDB Atlas** - Cloud database
- **MongoDB Node.js Driver** – Direct access to MongoDB without ODM
- **NextAuth.js** - Authentication
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **React-PDF/jsPDF** - PDF generation
- **pnpm** - Package manager

## 📦 Key Dependencies

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "mongoose": "^7.0.0",
  "next-auth": "^4.24.0",
  "react-hook-form": "^7.0.0",
  "react-pdf": "^7.0.0",
  "tailwindcss": "^3.3.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0"
}
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+
- pnpm (recommended - npm causes conflicts)
- MongoDB Atlas account

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/avi0421/Invoice-Generator-App.git
   cd Invoice-Generator-App
   pnpm install
   ```

2. **Environment Setup**
   Create `.env.local`:
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoice-generator
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   JWT_SECRET=your-jwt-secret
   ```

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

## 🔧 Usage

1. **Register/Login** - Create account or sign in
2. **Setup Company** - Add your company details
3. **Add Clients** - Manage your client database
4. **Create Invoices** - Build professional invoices
5. **Export PDF** - Download invoices as PDFs
6. **Track Status** - Monitor paid/unpaid invoices

## 🚀 Deployment

**Vercel (Recommended)**
```bash
# Deploy to Vercel
vercel --prod
```

Add environment variables in Vercel dashboard.

**Other Options**: Netlify, Railway, DigitalOcean

## 🚨 Troubleshooting

**Package Issues**:
```bash
# Clear and reinstall
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
```

**Common Issues**:
- Use pnpm instead of npm
- Ensure Node.js 18.17+
- Check MongoDB connection string
- Verify environment variables

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 👨‍💻 Author

**Avi** - [@avi0421](https://github.com/avi0421)

## 📚 Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

---

⭐ **Star this repo if you find it helpful!**
