/*
 * @Author: Jiang Han
 * @Date: 2025-04-22 13:47:10
 * @Description: 
 */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Post {
    id: string;
    startLocation: string;
    endLocation: string;
    startTime: string;
    endTime: string;
    carBrand: string;
    carModel: string;
    carYear: string;
    carColor: string;
    message: string;
    remarks: string;
    status: 'active' | 'completed' | 'pinned';
}

// Define a safe intermediate type to avoid using `any` explicitly in ESLint.
type RawPost = Omit<Post, 'status'> & { status: string };

export default function Page() {
    const params = useParams();
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (typeof params.id === 'string') {
                const res = await fetch('/api/posts', { cache: 'no-store' });
                const rawData = await res.json();
                const data = (rawData as RawPost[]).map((p) => ({
                    ...p,
                    status: p.status as 'active' | 'completed' | 'pinned',
                })) as Post[];
                const found = data.find((p: Post) => p.id === params.id);
                setPost(found || null);
            }
        }
        fetchData();
    }, [params]);

    const formatTime = (timeStr: string) => {
        const date = new Date(timeStr);
        return date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const calculateTimeDifference = (start: string, end: string) => {
        const startTime = new Date(start);
        const endTime = new Date(end);
        const diffInMs = endTime.getTime() - startTime.getTime();
        const hours = Math.floor(diffInMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    if (!post) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 border border-blue-200 shadow-sm rounded-lg space-y-4">
                <h1 className="text-3xl font-bold mb-4 text-black">Post Details</h1>
                <p className="text-gray-800"><strong className="text-gray-900">Start Location:</strong> {post.startLocation}</p>
                <p className="text-gray-800"><strong className="text-gray-900">End Location:</strong> {post.endLocation}</p>
                <p className="text-gray-800"><strong className="text-gray-900">Start Time:</strong> {formatTime(post.startTime)}</p>
                <p className="text-gray-800"><strong className="text-gray-900">End Time:</strong> {formatTime(post.endTime)}</p>
                <p className="text-gray-800"><strong className="text-gray-900">Estimated Time:</strong> {calculateTimeDifference(post.startTime, post.endTime)}</p>
                <p className="text-gray-800"><strong className="text-gray-900">Car Model:</strong> {post.carModel}</p>
                <p className="text-gray-800"><strong className="text-gray-900">Car Year:</strong> {post.carYear}</p>
                <p className="text-gray-800"><strong className="text-gray-900">Car Color:</strong> <span className="inline-block w-6 h-6 rounded-full ml-2" style={{ backgroundColor: post.carColor }}></span></p>
                <p className="text-gray-800"><strong className="text-gray-900">Message:</strong> {post.message}</p>
                <p className="text-gray-800"><strong className="text-gray-900">Remarks:</strong> {post.remarks}</p>
                <p className="text-gray-800"><strong className="text-gray-900">Status:</strong> {post.status}</p>
            </div>
        </main>
    );
}