/*
 * @Author: Jiang Han
 * @Date: 2025-04-18 16:35:34
 * @Description: 
 */
import React from 'react';
import { CatBreed } from '../types';

const BreedDetails: React.FC<{ breed: CatBreed }> = ({ breed }) => (
    <div>
        <h2>{breed.name}</h2>
        {breed.image?.url && <img src={breed.image.url} alt={breed.name} width={300} />}
        <p><strong>Origin:</strong> {breed.origin}</p>
        <p><strong>Temperament:</strong> {breed.temperament}</p>
        <p><strong>Description:</strong> {breed.description}</p>
    </div>
);

export default BreedDetails;