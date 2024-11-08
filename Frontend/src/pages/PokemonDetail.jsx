import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav";
import "animate.css";

const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon";

const fetchPokemonById = async (id) => {
  const response = await axios.get(`${POKEMON_API_URL}/${id}`);
  const pokemon = response.data;

  return {
    id: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprites?.front_default,
    animatedSprite:
      pokemon.sprites?.versions?.["generation-v"]?.["black-white"]?.animated
        ?.front_default,
    attack: pokemon.stats?.find((stat) => stat.stat.name === "attack")
      ?.base_stat,
    defense: pokemon.stats?.find((stat) => stat.stat.name === "defense")
      ?.base_stat,
    speed: pokemon.stats?.find((stat) => stat.stat.name === "speed")?.base_stat,
    cries: pokemon.cries,
  };
};

const PokemonDetailPage = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const pokemonDetails = await fetchPokemonById(id);
      setPokemon(pokemonDetails);
    };

    fetchPokemonDetails();
  }, [id]);

  const playSound = (soundUrl) => {
    const audio = new Audio(soundUrl);
    audio.play();
  };

  if (!pokemon) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Nav />
      <div className="flex justify-center py-16">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-10">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-2 lg:space-y-0 lg:space-x-2">
            {/* Pokémon Name and Animated Sprite */}
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-extrabold text-gray-800 mb-4 animate__animated animate__fadeIn animate__delay-0.5s animate__zoomIn">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </h1>
              <div className="w-64 h-64 sm:w-96 sm:h-96 xl:w-128 xl:h-128 overflow-hidden rounded-xl shadow-2xl bg-gray-50 flex justify-center items-center animate__animated animate__fadeIn animate__delay-.2s animate__bounceIn">
                <img
                  className="object-contain max-w-full max-h-full"
                  src={pokemon.animatedSprite}
                  alt={`${pokemon.name} animated`}
                />
              </div>
            </div>

            {/* Pokemon Details */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-center text-gray-700">
                <div>
                  <h3 className="font-medium text-lg">Attack</h3>
                  <p className="text-xl font-semibold">{pokemon.attack}</p>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Defense</h3>
                  <p className="text-xl font-semibold">{pokemon.defense}</p>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Speed</h3>
                  <p className="text-xl font-semibold">{pokemon.speed}</p>
                </div>
              </div>

              {/* Play Sound Button */}
              {pokemon.cries && pokemon.cries.latest && (
                <div className="mt-8">
                  <button
                    onClick={() => playSound(pokemon.cries.latest)}
                    className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-full shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                  >
                    Play Pokémon Cry
                  </button>
                </div>
              )}

              {/* Back to Home Button */}
              <div className="mt-6">
                <button
                  onClick={() => navigate("/")}
                  className="w-full sm:w-auto bg-gray-800 text-white px-8 py-3 rounded-full shadow-md hover:bg-gray-900 transition duration-300 transform hover:scale-105"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;
