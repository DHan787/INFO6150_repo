/*
 * @Author: Jiang Han
 * @Date: 2025-04-18 16:34:51
 * @Description: 
 */
import React, { useEffect, useState } from 'react';
import { CatBreed } from './types';
import BreedSelector from './components/BreedSelector';
import BreedDetails from './components/BreedDetails';

const App: React.FC = () => {
    const [breeds, setBreeds] = useState<CatBreed[]>([]);
    const [selectedBreed, setSelectedBreed] = useState<CatBreed | null>(null);

    useEffect(() => {
        fetch("https://api.thecatapi.com/v1/breeds")
            .then(res => res.json())
            .then(setBreeds)
            .catch(console.error);
    }, []);

    const handleSelect = (breedId: string) => {
        const breed = breeds.find(b => b.id === breedId) || null;
        setSelectedBreed(breed);
    };

    return (
        <div>
            <h1>Cat Breed Finder</h1>
            <BreedSelector breeds={breeds} onSelect={handleSelect} />
            {selectedBreed && <BreedDetails breed={selectedBreed} />}
        </div>
    );
};

export default App;