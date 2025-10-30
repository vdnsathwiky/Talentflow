
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/jobs', label: 'Jobs' },
    { path: '/candidates', label: 'Candidates' },
    { path: '/assessments', label: 'Assessments' },
  ];

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-white text-2xl font-extrabold tracking-wide">
                Talent<span className="text-yellow-300">Flow</span>
              </span>
            </Link>

            {/* Navigation Items */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-lg font-medium transition-colors duration-200 ${isActivePath(item.path)
                    ? 'text-yellow-300 border-b-2 border-yellow-300'
                    : 'text-white hover:text-yellow-300'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="h-9 w-9 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-white text-sm font-medium">{user?.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:block px-5 py-2 text-white border border-white rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-200 font-medium"
            >
              Logout
            </button>

            {/* Add Job Button */}
            <button className="hidden md:block px-5 py-2 bg-yellow-300 text-indigo-900 font-semibold rounded-full hover:bg-yellow-400 transition-all duration-200">
              Add Job
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 hover:bg-white/10 transition-colors"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-indigo-700 border-t border-indigo-500">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${isActivePath(item.path)
                    ? 'text-yellow-300 bg-white/10'
                    : 'text-white hover:text-yellow-300 hover:bg-white/5'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* User info and actions in mobile */}
              <div className="border-t border-indigo-500 pt-4 mt-2">
                <div className="flex items-center px-3 py-3">
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="ml-3 text-white text-sm font-medium">{user?.name}</span>
                </div>

                <div className="flex space-x-2 px-3 py-2">
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2 text-white border border-white rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-200 text-sm font-medium"
                  >
                    Logout
                  </button>
                  <button className="flex-1 px-4 py-2 bg-yellow-300 text-indigo-900 font-semibold rounded-full hover:bg-yellow-400 transition-all duration-200 text-sm">
                    Add Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;