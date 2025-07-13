/*
 * @Author: Jiang Han
 * @Date: 2025-04-22 13:20:10
 * @Description: 
 */
import './globals.css';
import React, { ReactNode } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: 'Pin Car',
  description: 'Carpooling app for NEU',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
