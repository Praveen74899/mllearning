import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMyContext } from "../../contexts/AuthContext";

const Header = ({ onMenuClick }) => {
  const { user } = useMyContext();
  const [title, setTitle] = useState("Dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard")) setTitle("Dashboard");
    else if (path.includes("/projects/sent-to-ceo")) setTitle("Sent-To-CEO");
    else if (path.includes("/projects/approved-by-client")) setTitle("Approved-By-Client");
    else if (path.includes("/projects/invoice-raised")) setTitle("Invoice-Raised");
    else if (path.includes("/projects/create")) setTitle("Create New Project");
    else if (path.includes("/projects/new")) setTitle("New Projects");
  }, [location]);

  const handleNavigate = () => {
    navigate("/projects/create");
  };

  return (
    <header className="bg-gray-300 shadow-md shadow-purple-600 px-4 sm:px-6 py-3 sm:py-4">
     <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
  {/* Left: Title + Mobile Menu */}
  <div className="flex items-center gap-3 flex-grow min-w-0">
    <button
      onClick={onMenuClick}
      className="sm:hidden p-2 text-purple-700 hover:text-purple-900"
    >
      ☰
    </button>
    <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
      {title}
    </h2>
  </div>

  {/* Right: Actions */}
  <div className="flex items-center gap-2 flex-wrap">
    <button
      onClick={handleNavigate}
      className="bg-purple-600 text-white px-3 py-2 rounded shadow hover:bg-purple-700 text-sm"
    >
      New Project
    </button>

    <div className="flex items-center gap-2 min-w-0">
      <span className="text-sm text-gray-700 truncate max-w-[120px] hidden sm:inline-block">
        Welcome, {user?.name}
      </span>
      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
        {user?.name?.charAt(0).toUpperCase()}
      </div>
    </div>
  </div>
</div>
    </header>
  );
};

export default Header;