/*
 * @Author: Jiang Han
 * @Date: 2025-04-22 14:00:49
 * @Description: 
 */
'use client';

import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white text-center py-4 mt-6">
            <hr className="border-t-2 border-gray-500 mb-4" />
            <div className="space-x-6">
                <a href="/conditions-of-use" className="text-sm hover:underline">Conditions of Use</a>
                <a href="/privacy-notice" className="text-sm hover:underline">Privacy Notice</a>
                <a href="/help" className="text-sm hover:underline">Help</a>
            </div>
            <div className="mt-4 text-sm">© 2025, Pin Car.com</div>
        </footer>
    );
}
