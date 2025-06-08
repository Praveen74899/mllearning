// Sidebar.jsx
import { useState } from 'react';
import { useMyContext } from '../../contexts/AuthContext';
import {
  Home,
  FolderPlus,
  FolderSync,
  CheckCircle,
  FileCheck,
  User,
  LogOut,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
  { label: 'New Projects', path: '/projects/new', icon: <FolderPlus size={18} /> },
  { label: 'Sent to CEO', path: '/projects/sent-to-ceo', icon: <FolderSync size={18} /> },
  { label: 'Approved by Client', path: '/projects/approved-by-client', icon: <CheckCircle size={18} /> },
  { label: 'Invoice Raised', path: '/projects/invoice-raised', icon: <FileCheck size={18} /> },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, setUser } = useMyContext(); // Fix: include setUser

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className={`bg-slate-200 text-black transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col justify-between`}>

      {/* Top Section */}
      <div>
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className={`font-bold text-lg ${collapsed ? 'hidden' : 'block'}`}>ML PROJECTS</h1>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white"
          >
            {collapsed ? '➡️' : '⬅️'}
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm text-black font-medium transition-colors ${isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-black hover:bg-gray-700'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Section at Bottom */}
      <div className="px-3 mb-4">
        <div className="p-3 bg-gray-50 shadow shadow-violet-500 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <User size={16} className="text-purple-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 shadow shadow-violet-500 hover:bg-gray-50 transition-all duration-200"
          >
            <LogOut size={18} className="text-gray-700" />
            {!collapsed && <span className="truncate">Logout</span>}
          </button>

        </div>
      </div>

    </div>
  );
};

export default Sidebar;
