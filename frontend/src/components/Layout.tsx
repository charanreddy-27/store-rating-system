import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      { label: 'Dashboard', path: '/dashboard' },
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...baseItems,
          { label: 'Users', path: '/users' },
          { label: 'Stores', path: '/stores' },
        ];
      case 'normal_user':
        return [
          ...baseItems,
          { label: 'Stores', path: '/stores' },
          { label: 'My Ratings', path: '/my-ratings' },
          { label: 'Settings', path: '/settings' },
        ];
      case 'store_owner':
        return [
          ...baseItems,
          { label: 'Settings', path: '/settings' },
        ];
      default:
        return baseItems;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-gray-900">
                Store Rating System
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              {getNavItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
