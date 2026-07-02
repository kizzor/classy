import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, User, Mail, MessageSquare, AlertCircle, Sparkles, Plus, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserProfilePage: React.FC = () => {
  const { currentUser, listings, chats, deleteListing, setIsPostAdOpen, toggleUserLogin } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6" id="profile-access-denied">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center mx-auto border border-slate-200">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Access Restricted</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Please login or toggle the Sandbox simulator state in the navigation panel to view your user dashboard.
          </p>
        </div>
        <button
          onClick={toggleUserLogin}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          Activate Sarah Connor Session
        </button>
      </div>
    );
  }

  // Filter listings published by current user
  const myListings = listings.filter((item) => item.sellerId === currentUser.id);

  // Filter chats sent by or received by this user
  const myChats = chats.filter(
    (msg) => msg.senderId === currentUser.id || msg.recipientId === currentUser.id
  );

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove your classified listing for "${title}"? This will update your posting count limit.`)) {
      await deleteListing(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14" id="user-profile-view">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: User profile statistics cards */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600"></div>
            
            <div className="mt-4 relative inline-block">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-emerald-500"
              />
              <span className="absolute bottom-1 right-1 bg-emerald-600 w-5 h-5 rounded-full border border-white flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
            </div>

            <h2 className="font-bold text-slate-900 text-lg mt-4 tracking-tight">{currentUser.name}</h2>
            <p className="text-xs text-slate-400 font-medium">{currentUser.email}</p>

            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-2xl font-bold text-slate-900">{myListings.length}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">My Listings</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-2xl font-bold text-slate-900">{myChats.length}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">My Chats</p>
              </div>
            </div>
          </div>

          {/* Sandbox controller info box */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Listing Limit Rule Sandbox</span>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Standard accounts are limited to <strong className="text-slate-900">1 free listing</strong>. You currently have <strong className="text-slate-900">{myListings.length}</strong> listings.
            </p>
            <div className="text-[11px] text-emerald-600/95 leading-relaxed">
              {myListings.length === 0 ? (
                <span>Your slot is empty! Click <strong className="text-slate-900">Post Free Ad</strong> to list your first item for free.</span>
              ) : (
                <span>Free limit used! Attempting to post a second ad will trigger the <strong className="text-slate-900">₹100 Premium Payment modal</strong>. Try deleting your current listing to reset the limit!</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Listings and conversation aggregates */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section: My Listings */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">My Active Listings</h3>
                <p className="text-xs text-slate-400 mt-1">Manage or update your catalog listings</p>
              </div>
              <button
                onClick={() => setIsPostAdOpen(true)}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1 border border-emerald-100 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                Add Listing
              </button>
            </div>

            {myListings.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg p-6" id="empty-my-listings">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">You don't have any active classified postings.</p>
                <p className="text-xs text-slate-400 mt-1">Get started by creating your first free classified listing.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200" id="my-listings-list">
                {myListings.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0 group">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-950 truncate mt-1 hover:text-emerald-600 transition-colors">
                        <Link to={`/product/${item.id}`}>{item.title}</Link>
                      </h4>
                      <p className="text-sm font-bold text-slate-900 mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>

                    {/* Delete listing btn */}
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="text-slate-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors self-center cursor-pointer"
                      title="Delete this listing to reset your posting limit slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Chat/Messages logs */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Active Buyer-Seller Inquiries</h3>
                <p className="text-xs text-slate-400 mt-1">Manage direct messenger logs and handshakes</p>
              </div>
            </div>

            {myChats.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg p-6" id="empty-my-chats">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">No marketplace messages found.</p>
                <p className="text-xs text-slate-400 mt-1">When someone sends you a message or you inquire about other listings, they appear here.</p>
              </div>
            ) : (
              <div className="space-y-4" id="my-chats-list">
                {myChats.map((msg) => {
                  const isSentByMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className="p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg flex flex-col gap-2 transition-colors"
                    >
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-slate-900">
                          {isSentByMe ? (
                            <span className="inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                              Inquiry sent to seller
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                              Inquiry from {msg.senderName}
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{msg.timestamp}</span>
                      </div>
                      
                      <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Re: <Link to={`/product/${msg.productId}`} className="hover:underline">{msg.productTitle}</Link>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600 italic leading-relaxed shadow-xs">
                        "{msg.text}"
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};