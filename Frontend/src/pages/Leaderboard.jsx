import Nav from '../components/Nav';
  import { useEffect, useState } from 'react';
  import axios from 'axios';

  const Leaderboard = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:5000/api/v1/users')
        .then(response => {
          const sortedData = response.data.sort((a, b) => b.exp - a.exp);
          setData(sortedData);
          // console.log(sortedData);
        })
        .catch(error => {
          console.error('Error fetching leaderboard data:', error);
        });
        // console.log(data)
    }, []);

    return (
      <>
      <Nav />
      <div className="flex items-center justify-center min-h-screen bg-[#2EC5B6]">
      <div className="container mx-auto p-4 bg-[#ED1F24] rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Leaderboard</h1>
      <div className="overflow-x-auto rounded-lg">
        <table className="table w-full text-center bg-blue-400 rounded-lg">
        <thead>
        <tr>
        <th>Username</th>
        <th>Matches Played</th>
        <th>Score</th>
        </tr>
        </thead>
        <tbody>
        {data.map((player, index) => (
        <tr key={index} className="rounded-lg">
          <td>{player.username}</td>
          <td>{player.matchesPlayed}</td>
          <td>{player.exp}</td>
        </tr>
        ))}
        </tbody>
        </table>
      </div>
      </div>
      </div>
      </>
    );
  }

export default Leaderboard