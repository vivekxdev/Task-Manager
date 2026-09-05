import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon, HomeIcon, ClipboardDocumentListIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
    setUserMenuOpen(false);
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon }
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-sticky shadow-xs" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Brand + Navigation */}
            <div className="flex items-center flex-1 min-w-0">
              <NavLink
                to="/dashboard"
                className="flex-shrink-0 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
                aria-label="TaskManager Home"
              >
                TaskManager
              </NavLink>

              <nav className="hidden md:flex md:ml-8 md:items-center md:space-x-0.5" aria-label="Main">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      }`
                    }
                    aria-current={({ isActive }) => isActive ? 'page' : undefined}
                  >
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 ${({ isActive }) => isActive ? 'text-primary-600' : 'text-neutral-400'}`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="hidden sm:flex sm:items-center sm:space-x-3" ref={userMenuRef}>
                <span className="text-sm font-medium text-neutral-700 hidden lg:inline-block">
                  {user?.name}
                </span>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    aria-label={`User menu for ${user?.name}`}
                  >
                    <div className="avatar avatar-sm bg-primary-100 text-primary-700">
                      {getInitials(user?.name)}
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-neutral-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="dropdown absolute right-0 mt-2 w-56 animate-fade-in-zoom"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <div className="px-3 py-2.5 border-b border-neutral-100">
                        <p className="text-sm font-medium text-neutral-900 truncate">{user?.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                      </div>
                      <NavLink
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="dropdown-item"
                        role="menuitem"
                      >
                        <UserCircleIcon className="w-4 h-4" aria-hidden="true" />
                        Profile
                      </NavLink>
                      <div className="dropdown-divider" role="separator" />
                      <button
                        onClick={handleLogout}
                        className="dropdown-item dropdown-item-danger w-full text-left"
                        role="menuitem"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" aria-hidden="true" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden btn-ghost btn-icon p-2 rounded-lg text-neutral-600 hover:text-neutral-900"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-neutral-200 animate-slide-down bg-white"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`
                  }
                  aria-current={({ isActive }) => isActive ? 'page' : undefined}
                >
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${({ isActive }) => isActive ? 'text-primary-600' : 'text-neutral-400'}`}
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
              <div className="pt-3 border-t border-neutral-200">
                <button
                  onClick={handleLogout}
                  className="dropdown-item dropdown-item-danger w-full justify-start px-3 py-2 rounded-lg"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" aria-hidden="true" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}