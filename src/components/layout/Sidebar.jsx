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

const Sidebar = ({ isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, setUser } = useMyContext();

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`bg-slate-200 text-black transition-all duration-300 min-h-screen flex flex-col justify-between z-50 ${
          collapsed ? 'w-16' : 'w-64'
        } ${isOpen ? 'fixed inset-y-0 left-0' : 'hidden sm:flex'} sm:relative`}
      >
        {/* Top Section */}
        <div>
          <div className="flex items-center justify-between px-4 py-4">
            <h1 className={`font-bold text-lg text-purple-700 ${collapsed ? 'hidden' : 'block'}`}>
              ML PROJECTS
            </h1>

  

            {/* Close for mobile */}
            <button
              onClick={onClose}
              className="sm:hidden text-gray-600 hover:text-black ml-2"
            >
              ❌
            </button>
          </div>
 
          {/* Nav Items */}
          <nav className="mt-4 space-y-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'text-black hover:bg-gray-300'
                  }`
                }
                onClick={onClose}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="px-3 mb-4">
          <div className="p-3 bg-gray-50 shadow shadow-violet-500 rounded-md flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 w-full justify-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <User size={16} className="text-purple-600" />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              )}
            </div>

            <button
              onClick={logout}
              className={`mt-3 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 border border-gray-300 shadow shadow-violet-500 hover:bg-gray-50 transition w-full ${
                collapsed ? 'flex-col p-2' : ''
              }`}
            >
              <LogOut size={18} className="text-gray-700" />
              {!collapsed && <span className="truncate">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;