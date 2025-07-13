/*
 * @Author: Jiang Han
 * @Date: 2025-04-15 16:24:58
 * @Description: Switched from local JSON to Upstash Redis
 */
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

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
    status: 'active' | 'completed' | 'pinned' | 'expired';
}

const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
});

export async function GET() {
    try {
        const res = await redis.get('posts');
        const data = Array.isArray(res) ? res : [];
        return NextResponse.json(data);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}

export async function PUT(req: Request) {
    const { id, status } = await req.json();
    if (!id || !status) {
        return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const existing = await redis.get('posts');
    const posts = Array.isArray(existing) ? existing as Post[] : [];

    const updatedPosts = posts.map(post => post.id === id ? { ...post, status } : post);
    await redis.set('posts', updatedPosts);

    return NextResponse.json({ success: true });
}

export async function POST(req: Request) {
    try {
        const newPost = await req.json() as Post;
        if (
            !newPost.id || !newPost.startLocation || !newPost.endLocation ||
            !newPost.startTime || !newPost.endTime || !newPost.carBrand ||
            !newPost.carModel || !newPost.carYear || !newPost.carColor ||
            !newPost.message || !newPost.remarks || !newPost.status
        ) {
            return NextResponse.json({ error: 'Missing required post fields' }, { status: 400 });
        }

        const existing = await redis.get('posts');
        const posts = Array.isArray(existing) ? existing as Post[] : [];
        posts.push(newPost);
        await redis.set('posts', posts);

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const existing = await redis.get('posts');
    const posts = Array.isArray(existing) ? existing as Post[] : [];

    const updatedPosts = posts.filter(post => post.id !== id);
    await redis.set('posts', updatedPosts);

    return NextResponse.json({ success: true });
}
