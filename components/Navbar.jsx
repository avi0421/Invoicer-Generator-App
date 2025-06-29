'use client';

import Link from 'next/link';
import { FaFileInvoiceDollar } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { BiMenu } from "react-icons/bi";
import ThemeLink from './ThemeLink';
import { useState } from 'react';
import { useAuth } from '@/lib/authContext';

export default function Navbar() {
    const [show, setShow] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    
    const handleLogout = () => {
        logout();
        setShow(false);
    };

    return (
        <>
        <header className="bg-violet-800 fixed top-0 right-0 w-full left-0 h-16 flex items-center justify-between px-16 text-slate-50">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl md:text-4xl">
                <FaFileInvoiceDollar className="text-3xl md:text-4xl text-white" />
                Invoicer
            </Link>

            <nav className="hidden sm:flex items-center gap-6">
                <Link href="/" className="hover:text-slate-200 transition">Home</Link>
                {isAuthenticated && (
                    <Link href="/create-invoice" className="hover:text-slate-200 transition">Create Invoice</Link>
                )}
                <a href="https://www.ilovepdf.com/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition">Free Tools</a>
                <Link href="/about" className="hover:text-slate-200 transition">About</Link>
                <Link href="/contact" className="hover:text-slate-200 transition">Contact</Link>
            </nav>

            <div className="hidden sm:flex items-center gap-4">
                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm">Welcome, {user?.name || user?.email}</span>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <Link href="/login" className="hover:text-slate-200 transition">Login</Link>
                        <ThemeLink className="bg-red-500 hover:bg-red-600 focus:ring-red-300" title="Register" href="/register" />
                    </>
                )}
            </div>

            {/* Hamburger Menu */}
            <button onClick={() => setShow(true)} className='sm:hidden'>
                <BiMenu className='text-3xl' />
            </button>
        </header>

        <div className={show ? "sm:hidden fixed w-56 bg-slate-800 bg-opacity-95 h-screen right-0 z-50 top-0 p-4 text-slate-50" : "hidden sm:hidden fixed w-56 bg-slate-800 bg-opacity-95 h-screen right-0 z-50 top-0 p-4 text-slate-50"}>
            <div className="flex justify-between items-center mb-10">
                <h2 className='font-bold'>Invoicer</h2>
                <button onClick={() => setShow(false)}>
                    <AiOutlineClose className='text-2xl' />
                </button>
            </div>

            <div className="flex flex-col items-start gap-3 mb-10">
                <Link href="/" onClick={() => setShow(false)} className="hover:text-slate-200 transition cursor-pointer">Home</Link>
                {isAuthenticated && (
                    <Link href="/create-invoice" onClick={() => setShow(false)} className="hover:text-slate-200 transition cursor-pointer">Create Invoice</Link>
                )}
                <span className="hover:text-slate-200 transition cursor-pointer">Free Tools</span>
                <span className="hover:text-slate-200 transition cursor-pointer">Contact</span>
            </div>

            <div className="flex flex-col items-start gap-4">
                {isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                        <span className="text-sm text-slate-300">Welcome, {user?.name || user?.email}</span>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition text-left"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <Link href="/login" onClick={() => setShow(false)} className="hover:text-slate-200 transition">Login</Link>
                        <ThemeLink className="bg-red-500 hover:bg-red-600 focus:ring-red-300" title="Register" href="/register" />
                    </>
                )}
            </div>
        </div>
        </>
    );
}