import React, { useState } from "react";

const ResultDisplay = () => {
  const [scoreboard, setScoreboard] = useState(null);
  const [winner, setWinner] = useState("");

  // Function to fetch scoreboard from localStorage and determine the winner
  const fetchScoreboard = () => {
    const storedScoreboard = localStorage.getItem("scoreboard");
    if (storedScoreboard) {
      const parsedScoreboard = JSON.parse(storedScoreboard);
      setScoreboard(parsedScoreboard);

      // Determine the winner
      if (parsedScoreboard.finalUserWins > parsedScoreboard.finalComputerWins) {
        setWinner("User");
      } else if (
        parsedScoreboard.finalUserWins < parsedScoreboard.finalComputerWins
      ) {
        setWinner("Computer");
      } else {
        setWinner("It's a tie!");
      }
    } else {
      alert("No scoreboard data found in local storage.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <button
        onClick={fetchScoreboard}
        className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 mb-6"
      >
        Show Final Result
      </button>

      {scoreboard && (
        <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Final Results
          </h3>

          <div className="mb-4">
            <p className="text-lg font-medium text-gray-700">
              User Wins:{" "}
              <span className="text-green-600">{scoreboard.finalUserWins}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              Computer Wins:{" "}
              <span className="text-red-600">
                {scoreboard.finalComputerWins}
              </span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              Ties:{" "}
              <span className="text-yellow-600">{scoreboard.finalTies}</span>
            </p>
          </div>

          <div className="mt-4">
            <h4 className="text-xl font-bold text-gray-800">
              {winner === "It's a tie!" ? winner : `${winner} Wins!`}
            </h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
