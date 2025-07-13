'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Post = {
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
    status: 'active' | 'pinned' | 'completed';
};

export default function AdminPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [pinnedPosts, setPinnedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);  // Loading state
    const [now, setNow] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (isLoggedIn !== 'true') {
            router.push('/login');
        } else {
            fetch("/api/posts")
                .then(res => res.json())
                .then(data => {
                    const pinned = data.filter((post: Post) => post.status === 'pinned');
                    const others = data.filter((post: Post) => post.status !== 'pinned');
                    setPinnedPosts(pinned);
                    setPosts(others);
                    setLoading(false);
                    setNow(Date.now());
                })
                .catch(err => {
                    console.error("Failed to fetch posts:", err);
                    setLoading(false);
                    setNow(Date.now());
                });
        }
    }, [router]);

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch('/api/posts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setPosts(prev => prev.filter(p => p.id !== id));
                setPinnedPosts(prev => prev.filter(p => p.id !== id));
            } else {
                console.error('Failed to delete post');
            }
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    const handleTogglePin = async (id: string, status: 'active' | 'pinned') => {
        try {
            const res = await fetch('/api/posts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                if (status === 'pinned') {
                    const target = posts.find(p => p.id === id);
                    if (target) {
                        setPinnedPosts(prev => [...prev, { ...target, status: 'pinned' }]);
                        setPosts(prev => prev.filter(p => p.id !== id));
                    }
                } else {
                    const target = pinnedPosts.find(p => p.id === id);
                    if (target) {
                        setPosts(prev => [...prev, { ...target, status: 'active' }]);
                        setPinnedPosts(prev => prev.filter(p => p.id !== id));
                    }
                }
            } else {
                console.error('Failed to update pin status');
            }
        } catch (err) {
            console.error('Error updating pin status:', err);
        }
    };

    const calculateTimeDiff = (postStartTime: string) => {
        if (now === null) return 0;
        const postDate = new Date(postStartTime);
        return postDate.getTime() - now;
    };

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    }

    if (now === null) {
        return <div className="min-h-screen flex justify-center items-center">Preparing time data...</div>;
    }

    // Sort posts by time
    const sortedPosts = posts.sort((a, b) => {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });

    const expiredPosts = sortedPosts.filter(post => calculateTimeDiff(post.startTime) < 0);
    const upcomingPosts = sortedPosts.filter(post => calculateTimeDiff(post.startTime) >= 0);

    return (
        <main className="min-h-screen bg-white px-[15%] py-10 relative" lang="en">
            <button
                className="mb-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                onClick={() => router.push('/')}
            >
                ← Back to Home
            </button>
            <h1 className="text-3xl font-bold mb-6 text-red-800">Admin Dashboard</h1>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-2 text-black">📌 Pinned Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pinnedPosts.length === 0 ? (
                        <div className="bg-white p-4 rounded shadow">No pinned posts yet.</div>
                    ) : (
                        pinnedPosts.map((post: Post) => (
                            <Link key={post.id} href={`/post/${post.id}`} className="bg-blue-50 border border-blue-200 p-4 rounded shadow block hover:shadow-md transition">
                                <h3 className="font-semibold text-blue-900">From: {post.startLocation} to {post.endLocation}</h3>
                                <p className="text-blue-900">Time: {post.startTime}</p>
                                <p className="text-blue-900">Contact: {post.message}</p>
                                <div className="mt-2 flex justify-end space-x-2">
                                    <button
                                        className="px-3 py-1 bg-yellow-100 text-yellow-900 rounded hover:bg-yellow-200 transition"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleTogglePin(post.id, 'active');
                                        }}
                                    >
                                        Unpin
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-red-100 text-red-900 rounded hover:bg-red-200 transition"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(post.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-2 text-black">📝 User Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...upcomingPosts, ...expiredPosts].map((post: Post) => {
                        return (
                            <Link key={post.id} href={`/post/${post.id}`} className="bg-blue-50 border border-blue-200 p-4 rounded shadow relative block hover:shadow-md transition">
                                <h3 className="font-semibold text-blue-900">From: {post.startLocation} to {post.endLocation}</h3>
                                <p className="text-blue-900">Time: {post.startTime}</p>
                                <p className="text-blue-900">Contact: {post.message}</p>
                                {calculateTimeDiff(post.startTime) < 0 && (
                                    <p className="text-sm text-red-600 font-medium">Expired</p>
                                )}
                                <div className="mt-4 flex justify-between space-x-2">
                                    <button
                                        className="px-3 py-1 bg-blue-100 text-blue-900 rounded hover:bg-blue-200 transition"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleTogglePin(post.id, 'pinned');
                                        }}
                                    >
                                        Pin
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-green-100 text-green-900 rounded hover:bg-green-200 transition"
                                    >
                                        Mark Complete
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-red-100 text-red-900 rounded hover:bg-red-200 transition"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(post.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
