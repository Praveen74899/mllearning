import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - fixed height */}
      <Sidebar />

      {/* Right side: Header + Scrollable Main */}
      <div className="flex flex-col flex-1">
        {/* Header - fixed height */}
        <div className="h-16 flex-shrink-0">
          <Header />
        </div>

        {/* Scrollable main content */}
        <div className="flex-1 overflow-y-scroll p-6 bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
