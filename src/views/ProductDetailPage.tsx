import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, MapPin, MessageSquare, ShieldCheck, User, Tag } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { listings, currentUser, sendChatMessage } = useApp();
  
  const [messageText, setMessageText] = useState('Hi! Is this item still available? I am interested and would like to coordinate a public meet-up.');
  const [success, setSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messageBoxRef = useRef<HTMLDivElement>(null);

  const product = listings.find((item) => item.id === id);

  // Scroll to the contact form when arriving via #message-seller hash
  useEffect(() => {
    if (location.hash !== '#message-seller') return;
    const tryScroll = () => {
      if (messageBoxRef.current) {
        messageBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
      }
      return false;
    };
    if (!tryScroll()) {
      const interval = setInterval(() => {
        if (tryScroll()) clearInterval(interval);
      }, 100);
      const timeout = setTimeout(() => clearInterval(interval), 3000);
      return () => { clearInterval(interval); clearTimeout(timeout); };
    }
  }, [location, listings]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-extrabold text-slate-800">Classified listing not found</h2>
        <p className="text-sm text-slate-500">The item you are searching for might have been sold or removed by the seller.</p>
        <Link to="/" className="inline-block text-sm text-emerald-600 font-bold hover:underline">
          ← Back to listings feed
        </Link>
      </div>
    );
  }

  const isOwnListing = currentUser?.id === product.sellerId;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSending(true);
    try {
      await sendChatMessage(
        product.sellerId,
        product.id,
        product.title,
        messageText
      );
      setSuccess(true);
      setMessageText('');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      alert('Error sending message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 md:py-12" id="product-detail-view">
      {/* Back navigation */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings Feed
        </Link>
      </div>

      {/* Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Showcase & Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm p-3">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-50 relative">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="object-cover w-full h-full"
              />
              <span className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded flex items-center gap-1.5 shadow-xs">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                {product.category}
              </span>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Listing Description</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>

        {/* Right Col: Price, Location & Interactive Contact Form */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Info Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Listed {product.date}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {product.title}
              </h1>
              <p className="text-2xl font-bold text-emerald-600 tracking-tight pt-1">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="h-px bg-slate-200" />

            {/* Meta listings parameters */}
            <div className="grid grid-cols-1 gap-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Location</p>
                  <p className="text-slate-700 font-bold mt-0.5">{product.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                  <User className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Seller Profile</p>
                  <p className="text-slate-700 font-bold mt-0.5">{product.sellerName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Interface */}
          <div
            ref={messageBoxRef}
            id="message-seller"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">Contact {product.sellerName}</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              We coordinate safe peer-to-peer messaging. Send an inquiry to coordinate inspect points and completing cash transactions.
            </p>

            {isOwnListing ? (
              <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200 text-xs text-slate-500 font-medium leading-relaxed">
                You listed this classified ad. View active buyer inquiries on your User Profile page.
              </div>
            ) : success ? (
              <div className="bg-emerald-50 text-emerald-800 rounded-lg p-4 text-xs font-bold text-center border border-emerald-100 animate-pulse">
                Message dispatched! Opening conversation center in profile dashboard...
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <textarea
                  rows={4}
                  required
                  className="w-full text-sm border border-slate-200 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 transition-all font-medium text-slate-700"
                  placeholder="Hey, is this still available?"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4" />
                  {isSending ? 'Sending Inquiry...' : 'Connect and Message'}
                </button>
              </form>
            )}

            {/* Safety badge */}
            <div className="bg-emerald-500/5 rounded-lg p-3.5 border border-emerald-500/10 flex gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-[10.5px] text-emerald-800 leading-normal">
                <strong>Buyer Safety Rule:</strong> Avoid transferring any advances. Complete all inspections physically in public spaces.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};