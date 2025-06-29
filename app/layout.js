import { Inter } from 'next/font/google';
import '../styles/main.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Invoicer App - Static Invoice Generator",
  description: "Generate professional invoices locally in your browser.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${interFont.variable} antialiased`}>
        <Navbar/>
        <div className="mt-16">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}