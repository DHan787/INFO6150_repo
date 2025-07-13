/*
 * @Author: Jiang Han
 * @Date: 2025-04-25 02:25:57
 * @Description: 
 */
'use client';

import React from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    return (
        <div className="relative w-full max-w-md mx-auto mb-6">
            <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
            </svg>
            <input
                type="text"
                placeholder="Search posts..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-black text-black"
            />
        </div>
    );
};

export default SearchBar;
