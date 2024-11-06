import React, { useState, useEffect } from "react";

const Battle = () => {
  const [userPokemon, setUserPokemon] = useState([]);
  const [computerPokemon, setComputerPokemon] = useState([]);
  const [computerCard, setComputerCard] = useState(null);
  const [selectedUserCard, setSelectedUserCard] = useState(null);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [scoreboard, setScoreboard] = useState([]);
  const [usedCards, setUsedCards] = useState(new Set()); // To track used user cards
  const [usedComputerCards, setUsedComputerCards] = useState(new Set()); // To track used computer cards

  // Load user and computer data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("pokemonBox");
    const storedComputerData = localStorage.getItem("computerSelectedBox");

    if (storedUserData) {
      setUserPokemon(JSON.parse(storedUserData));
    }

    if (storedComputerData) {
      setComputerPokemon(JSON.parse(storedComputerData));
    }
  }, []);

  // Function to calculate the battle result
  const calculateWinner = (userCard, computerCard) => {
    let userScore = 0;
    let computerScore = 0;

    // Compare Attack
    if (userCard.attack > computerCard.attack) userScore++;
    else if (userCard.attack < computerCard.attack) computerScore++;

    // Compare Defense
    if (userCard.defense > computerCard.defense) userScore++;
    else if (userCard.defense < computerCard.defense) computerScore++;

    // Compare Speed
    if (userCard.speed > computerCard.speed) userScore++;
    else if (userCard.speed < computerCard.speed) computerScore++;

    return { user: userScore, computer: computerScore };
  };

  // Handle the battle logic when the user selects a card
  const handleUserCardSelection = (index) => {
    // Prevent selection if the card is used
    if (selectedUserCard !== null || usedCards.has(index)) return;

    const selectedCard = userPokemon[index];
    const result = calculateWinner(selectedCard, computerCard);

    // Update scoreboard and round count
    setScoreboard((prev) => [...prev, result]);
    setUsedCards((prev) => new Set(prev).add(index)); // Mark the card as used
    setSelectedUserCard(index);
  };

  // Start the battle by showing a random computer card
  const startBattle = () => {
    if (roundsPlayed < 6) {
      let randomIndex;

      // Keep picking a random index until we find an unused one
      do {
        randomIndex = Math.floor(Math.random() * computerPokemon.length);
      } while (usedComputerCards.has(randomIndex));

      // Mark this card as used
      setUsedComputerCards((prev) => new Set(prev).add(randomIndex));
      setComputerCard(computerPokemon[randomIndex]);
      setRoundsPlayed((prev) => prev + 1);
      setSelectedUserCard(null); // Reset selected user card for the new round
    }
    saveResults();
  };

  // Save the results to localStorage
  const saveResults = () => {
    const finalScoreboard = {
      rounds: scoreboard,
      finalUserWins: scoreboard.filter(
        (result) => result.user > result.computer
      ).length,
      finalComputerWins: scoreboard.filter(
        (result) => result.computer > result.user
      ).length,
      finalTies: scoreboard.filter((result) => result.user === result.computer)
        .length,
    };
    localStorage.setItem("scoreboard", JSON.stringify(finalScoreboard));
  };

  const handlePlayClick = () => {
    startBattle();
    saveResults();
  };
  // Disable button after 6 rounds
  const isButtonDisabled = roundsPlayed >= 7;

  return (
    <div className="p-6  mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Begin Battle
      </h2>

      {/* User's Pokémon Display ------------------------------------------------------------------------------ */}
      <div className="flex flex-row justify-center w-[100%] h-[80vh]">
        <div className="w-1/2 bg-gray-200 p-4">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {userPokemon.map((pokemon, index) => (
              <div
                key={index}
                className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 bg-slate-600 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 ease-in-out ${
                  selectedUserCard === index || usedCards.has(index)
                    ? "bg-gray-300 cursor-not-allowed opacity-70"
                    : "bg-gradient-to-t from-blue-500 to-indigo-600 cursor-pointer"
                }`}
                style={{
                  height: "auto",
                  maxWidth: "180px", // Reduce max-width for a smaller card size
                }}
                onClick={() => handleUserCardSelection(index)}
              >
                <div className="relative">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-full h-32 object-cover rounded-lg mb-3 shadow-sm" // Reduce image size for smaller cards
                  />
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-30 rounded-lg"></div>
                </div>
                <div className="text-center text-sm font-semibold text-white">
                  {pokemon.name}
                </div>
                <div className="mt-2 text-xs text-white font-medium">
                  <div className="flex justify-between">
                    <span>Speed</span>
                    <span>{pokemon.speed}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Attack</span>
                    <span>{pokemon.attack}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Defense</span>
                    <span>{pokemon.defense}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Computer Card Display */}
        <div className="w-1/2 bg-gray-300 p-4">
          <div className="flex flex-col items-center  ">
            {computerCard && (
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Computer's Pokémon
                </h3>
                <div className="p-6 bg-slate-200 rounded-xl shadow-lg max-w-xs mx-auto transition-transform duration-300 ease-in-out hover:scale-105">
                  <div className="relative">
                    <img
                      src={computerCard.image}
                      alt={computerCard.name}
                      className="w-40 h-40 object-cover mx-auto rounded-lg shadow-md"
                    />
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-20 rounded-lg"></div>
                  </div>
                  <h4 className="mt-4 text-xl font-semibold text-gray-800 text-center">
                    {computerCard.name}
                  </h4>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600 font-medium">
                      <span className="font-semibold">Speed:</span>{" "}
                      {computerCard.speed}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      <span className="font-semibold">Attack:</span>{" "}
                      {computerCard.attack}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      <span className="font-semibold">Defense:</span>{" "}
                      {computerCard.defense}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Display Results After Each Round */}
            {roundsPlayed > 0 && (
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Round {roundsPlayed}
                </h3>
                {scoreboard[roundsPlayed - 1] && (
                  <div>
                    <p className="text-lg font-medium">
                      {scoreboard[roundsPlayed - 1].user >
                      scoreboard[roundsPlayed - 1].computer
                        ? "You win this round!"
                        : scoreboard[roundsPlayed - 1].user <
                          scoreboard[roundsPlayed - 1].computer
                        ? "Computer wins this round!"
                        : "It's a tie!"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buttons to Save Results and Start Playing */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={handlePlayClick}
          disabled={isButtonDisabled}
          className={`${
            isButtonDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white py-2 px-6 rounded-lg shadow-lg transition duration-300`}
        >
          Battle
        </button>
      </div>
    </div>
  );
};

export default Battle;
