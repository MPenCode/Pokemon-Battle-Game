import { useEffect, useState } from 'react';

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
