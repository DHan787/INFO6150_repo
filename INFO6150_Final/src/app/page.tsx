/*
 * @Author: li wei wang
 * @Date: 2025-04-19 11:57:58
 * @Description: Changes in this update:
 * 1.Import CSS to add bubbles and label gradient. 
 * When the remaining time is less than one hour before the deadline, the label gradually turns pink,
 * the number of bubbles increases until the label disappears.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles/bubbles.css';
import axios from 'axios';

<style jsx global>{`
  .perspective {
    perspective: 1000px;
  }
  .card3d {
    transition: transform 0.7s;
    transform-style: preserve-3d;
  }
  .card-front, .card-back {
    backface-visibility: hidden;
  }
  .card-back {
    transform: rotateY(180deg);
  }
  @keyframes float {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-40px);
      opacity: 0;
    }
  }
  .animate-float {
    animation: float 4s infinite;
  }
`}</style>

type Post = {
    id: string;
    title: string;
    startLocation: string;
    endLocation: string;
    startTime: string;
    endTime: string;
    carModel: string;
    createdAt: number;
    status: 'active' | 'completed' | 'pinned';
};
type Bubble = {
    postId: string;
    left: number;
    top: number;
    id: string;
};
export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [now, setNow] = useState(Date.now());
    const [weather, setWeather] = useState<{
        temp: number;
        description: string;
        icon: string;
        hourly: { time: string[]; temperature_2m: number[] };
        daily: { time: string[]; temperature_2m_max: number[]; temperature_2m_min: number[] };
    } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPosts(data);
                } else {
                    console.error('Invalid posts data format:', data);
                    setPosts([]);
                }
            })
            .catch(err => console.error('Failed to fetch posts:', err));
    }, []);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await axios.get(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
                );
                const current = response.data.current_weather;
                const hourly = response.data.hourly;
                const daily = response.data.daily;
                const weatherCodeMap: Record<number, { label: string; icon: string }> = {
                    0: { label: 'Clear sky', icon: '☀️' },
                    1: { label: 'Mainly clear', icon: '🌤️' },
                    2: { label: 'Partly cloudy', icon: '⛅' },
                    3: { label: 'Overcast', icon: '☁️' },
                    45: { label: 'Fog', icon: '🌫️' },
                    48: { label: 'Depositing rime fog', icon: '🌁' },
                    51: { label: 'Light drizzle', icon: '🌦️' },
                    53: { label: 'Moderate drizzle', icon: '🌦️' },
                    55: { label: 'Dense drizzle', icon: '🌧️' },
                    61: { label: 'Slight rain', icon: '🌦️' },
                    63: { label: 'Moderate rain', icon: '🌧️' },
                    65: { label: 'Heavy rain', icon: '🌧️' },
                    71: { label: 'Slight snow', icon: '🌨️' },
                    73: { label: 'Moderate snow', icon: '🌨️' },
                    75: { label: 'Heavy snow', icon: '❄️' },
                    95: { label: 'Thunderstorm', icon: '⛈️' },
                };
                const weatherInfo = weatherCodeMap[current.weathercode] || { label: 'Unknown', icon: '❔' };
                setWeather({
                    temp: current.temperature,
                    description: weatherInfo.label,
                    icon: weatherInfo.icon,
                    hourly,
                    daily,
                });
            } catch (error) {
                console.error('Failed to fetch weather:', error);
            }
        });
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 10000); // update every 10s
        return () => clearInterval(interval);
    }, []);
    // const handleAdminClick = () => {
    //     window.location.href = '/login';
    // };
    const calculateTimeDiff = (endTime: string) => {
        return new Date(endTime).getTime() - now;
    };
    // Bubble loop
    useEffect(() => {
        const interval = setInterval(() => {
            const oneHour = 60 * 60 * 1000;
            const activePost = posts
                .filter(p => p.status !== 'completed')
                .filter(p => {
                    const diff = calculateTimeDiff(p.endTime);
                    return diff > 0 && diff <= oneHour;
                })
                .sort((a, b) => calculateTimeDiff(a.endTime) - calculateTimeDiff(b.endTime))[0];
            if (activePost) {
                const newBubble: Bubble = {
                    id: `${activePost.id}-${Math.random()}`,
                    postId: activePost.id,
                    left: Math.random() * 80,
                    top: Math.random() * 80,
                };
                setBubbles(prev => [...prev, newBubble]);
                setTimeout(() => {
                    setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
                }, 2000);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [posts]);
    const pinned = posts.filter(p => p.status === 'pinned');
    const active = posts.filter(p => p.status === 'active');
    const allVisiblePosts = [...pinned, ...active];
    const filteredPosts = allVisiblePosts
        .filter((post) =>
            post.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.endLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.carModel.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (a.status === 'pinned' && b.status !== 'pinned') return -1;
            if (a.status !== 'pinned' && b.status === 'pinned') return 1;
            return calculateTimeDiff(a.endTime) - calculateTimeDiff(b.endTime);
        });
    // Weather: next 6 hours logic
    let next6Hours: string[] = [];
    let currentHourIndex = 0;
    if (weather?.hourly?.time) {
        const getLocalHour = (isoString: string) =>
            new Date(isoString + 'Z').getHours();
        const nowHour = new Date().getHours();
        currentHourIndex = weather.hourly.time.findIndex((t) =>
            getLocalHour(t) === nowHour
        );
        if (currentHourIndex === -1) currentHourIndex = 0;
        next6Hours = weather.hourly.time.slice(currentHourIndex, currentHourIndex + 6) || [];
    }
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            {weather && (
                <div className="w-full pt-4 flex justify-center">
                    <div className="bg-blue-50 rounded-xl shadow p-3 w-full max-w-xl">
                        <div className="text-center mb-2">
                            <div className="text-5xl font-extrabold text-gray-900">{weather.temp.toFixed(1)}°C</div>
                            <div className="text-lg text-gray-700 flex items-center justify-center gap-2 mt-1">
                                <span>{weather.description}</span>
                                <span className="text-2xl">{weather.icon}</span>
                            </div>
                        </div>
                        <div className="mb-2">
                            <div className="text-xs font-semibold text-gray-600 mb-1">Next 6 Hours</div>
                            <div className="grid grid-cols-6 gap-1 text-sm text-center text-gray-800">
                                {next6Hours.map((t, i) => (
                                    <div key={t} className="bg-white rounded border border-gray-200 py-1">
                                        <div className="text-gray-600">
                                            {new Date(t + 'Z').toLocaleTimeString(undefined, {
                                                hour: '2-digit',
                                                hour12: false,
                                            })}
                                        </div>
                                        <div>{weather.hourly.temperature_2m[currentHourIndex + i].toFixed(1)}°</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-gray-600 mb-1">Next 3 Days</div>
                            <div className="grid grid-cols-3 gap-2 text-sm text-center text-gray-800">
                                {weather.daily.time.slice(0, 3).map((d, i) => (
                                    <div key={d} className="bg-white rounded border border-gray-200 py-1">
                                        <div className="text-gray-600">{new Date(d).toLocaleDateString(undefined, { weekday: 'short' })}</div>
                                        <div>{weather.daily.temperature_2m_min[i].toFixed(1)}° / {weather.daily.temperature_2m_max[i].toFixed(1)}°</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-center pt-6">
                <input
                    type="text"
                    placeholder="Search by location or car model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 text-gray-900"
                />
            </div>
            <div className="flex-1 w-full px-6 flex justify-center mt-4">
                <div className="w-full max-w-screen-xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center w-full">
                        {filteredPosts
                            .map(post => {
                                const timeDiff = calculateTimeDiff(post.endTime);
                                const oneHour = 60 * 60 * 1000;
                                const isNearOneHour = timeDiff > 0 && timeDiff <= oneHour;
                                const progress = isNearOneHour ? 1 - (timeDiff / oneHour) : 0;
                                const lightBlue = { r: 219, g: 234, b: 254 }; // Tailwind's blue-100
                                const pink = { r: 251, g: 207, b: 232 }; // Tailwind's pink-200
                                const r = Math.round(lightBlue.r + (pink.r - lightBlue.r) * progress);
                                const g = Math.round(lightBlue.g + (pink.g - lightBlue.g) * progress);
                                const b = Math.round(lightBlue.b + (pink.b - lightBlue.b) * progress);
                                const bgColor = `rgb(${r}, ${g}, ${b})`;
                                const isExpired = timeDiff <= 0;
                                if (isExpired && post.status !== 'pinned') return null;
                                return (
                                    <div key={post.id} className="relative perspective group">
                                        <div className="card3d relative w-[240px] h-[260px] transition-transform duration-700 [transform-style:preserve-3d] [transform:rotateY(0deg)] group-hover:[transform:rotateY(180deg)]">
                                            <div
                                                className="card-front absolute inset-0 w-[240px] h-[260px] border border-blue-200 bg-white rounded-lg p-5 shadow transition flex flex-col justify-between [backface-visibility:hidden]"
                                                style={{ backgroundColor: bgColor }}
                                            >
                                                {post.status === 'pinned' && (
                                                    <div className="absolute top-2 right-2 text-xl">📌</div>
                                                )}
                                                <div>
                                                    <h2 className="text-lg font-semibold mb-2 text-gray-900">{post.title}</h2>
                                                    <p className="text-gray-800"><strong>From:</strong> {post.startLocation}</p>
                                                    <p className="text-gray-800"><strong>To:</strong> {post.endLocation}</p>
                                                    <p className="text-gray-800"><strong>Car Model:</strong> {post.carModel}</p>
                                                    <p className="text-gray-800">
                                                        <strong>Remaining:</strong> {formatRemainingTime(post.endTime, now)}
                                                    </p>
                                                    {isExpired && (
                                                        <p className="text-sm text-red-600 font-medium">Expired</p>
                                                    )}
                                                </div>
                                                <Link
                                                    href={`/post/${post.id}`}
                                                    className="text-blue-700 mt-2 font-medium hover:underline"
                                                >
                                                    View Details →
                                                </Link>
                                                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                                                    {[...Array(10)].map((_, i) => (
                                                        <div key={i} className="absolute w-1 h-1 rounded-full bg-blue-200 animate-float" style={{
                                                            left: `${Math.random() * 100}%`,
                                                            top: `${Math.random() * 100}%`,
                                                            animationDelay: `${Math.random() * 5}s`,
                                                        }} />
                                                    ))}
                                                </div>
                                                {/* Bubble */}
                                                {bubbles
                                                    .filter(b => b.postId === post.id)
                                                    .map(bubble => (
                                                        <div
                                                            key={bubble.id}
                                                            className="bubble"
                                                            style={{
                                                                top: `${bubble.top}%`,
                                                                left: `${bubble.left}%`,
                                                            }}
                                                        />
                                                    ))}
                                            </div>
                                            <div
                                                className="card-back absolute inset-0 w-[240px] h-[260px] bg-blue-100 rounded-lg p-5 text-center text-sm text-gray-800 flex flex-col justify-center items-center [transform:rotateY(180deg)] [backface-visibility:hidden]"
                                            >
                                                <div className="text-lg font-semibold mb-2">Summary</div>
                                                <p className="mb-2">This ride is available and monitored.</p>
                                                <Link href={`/post/${post.id}`} className="text-blue-700 hover:underline">
                                                    View Full Details →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </main>
    );
}

const formatRemainingTime = (endTime: string, now: number): string => {
    const diff = new Date(endTime).getTime() - now;
    if (diff <= 0) return 'Expired';
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;
    return `${hours}h ${remMinutes}m`;
};
