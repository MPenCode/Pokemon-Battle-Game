import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Battle from "./pages/Battle";
import Leaderboard from "./pages/Leaderboard";
import PokemonDetail from "./pages/PokemonDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/battleground" element={<Battle />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
