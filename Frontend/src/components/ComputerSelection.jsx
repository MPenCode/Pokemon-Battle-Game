import React, { useState } from "react";

const ComputerSelection = () => {
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRandomPokemon = () => {
    setLoading(true); // Start loading when the button is clicked
    const storedData = localStorage.getItem("pokemonBigBox");
    if (!storedData) {
      console.error("No Pokémon data found in local storage.");
      setLoading(false); // Stop loading if data is missing
      return;
    }

    const pokemonList = JSON.parse(storedData);

    // Randomly select 6 unique Pokémon
    const randomSelection = [];
    const usedIndexes = new Set();

    while (
      randomSelection.length < 6 &&
      randomSelection.length < pokemonList.length
    ) {
      const randomIndex = Math.floor(Math.random() * pokemonList.length);
      if (!usedIndexes.has(randomIndex)) {
        usedIndexes.add(randomIndex);
        randomSelection.push(pokemonList[randomIndex]);
      }
    }

    // Update state with new selection, save to local storage, and stop loading
    setSelectedPokemon(randomSelection);
    localStorage.setItem(
      "computerSelectedBox",
      JSON.stringify(randomSelection)
    );
    setLoading(false); // Stop loading after updating
  };

  return (
    <div className="text-center p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Computer's Random Selection
      </h2>
      <button
        onClick={getRandomPokemon}
        className={`${
          loading
            ? "bg-green-400 cursor-wait"
            : "bg-green-500 hover:bg-green-600"
        } text-white py-3 px-6 rounded-lg transition-all duration-200 transform ${
          loading ? "scale-95" : "scale-100"
        } focus:outline-none`}
        disabled={loading} // Disable button while loading
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
              ></path>
            </svg>
            Loading...
          </span>
        ) : (
          "Select Random Pokémon"
        )}
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {selectedPokemon.map((pokemon, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 text-center"
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-lg font-bold mt-2">{pokemon.name}</h3>
            <p>Attack: {pokemon.attack}</p>
            <p>Defense: {pokemon.defense}</p>
            <p>Speed: {pokemon.speed}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComputerSelection;
