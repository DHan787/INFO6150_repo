/*
 * @Author: Jiang Han
 * @Date: 2025-04-18 16:35:24
 * @Description: 
 */
import React from 'react';
import { CatBreed } from '../types';

interface Props {
    breeds: CatBreed[];
    onSelect: (id: string) => void;
}

const BreedSelector: React.FC<Props> = ({ breeds, onSelect }) => (
    <select onChange={(e) => onSelect(e.target.value)} defaultValue="">
        <option value="" disabled>Select a breed</option>
        {breeds.map(breed => (
            <option key={breed.id} value={breed.id}>{breed.name}</option>
        ))}
    </select>
);

export default BreedSelector;