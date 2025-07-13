/*
 * @Author: Jiang Han
 * @Date: 2025-04-23 22:54:58
 * @Description: 
 */
import fs from 'fs';
import path from 'path';
import { Post } from '@/types/post';

const filePath = path.join(process.cwd(), 'public', 'posts.json');

export async function expireOutdatedPosts() {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        console.log('[cron] Read posts file successfully.');
        const posts: Post[] = JSON.parse(data);

        const now = Date.now();
        let modified = false;

        const updatedPosts = posts.map((post: Post) => {
            const postTime = new Date(post.endTime).getTime();
            if (post.status === 'active' && postTime < now) {
                modified = true;
                return { ...post, status: 'expired' };
            }
            return post;
        });

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(updatedPosts, null, 2), 'utf-8');
            console.log(`[cron] Updated expired posts at ${new Date().toISOString()}`);
        } else {
            console.log('[cron] No posts expired. No write needed.');
        }
    } catch (err) {
        console.error('Failed to update post statuses:', err);
    }
}