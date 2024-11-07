import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Battle from './pages/Battle';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/battleground" element={<Battle />} />
      </Routes>
    </Router>
  );
}

export default App;