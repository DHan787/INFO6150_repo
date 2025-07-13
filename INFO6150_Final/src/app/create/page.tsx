/*
 * @Author: li wei wang
 * @Date: 2025-04-19 11:57:58
 * @Description: Changes in this update:
 * 1. Added validation rules for the location field;
 * 2. Added frontend validation to ensure valid date and time inputs;
 * 3. Adjusted the carBrand -> carModel cascading dropdown behavior and added a car color selection.
 * 4.add data-carModels className="json"
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import carModels from '../../data/carModels.json';



type ErrorFields = {
    carYear?: string;
    carColor?: string;
    startLocation?: string;
    endLocation?: string;
};

const CreatePostPage: React.FC = () => {
    const router = useRouter();
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [carBrand, setCarBrand] = useState('');
    const [carModel, setCarModel] = useState('');
    const [carYear, setCarYear] = useState('');
    const [carColor, setCarColor] = useState('');
    const [message, setMessage] = useState('');
    const [remarks, setRemarks] = useState('');
    const [errors, setErrors] = useState<ErrorFields>({});
    const localNow = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    const validColors = ["red", "yellow", "white", "green", "blue", "gray", "black", "orange", "other"];
    const validateCarYear = (year: string) => {
        const numYear = parseInt(year);
        if (isNaN(numYear) || numYear < 1900 || numYear > 2025) {
            return "Car year must be between 1900 and 2025.";
        }
        return "";
    };
    const validateCarColor = (color: string) => {
        if (!validColors.includes(color.toLowerCase())) {
            return "Car color must be one of the following: red, yellow, white, green, blue, gray, black, orange, other.";
        }
        return "";
    };
    const validateLocation = (location: string) => {
        if (/^\d+$/.test(location)) {
            return "Location cannot be purely numeric.";
        }
        if (location.length < 3 || location.length > 50) {
            return "Location must be between 3 and 50 characters.";
        }
        return "";
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const start = new Date(startTime);
        const end = new Date(endTime);
        const current = new Date();
        const carYearError = validateCarYear(carYear);
        const carColorError = validateCarColor(carColor);
        const startLocationError = validateLocation(startLocation);
        const endLocationError = validateLocation(endLocation);
        if (start < current) {
            window.alert('Start time cannot be before the current date and time.');
            return;
        }
        if (end < current) {
            window.alert('End time cannot be before the current date and time.');
            return;
        }
        if (end < start) {
            window.alert('End time cannot be earlier than Start time.');
            return;
        }
        if (carYearError || carColorError || startLocationError || endLocationError) {
            setErrors({
                carYear: carYearError,
                carColor: carColorError,
                startLocation: startLocationError,
                endLocation: endLocationError,
            });
            return;
        }
        const postData = {
            id: Date.now().toString(),
            startLocation,
            endLocation,
            startTime,
            endTime,
            carBrand,
            carModel,
            carYear,
            carColor,
            message,
            remarks,
            status: 'active',
        };
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });
        if (res.ok) {
            router.push('/');
        } else {
            alert('Failed to create post.');
        }
    };
    return (
        <div className="text-gray-800">
            <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
                <h2 className="text-2xl font-bold text-center mb-6">Create Form</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Start Location */}
                    <div>
                        <label htmlFor="startLocation" className="block text-sm font-medium text-gray-700">Start Location</label>
                        <input
                            type="text"
                            id="startLocation"
                            value={startLocation}
                            onChange={(e) => {
                                setStartLocation(e.target.value);
                                const err = validateLocation(e.target.value);
                                setErrors((prev) => ({ ...prev, startLocation: err }));
                            }}
                            className="w-full p-2.5 border border-gray-300 rounded-md"
                            placeholder="Enter start location"
                            required
                        />
                        {errors.startLocation && <span className="text-red-500 text-xs">{errors.startLocation}</span>}
                    </div>
                    {/* End Location */}
                    <div>
                        <label htmlFor="endLocation" className="block text-sm font-medium text-gray-700">End Location</label>
                        <input
                            type="text"
                            id="endLocation"
                            value={endLocation}
                            onChange={(e) => {
                                setEndLocation(e.target.value);
                                const err = validateLocation(e.target.value);
                                setErrors((prev) => ({ ...prev, endLocation: err }));
                            }}
                            className="w-full p-2.5 border border-gray-300 rounded-md"
                            placeholder="Enter end location"
                            required
                        />
                        {errors.endLocation && <span className="text-red-500 text-xs">{errors.endLocation}</span>}
                    </div>
                    {/* Start & End Time */}
                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input
                            type="datetime-local"
                            id="startTime"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md"
                            min={localNow}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                        <input
                            type="datetime-local"
                            id="endTime"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md"
                            min={localNow}
                            required
                        />
                    </div>
                    {/* Car Brand & Model */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="carBrand" className="block text-sm font-medium text-gray-700">Car Brand</label>
                            <select
                                id="carBrand"
                                value={carBrand}
                                onChange={(e) => {
                                    setCarBrand(e.target.value);
                                    setCarModel('');
                                }}
                                className="w-full p-2.5 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Brand</option>
                                {Object.keys(carModels).map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">Car Model</label>
                            <select
                                id="carModel"
                                value={carModel}
                                onChange={(e) => setCarModel(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-md"
                                required
                                disabled={!carBrand}
                            >
                                <option value="">Select Model</option>
                                {carBrand && carModels[carBrand as keyof typeof carModels].map((model: string) => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Car Year & Color */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="carYear" className="block text-sm font-medium text-gray-700">Car Year</label>
                            <input
                                type="text"
                                id="carYear"
                                value={carYear}
                                onChange={(e) => {
                                    setCarYear(e.target.value);
                                    const err = validateCarYear(e.target.value);
                                    setErrors((prev) => ({ ...prev, carYear: err }));
                                }}
                                className="w-full p-2.5 border border-gray-300 rounded-md"
                                placeholder="Enter car year"
                                required
                            />
                            {errors.carYear && <span className="text-red-500 text-xs">{errors.carYear}</span>}
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="carColor" className="block text-sm font-medium text-gray-700">Car Color</label>
                            <select
                                id="carColor"
                                value={carColor}
                                onChange={(e) => {
                                    setCarColor(e.target.value);
                                    const err = validateCarColor(e.target.value);
                                    setErrors(prev => ({ ...prev, carColor: err }));
                                }}
                                className="w-full p-2.5 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select car color</option>
                                {validColors.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                            {errors.carColor && <span className="text-red-500 text-xs">{errors.carColor}</span>}
                        </div>
                    </div>
                    {/* Message & Remarks */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md"
                            placeholder="Enter a message"
                        />
                    </div>
                    <div>
                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks</label>
                        <textarea
                            id="remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md"
                            placeholder="Enter any remarks"
                        />
                    </div>
                    <div>
                        <button type="submit" className="w-full bg-black text-white p-2 rounded-md">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default CreatePostPage;
