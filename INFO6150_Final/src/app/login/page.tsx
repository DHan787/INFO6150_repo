'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Page: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isMounted, setIsMounted] = useState(false);
    const [carImage, setCarImage] = useState('/images/car1.jpg');
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const images = ['/images/car1.jpg', '/images/car2.jpg', '/images/car3.jpg'];
        let index = 0;
        const interval = setInterval(() => {
            setCarImage(images[index]);
            index = (index + 1) % images.length;
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phonePattern = /^[0-9]{10,15}$/;
        let loginData;
        if (emailPattern.test(inputValue)) {
            loginData = { email: inputValue, password };
        } else if (phonePattern.test(inputValue)) {
            loginData = { phone: inputValue, password };
        } else {
            alert('Invalid input. Please enter a valid email or phone number.');
            return;
        }
        localStorage.setItem('jwt', 'simulated-jwt-token');
        alert('Login successful!');
        localStorage.setItem('adminLoggedIn', 'true');
        console.log('Login data:', loginData);
        router.push('/admin');
    };
    const handleGuestModeClick = () => {
        localStorage.setItem('jwt', 'simulated-guest-jwt-token');
        router.push('/create');
    };
    if (!isMounted) return null;
    return (
        <section className="bg-gray-50 flex flex-col min-h-screen overflow-hidden">
            <div className="flex flex-col h-screen">
                <div className="flex-grow flex items-center justify-center px-6 py-8 mx-auto overflow-hidden">
                    <div className="flex flex-col md:flex-col bg-white rounded-lg shadow-lg p-6 space-y-4 md:space-y-4">
                        <div className="flex justify-center items-center">
                            <Image
                                src={carImage}
                                alt="car logo"
                                height={260}
                                width={300}
                                className="rounded-lg object-cover"
                                style={{ clipPath: 'inset(1% 0 10% 0)' }}
                            />
                        </div>
                        <div className="flex flex-col justify-center w-full max-w-md">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl mb-4">
                                Log in
                            </h1>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="inputField" className="block text-sm font-medium text-gray-900">
                                        Email or mobile phone number
                                    </label>
                                    <input
                                        type="text"
                                        name="inputField"
                                        id="inputField"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        className="bg-gray-50 border border-gray-900 text-gray-900 sm:text-sm rounded-lg p-2.5 w-full block"
                                        placeholder="name@company.com or phone number"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                        Your password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-gray-50 border border-gray-900 text-gray-900 sm:text-sm rounded-lg p-2.5 w-full block"
                                        placeholder="Password"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white bg-gray-700 hover:bg-gray-500 font-bold text-base py-2.5 rounded-lg px-5 text-center"
                                >
                                    Continue
                                </button>
                            </form>
                            <div className="mt-6 flex items-center justify-center w-full">
                                <hr className="flex-grow border-t-1 border-gray-300" style={{ maxWidth: '150px' }} />
                                <span className="mx-4 text-sm font-light text-gray-500">New to Pin Car?</span>
                                <hr className="flex-grow border-t-1 border-gray-300" style={{ maxWidth: '150px' }} />
                            </div>
                            <button
                                onClick={handleGuestModeClick}
                                className="border border-gray-600 text-custom-red font-bold text-[1.2rem] px-8 py-3 rounded-lg text-center hover:bg-gray-300 transition duration-400 block mt-4"
                            >
                                Guest Mode
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Page;
