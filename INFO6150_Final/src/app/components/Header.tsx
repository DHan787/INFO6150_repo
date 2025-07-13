/*
 * @Author: Jiang Han
 * @Date: 2025-04-22 14:00:42
 * @Description: 
 */
'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();

    const isCreatePage = pathname === '/create';
    const isAdminPage = pathname.startsWith('/admin');
    const isHomePage = pathname === '/';

    return (
        <header className="bg-gray-800 text-white flex justify-between items-center px-4 py-2">
            <h1 className="text-2xl font-extrabold text-custom-red" style={{ fontFamily: 'Lobster, cursive' }}>
                Pin Car
            </h1>
            <div className="flex gap-2">
                {!isHomePage && (
                    <button
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                        onClick={() => router.back()}
                    >
                        Back
                    </button>
                )}
                {/* 只在非 create 页显示 */}
                {!isCreatePage && (
                    <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                        onClick={() => {
                            window.location.href = '/create';
                        }}
                    >
                        Start My Ride
                    </button>
                )}

                {/* 只在非 admin 页显示 */}
                {!isAdminPage && (
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        onClick={() => {
                            const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
                            window.location.href = isLoggedIn ? '/admin' : '/login';
                        }}
                    >
                        Admin
                    </button>
                )}
            </div>
        </header>
    );
}