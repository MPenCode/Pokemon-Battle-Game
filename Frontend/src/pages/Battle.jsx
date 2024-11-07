import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav';

const LOCAL_STORAGE_KEY = 'roster';
const COMPUTER_ROSTER_KEY = 'computerRoster';
const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon';

const Battle = () => {
  const navigate = useNavigate();
  const [roster, setRoster] = useState([]);
  const [opponentPokemon, setOpponentPokemon] = useState(null);
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [scoreboard, setScoreboard] = useState([]);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [usedPokemon, setUsedPokemon] = useState(new Set());
  const [opponentIndex, setOpponentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    loadPlayerRoster();
    loadComputerRoster();
  }, []);

  const loadPlayerRoster = () => {
    const storedRoster = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setRoster(storedRoster);
  };

  const loadComputerRoster = () => {
    const computerRoster = JSON.parse(localStorage.getItem(COMPUTER_ROSTER_KEY)) || [];
    if (computerRoster.length > 0) {
      setOpponentPokemon(computerRoster[0]);
      setOpponentIndex(0);
    }
  };

  const fetchPokemonById = async (id) => {
    const response = await axios.get(`${POKEMON_API_URL}/${id}`);
    const pokemon = response.data;
    return {
      id: pokemon.id,
      name: pokemon.name,
      sprite: pokemon.sprites?.front_default,
      animatedSprite: pokemon.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default,
      attack: pokemon.stats?.find(stat => stat.stat.name === 'attack')?.base_stat,
      defense: pokemon.stats?.find(stat => stat.stat.name === 'defense')?.base_stat,
      speed: pokemon.stats?.find(stat => stat.stat.name === 'speed')?.base_stat,
    };
  };

  const generateComputerRoster = async () => {
    const newComputerRoster = [];
    while (newComputerRoster.length < 6) {
      const randomId = Math.floor(Math.random() * 151) + 1;
      if (!newComputerRoster.some((p) => p.id === randomId)) {
        const pokemon = await fetchPokemonById(randomId);
        newComputerRoster.push(pokemon);
      }
    }
    localStorage.setItem(COMPUTER_ROSTER_KEY, JSON.stringify(newComputerRoster));
    loadComputerRoster();
  };

  const handlePlayerPokemonSelect = (pokemon) => {
    if (!usedPokemon.has(pokemon.id)) {
      setPlayerPokemon(pokemon);
    }
  };

  const calculateWinner = (userCard, computerCard) => {
    let userScore = 0;
    let computerScore = 0;
    if (userCard.attack > computerCard.attack) userScore++;
    else if (userCard.attack < computerCard.attack) computerScore++;
    if (userCard.defense > computerCard.defense) userScore++;
    else if (userCard.defense < computerCard.defense) computerScore++;
    if (userCard.speed > computerCard.speed) userScore++;
    else if (userCard.speed < computerCard.speed) computerScore++;
    return { user: userScore, computer: computerScore };
  };

  const handleFightClick = () => {
    if (playerPokemon && opponentPokemon) {
      const result = calculateWinner(playerPokemon, opponentPokemon);
      setScoreboard((prev) => [...prev, result]);
      setRoundsPlayed((prev) => prev + 1);

      if (result.user > result.computer) {
        setScore((prevScore) => prevScore + 10);
      } else if (result.user < result.computer) {
        setScore((prevScore) => prevScore - 10);
      }

      setUsedPokemon((prev) => new Set(prev).add(playerPokemon.id));
      setPlayerPokemon(null);

      const computerRoster = JSON.parse(localStorage.getItem(COMPUTER_ROSTER_KEY)) || [];
      if (opponentIndex < computerRoster.length - 1) {
        setOpponentIndex((prevIndex) => prevIndex + 1);
        setOpponentPokemon(computerRoster[opponentIndex + 1]);
      }
    }
  };

  useEffect(() => {
    if (roundsPlayed === 6) {
      if (score > 0) {
        setResultMessage(`Congratulations! You won this battle and earned ${score} points!`);
      } else if (score < 0) {
        setResultMessage(`Oh no! You got beaten and lost ${Math.abs(score)} points.`);
      } else {
        setResultMessage("Oh wow! This looks like a draw. It's time for a rematch.");
      }
      setShowPopup(true);
    }
  }, [roundsPlayed, score]);

  const resetGame = (newOpponent = false) => {
    setScore(0);
    setRoundsPlayed(0);
    setScoreboard([]);
    setUsedPokemon(new Set());
    setShowPopup(false);
    setPlayerPokemon(null);
    
    if (newOpponent) {
      generateComputerRoster();
    } else {
      loadComputerRoster();
    }
  };

  return (
    <>
    <Nav/>
    <div className="flex h-screen">
      <div className="battleScreen w-[70%] bg-gray-200 p-4 relative flex flex-col items-center justify-center h-1/2">
        <h2 className="scoreCalc absolute top-4 left-4">Your Score: {score}</h2>
        <div className="scoreBoard absolute top-4 flex gap-2">
          {scoreboard.map((result, index) => (
            <div
              key={index}
              className={`rounded-full p-5 w-10 h-10 flex items-center justify-center border-2 border-black ${
                result.user > result.computer ? 'bg-green-500' : result.user < result.computer ? 'bg-red-500' : 'bg-yellow-500'
              } text-white`}
            >
              {result.user > result.computer ? 'W' : result.user < result.computer ? 'L' : 'D'}
            </div>
          ))}
        </div>

        <div className="absolute top-10 right-10">
          {opponentPokemon ? (
            <div className="opponentPokemon items-center text-center">
              <img src={opponentPokemon.animatedSprite || opponentPokemon.sprite} alt={opponentPokemon.name || "Opponent"} />
              <h3>{opponentPokemon.name ? opponentPokemon.name.charAt(0).toUpperCase() + opponentPokemon.name.slice(1) : "Unknown"}</h3>
              <p>Attack: {opponentPokemon.attack || "?"}</p>
              <p>Defense: {opponentPokemon.defense || "?"}</p>
              <p>Speed: {opponentPokemon.speed || "?"}</p>
            </div>
          ) : (
            <p>Loading opponent...</p>
          )}
        </div>

        <div className="absolute bottom-10 left-10">
          {playerPokemon ? (
            <div className="playerPokemon items-center text-center">
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

        {roundsPlayed < 6 ? (
          <button
            className={`startFightBtn mt-6 py-2 px-4 rounded-full text-white ${
              playerPokemon ? 'bg-green-500' : 'bg-gray-500 cursor-not-allowed'
            }`}
            onClick={handleFightClick}
            disabled={!playerPokemon || roundsPlayed >= 6}
          >
            FIGHT
          </button>
        ) : (
          <div className="mt-6 flex gap-4">
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded-full"
              onClick={() => resetGame(false)}
            >
              REMATCH
            </button>
            <button
              className="py-2 px-4 bg-green-500 text-white rounded-full"
              onClick={() => resetGame(true)}
            >
              NEW OPPONENT
            </button>
          </div>
        )}
      </div>

      <div className="roster w-[30%] min-h-screen bg-[#ED1F24] flex flex-col justify-between p-4">
        <h2 className="text-center text-2xl font-semibold mb-4">Your Roster</h2>
        <div className="rosterList space-y-4 overflow-y-auto flex-1">
          {roster.map((pokemon) => (
            <div
              key={pokemon.id}
              className={`rosterCard flex items-center p-4 border-2 border-black relative cursor-pointer ${
                usedPokemon.has(pokemon.id) ? 'bg-gray-300 cursor-not-allowed opacity-70' : ''
              }`}
              onClick={() => handlePlayerPokemonSelect(pokemon)}
            >
              <img className="pokeRosterPreview w-20 h-20 mr-4" src={pokemon.sprite} alt={pokemon.name} />
              <h3 className="pokeRosterName flex-1 text-center">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </h3>
            </div>
          ))}
        </div>
        {roundsPlayed === 6 && (
          <button
            className="mt-4 py-2 px-4 bg-yellow-500 text-white rounded-full"
            onClick={() => navigate('/')} // Navigate to home screen
          >
            EDIT ROSTER
          </button>
        )}
      </div>

      {showPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="popup-content bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h2 className="text-2xl font-semibold mb-4">{resultMessage}</h2>
            <button
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Battle;
