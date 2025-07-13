// components/Layout.tsx
/*
 * @Author: li wei wang
 * @Date: 2025-04-19 11:57:58
 * @Description: Changes in this update:
 * 1. Added footer and header to every page;

 */
import React, { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-gray-800 text-white flex justify-between items-center px-4 py-2">
                <h1 className="text-2xl font-extrabold text-custom-red" style={{ fontFamily: 'Lobster, cursive' }}>
                    Pin Car
                </h1>
                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() => {
                        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
                        if (isLoggedIn) {
                            window.location.href = '/admin';
                        } else {
                            window.location.href = '/login';
                        }
                    }}
                >
                    Admin
                </button>
            </header>

            {/* Main content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center py-4 mt-6">
                <hr className="border-t-2 border-gray-500 mb-4" />
                <div className="space-x-6">
                    <a href="/conditions-of-use" className="text-sm hover:underline">Conditions of Use</a>
                    <a href="/privacy-notice" className="text-sm hover:underline">Privacy Notice</a>
                    <a href="/help" className="text-sm hover:underline">Help</a>
                </div>
                <div className="mt-4 text-sm">
                    © 2025, Pin Car.com
                </div>
            </footer>
        </div>
    );
};

export default Layout;
