// app/layout.js
import { Inter } from 'next/font/google';
import '../styles/main.css';
import { AuthProvider } from '@/lib/authContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Invoicer App",
  description: "Generate and manage invoices effortlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${interFont.variable} antialiased`}>
        <AuthProvider>
          <Navbar/>
          <div className="mt-16">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}