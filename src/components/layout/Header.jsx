import { useEffect } from "react";
import { useMyContext } from "../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, } from "react";
import { Navigate } from "react-router-dom";

// Header.jsx
const Header = () => {
  const { user } = useMyContext();
  const [title, setTitle] = useState("dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  function handlernavigate() {
    navigate('/projects/create');
  }

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) {
      setTitle("New Projects")
    } else if (path.includes('/projects/sent-to-ceo')) {
      setTitle("Sent-To-CEO");
    } else if (path.includes('/projects/approved-by-client')) {
      setTitle("Approved-By-Client")
    } else if (path.includes('/projects/invoice-raised')) {
      setTitle("Invoice-Raised")
    } else if (path.includes("/projects/create")) {
      setTitle("Create New Project");
    }
  }, [location]);




  return (
    <header className="bg-gray-300  shadow-md shadow-purple-600 px-6 py-4 flex items-center justify-between">
      {/* Left: Title */}
      <h2 className="text-xl font-semibold text-gray-800  p-2  ">{title}</h2>

      {/* Right: New Project + Welcome + Avatar */}
      <div className="flex items-center gap-5 mb-5">
        <button onClick={handlernavigate}
          className="bg-purple-600 text-white px-4 py-2 rounded shadow shadow-black  hover:bg-purple-700 text-sm">
          New Project
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            Welcome, {user?.name}
          </span>
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
