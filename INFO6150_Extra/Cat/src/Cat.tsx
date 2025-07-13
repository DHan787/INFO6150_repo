import { useEffect, useState } from 'react';

type CatBreed = {
  id: string;
  name: string;
  origin: string;
  description: string;
  image?: {
    url: string;
  };
};

export default function CatList() {
  const [breeds, setBreeds] = useState<CatBreed[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const breedsPerPage = 10;

  useEffect(() => {
    fetch('https://api.thecatapi.com/v1/breeds', {
      headers: {
        'x-api-key': 'live_EwEKge1Wpqz5PSVHtcmbxYaQr1v8KSg4lAmrb0YHJ5DWYDYq6ZwIpiaspk6VccJV',
      },
    })
      .then((res) => res.json())
      .then((data) => setBreeds(data))
      .catch((err) => console.error('Failed to fetch breeds', err));
  }, []);

  const filteredBreeds = breeds.filter((breed) =>
    breed.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBreed = currentPage * breedsPerPage;
  const indexOfFirstBreed = indexOfLastBreed - breedsPerPage;
  const currentBreeds = filteredBreeds.slice(indexOfFirstBreed, indexOfLastBreed);

  const totalPages = Math.ceil(filteredBreeds.length / breedsPerPage);
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>🐱 Cat Breed Finder</h1>
        <p>Type a breed name to learn more about it!</p>
        <input
          type="text"
          placeholder="Search breed..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search for a cat breed"
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            width: '80%',
            maxWidth: '400px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
      </header>

      <section style={{ display: 'grid', gap: '1.5rem' }}>
        {currentBreeds.length === 0 ? (
          <p role="status">No matching breeds found.</p>
        ) : (
          currentBreeds.map((breed) => (
            <article
              key={breed.id}
              style={{
                border: '1px solid #eee',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                color: '#333',
              }}
            >
              {breed.image?.url && (
                <img
                  src={breed.image.url}
                  alt={`A ${breed.name} cat`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}
                />
              )}
              <h2>{breed.name}</h2>
              <p><strong>Origin:</strong> {breed.origin}</p>
              <p>{breed.description}</p>
            </article>
          ))
        )}
      </section>
      <nav style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} style={{ marginRight: '1rem' }}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} style={{ marginLeft: '1rem' }}>
          Next
        </button>
      </nav>
    </main>
  );
}