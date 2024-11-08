import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="flex justify-start gap-2 p-4 bg-gray-800 text-white">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/leaderboard" className="hover:underline">Leaderboard</Link>
    </nav>
  );
};

export default Nav;