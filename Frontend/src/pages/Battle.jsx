import { useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'roster';
const COMPUTER_ROSTER_KEY = 'computerRoster';

const Battle = () => {
  const [roster, setRoster] = useState([]);
  const [opponentPokemon, setOpponentPokemon] = useState(null);
  const [playerPokemon, setPlayerPokemon] = useState(null); // State for selected player Pokémon

  // Load player roster and computer roster from localStorage on initial load
  useEffect(() => {
    const storedRoster = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setRoster(storedRoster);

    const computerRoster = JSON.parse(localStorage.getItem(COMPUTER_ROSTER_KEY)) || [];
    if (computerRoster.length > 0) {
      const randomOpponent = computerRoster[Math.floor(Math.random() * computerRoster.length)];
      setOpponentPokemon(randomOpponent);
    }
  }, []);

  const handlePlayerPokemonSelect = (pokemon) => {
    setPlayerPokemon(pokemon);
  };

  return (
    <div className="flex h-screen">
      {/* Battle screen */}
      <div className="battleScreen w-[70%] bg-gray-200 p-4">
        <h2>Battle Arena</h2>
        <div className='scoreBoard flex gap-2'>
          <div className='winSymbol text-white border-2 border-black rounded-full p-5 w-10 h-10 bg-green-500 flex items-center justify-center'>W</div>
          <div className='drawSymbol text-white border-2 border-black rounded-full p-5 w-10 h-10 bg-yellow-500 flex items-center justify-center'>D</div>
          <div className='looseSymbol text-white border-2 border-black rounded-full p-5 w-10 h-10 bg-red-500 flex items-center justify-center'>L</div>
          <div className='emptySymbol text-white border-2 border-black rounded-full p-5 w-10 h-10'></div>
          <div className='emptySymbol text-white border-2 border-black rounded-full p-5 w-10 h-10'></div>
          <div className='emptySymbol text-white border-2 border-black rounded-full p-5 w-10 h-10'></div>
        </div>

        {/* Opponent Pokémon */}
        <div className='opponentContainer flex justify-end'>
          {opponentPokemon && (
            <div className='opponentPokemon items-center text-center'>
              <img src={opponentPokemon.animatedSprite || opponentPokemon.sprite} alt={opponentPokemon.name} />
              <h3>{opponentPokemon.name.charAt(0).toUpperCase() + opponentPokemon.name.slice(1)}</h3>
              <p>Attack: {opponentPokemon.attack}</p>
              <p>Defense: {opponentPokemon.defense}</p>
              <p>Speed: {opponentPokemon.speed}</p>
            </div>
          )}
        </div>

        {/* Player Pokémon */}
        <div className='playerContainer flex justify-start'>
          {playerPokemon ? (
            <div className='playerPokemon items-center text-center'>
              <img src={playerPokemon.animatedBackSprite || playerPokemon.sprite} alt={playerPokemon.name} />
              <h3>{playerPokemon.name.charAt(0).toUpperCase() + playerPokemon.name.slice(1)}</h3>
              <p>Attack: {playerPokemon.attack}</p>
              <p>Defense: {playerPokemon.defense}</p>
              <p>Speed: {playerPokemon.speed}</p>
            </div>
          ) : (
            <p>Select a Pokémon from your roster to start</p>
          )}
        </div>
      </div>

      {/* Roster section (Right 30%) */}
      <div className="roster w-[30%] min-h-screen bg-[#ED1F24] flex flex-col justify-between p-4">
        <h2 className="text-center text-2xl font-semibold mb-4">Your Roster</h2>

        <div className="rosterList space-y-4 overflow-y-auto flex-1">
          {roster.map((pokemon) => (
            <div
              key={pokemon.id}
              className="rosterCard flex items-center p-4 border-2 border-black relative cursor-pointer"
              onClick={() => handlePlayerPokemonSelect(pokemon)} // Set playerPokemon when clicked
            >
              <img className="pokeRosterPreview w-20 h-20 mr-4" src={pokemon.sprite} alt={pokemon.name} />
              <h3 className="pokeRosterName flex-1 text-center">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Battle;
