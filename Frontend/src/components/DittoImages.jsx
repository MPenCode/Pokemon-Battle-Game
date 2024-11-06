import { useEffect, useState } from 'react';

const DittoImages = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchDittoImages = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/charizard');
        const data = await response.json();

        // Extract sprite names and URLs
        const spriteEntries = Object.entries(data.sprites)
          .concat(Object.entries(data.sprites.versions['generation-v']['black-white'].animated))
          .filter(([key, url]) => typeof url === 'string'); // Only keep entries with valid URLs

        // Log each sprite's key and URL
        console.log("Available Ditto sprites:", spriteEntries);

        // Set images with both key and URL for display
        setImages(spriteEntries);
      } catch (error) {
        console.error("Failed to fetch Ditto's images:", error);
      }
    };

    fetchDittoImages();
  }, []);

  return (
    <div className="flex flex-wrap justify-center space-x-4">
      {images.length > 0 ? (
        images.map(([key, url], index) => (
          <div key={index} className="m-2 text-center">
            <img src={url} alt={`Ditto sprite ${key}`} className="w-24 h-24" />
            <p className="text-sm mt-2">{key}</p>
          </div>
        ))
      ) : (
        <p>Loading Ditto images...</p>
      )}
    </div>
  );
};

export default DittoImages;
