import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Sparkles, Plus, Search, User, LogOut, LogIn, Menu, X, MessageSquare, Bell, BellOff, MessageCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, setIsPostAdOpen, searchQuery, setSearchQuery, toggleUserLogin, chats, notificationsEnabled } = useApp();
  const navigate = useNavigate();

  const handlePostAdClick = () => {
    if (!currentUser) {
      alert('You must be logged in to post an ad! We have simulated a quick log in for you to easily test the flow.');
      toggleUserLogin();
      setIsPostAdOpen(true);
      return;
    }
    setIsPostAdOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    navigate('/');
  };

  // Get chats count involving user
  const userChatsCount = currentUser
    ? chats.filter((msg) => msg.senderId === currentUser.id || msg.recipientId === currentUser.id).length
    : 0;

  return (
    <nav id="app-navbar" className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-1.5" id="nav-logo">
              <span className="bg-emerald-600 text-white w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold">★</span>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Classifieds<span className="text-emerald-600">Hub</span>
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block relative w-80">
              <input
                type="text"
                placeholder="Search electronics, cars, furniture..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                id="navbar-search-input"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Desktop Right Side Panel */}
          <div className="hidden md:flex items-center gap-6">
            {/* Notification Status */}
            <div className="flex items-center gap-1.5 text-xs font-medium" title={notificationsEnabled ? 'Notifications enabled' : 'Notifications disabled'}>
              {notificationsEnabled ? (
                <>
                  <Bell className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Alerts On</span>
                </>
              ) : (
                <>
                  <BellOff className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Alerts Off</span>
                </>
              )}
            </div>

            {/* Developer Sandbox Toggle */}
            <button
              onClick={toggleUserLogin}
              className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              title="Toggle current user log-in state to inspect different limits"
              id="dev-auth-toggle"
            >
              <User className="w-3 h-3" />
              Sandbox: {currentUser ? 'Logout' : 'Login'}
            </button>

            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              Explore
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/chat"
                  className="relative p-2 text-slate-500 hover:text-emerald-600 transition-colors"
                  id="nav-chat-link"
                >
                  <MessageCircle className="w-5 h-5" />
                  {userChatsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {userChatsCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 group"
                  id="nav-profile-avatar"
                >
                  <MessageSquare className="w-5 h-5" />
                  {userChatsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {userChatsCount}
                    </span>
                  )}
                </Link>

                <Link to="/profile" className="flex items-center gap-2 group" id="nav-profile-avatar">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full border border-emerald-500 object-cover"
                  />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={handlePostAdClick}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-1.5"
                  id="nav-post-ad-btn"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Post Free Ad
                </button>
              </div>
            ) : (
              <button
                onClick={toggleUserLogin}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 flex items-center gap-1.5"
                id="nav-login-btn"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Action Trigger */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={toggleUserLogin}
              className="text-[10px] font-bold bg-emerald-50 text-emerald-700 p-1.5 rounded-lg border border-emerald-100"
            >
              {currentUser ? 'Logout' : 'Login'}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 p-1 hover:text-slate-900 focus:outline-none"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown View */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 shadow-sm" id="mobile-dropdown">
          <div className="relative">
            <input
              type="text"
              placeholder="Search electronics, cars, furniture..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-700 hover:text-emerald-600 py-1"
            >
              Explore Listings
            </Link>

            {currentUser && (
              <>
                <Link
                  to="/chat"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-700 hover:text-emerald-600 py-1 flex items-center justify-between"
                >
                  <span>Messages</span>
                  <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {userChatsCount} active
                  </span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-700 hover:text-emerald-600 py-1"
                >
                  My Profile
                </Link>
              </>
            )}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handlePostAdClick();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Post Free Ad
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};