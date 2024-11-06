import { useEffect, useState } from 'react';
import axios from 'axios';

const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon';
const LOCAL_STORAGE_KEY = 'roster';

const fetchPokemonById = async (id) => {
  const response = await axios.get(`${POKEMON_API_URL}/${id}`);
  const pokemon = response.data;

  return {
    id: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprites?.front_default,
    attack: pokemon.stats?.find(stat => stat.stat.name === 'attack')?.base_stat,
    defense: pokemon.stats?.find(stat => stat.stat.name === 'defense')?.base_stat,
    speed: pokemon.stats?.find(stat => stat.stat.name === 'speed')?.base_stat,
  };
};

const Home = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    const storedRoster = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setRoster(storedRoster);
  }, []);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const pokemonPromises = Array.from({ length: 151 }, (_, i) => fetchPokemonById(i + 1));
        const fetchedData = await Promise.all(pokemonPromises);
        setPokemonData(fetchedData);
      } catch (error) {
        console.error('Failed to fetch Pokémon data:', error);
      }
    };

    fetchPokemonData();
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(roster));
  }, [roster]);

  const handleAddToRoster = (pokemon) => {
    if (roster.length >= 6 || roster.some(p => p.id === pokemon.id)) {
      alert("You can only add up to 6 unique Pokémon to the roster.");
      return;
    }
    setRoster([...roster, pokemon]);
  };

  const handleRemoveFromRoster = (pokemonId) => {
    setRoster(roster.filter(p => p.id !== pokemonId));
  };

  return (
    <div>
      <div>Nav</div>
      <div className="flex h-screen">
        <div className="pokeGrid w-[70%] bg-[#2EC5B6] grid grid-cols-4 gap-4 p-4 overflow-y-auto">
          {pokemonData.map(pokemon => {
            const isInRoster = roster.some(p => p.id === pokemon.id);
            return (
              <div key={pokemon.id} className="gridCard border-2 border-black p-4">
                <img src={pokemon.sprite} alt={pokemon.name} />
                <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                <h4>No. {String(pokemon.id).padStart(3, '0')}</h4>
                <p>Attack: {pokemon.attack}</p>
                <p>Defense: {pokemon.defense}</p>
                <p>Speed: {pokemon.speed}</p>
                <div className="gridCardBtnContainer flex justify-between mt-2">
                  <button className="infoBtn bg-blue-500 text-white px-4 py-2 rounded">INFO</button>
                  <button
                    className={`addBtn px-4 py-2 rounded ${isInRoster ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 text-white'}`}
                    onClick={() => handleAddToRoster(pokemon)}
                    disabled={isInRoster}
                  >
                    ADD
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Roster section */}
        <div className="roster w-[30%] min-h-screen bg-[#ED1F24] flex flex-col justify-between p-4">
          <h2 className="text-center text-2xl font-semibold mb-4">Roster</h2>

          <div className="rosterList space-y-4 overflow-y-auto flex-1">
            {roster.map(pokemon => (
              <div key={pokemon.id} className="rosterCard flex items-center p-4 border-2 border-black relative">
                <img className="pokeRosterPreview w-20 h-20 mr-4" src={pokemon.sprite} alt={pokemon.name} />
                <h3 className="pokeRosterName flex-1 text-center">
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </h3>
                <button
                  className="removeFromRosterBtn absolute top-2 right-2 text-black"
                  onClick={() => handleRemoveFromRoster(pokemon.id)}
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <button
            className={`font-bold py-2 px-4 rounded w-full mt-4 mb-4 ${roster.length < 6 ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 text-white'}`}
            disabled={roster.length < 6}
          >
            BATTLE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
