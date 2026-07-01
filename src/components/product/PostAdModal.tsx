import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, AlertCircle, ShieldCheck, Loader2, Sparkles, Image, Check, MapPin, Tag } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Furniture', 'Sports & Outdoors', 'Fashion'];

// High-quality quick Unsplash templates for easy testing
const IMAGE_TEMPLATES = [
  { name: 'iPhone', url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mountain Bike', url: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sofa', url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80' },
  { name: 'Leather Jacket', url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80' }
];

export const PostAdModal: React.FC = () => {
  const {
    isPostAdOpen,
    setIsPostAdOpen,
    currentUser,
    listings,
    addListing,
    simulatePaymentSuccess,
    hasPaidTemporaryToken,
  } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Electronics',
    imageUrl: '',
    location: '',
    description: '',
  });

  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isPostAdOpen) return null;

  // Count active listings of the logged-in user
  const userListings = currentUser
    ? listings.filter((item) => item.sellerId === currentUser.id)
    : [];
  
  const userListingsCount = userListings.length;

  // Rule logic: Allow post if count is 0, or if they purchased a temporary token
  const canPostAdDirectly = userListingsCount === 0 || hasPaidTemporaryToken;

  // Placeholder pay function
  const handlePay100INR = () => {
    setIsPaying(true);
    
    // Simulate payment gateway loading
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      simulatePaymentSuccess();
      
      // Clear success banner and proceed to form after 1.5s
      setTimeout(() => {
        setPaymentSuccess(false);
      }, 1500);
    }, 2000);
  };

  const handleSelectTemplate = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.imageUrl || !formData.location || !formData.description) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addListing({
        title: formData.title,
        price: Number(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl,
        location: formData.location,
        description: formData.description,
      });

      // Clear state and close modal
      setFormData({
        title: '',
        price: '',
        category: 'Electronics',
        imageUrl: '',
        location: '',
        description: '',
      });
      setIsPostAdOpen(false);
    } catch (err) {
      alert('Error saving listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="post-ad-modal-backdrop">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col transform transition-transform animate-scale-up">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">
              {canPostAdDirectly ? 'Post Free Classified Ad' : 'Free Listing Limit Used'}
            </h3>
          </div>
          <button
            onClick={() => setIsPostAdOpen(false)}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-all focus:outline-none text-xs"
            id="close-post-modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto max-h-[80vh] p-6">
          {!canPostAdDirectly ? (
            /* PAYMENT REQUIREMENT GATING VIEW */
            <div className="text-center py-2" id="payment-gate-view">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">Free Listing Limit Used</h3>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                You have already listed 1 item. To post another active listing, you need to purchase a listing token for your account.
              </p>

              <div className="bg-slate-50 rounded-xl p-4 text-left mb-6 border border-slate-100">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Listing Fee</span>
                  <span className="text-slate-900">₹100 INR</span>
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  Payment includes 30-day listing visibility and prioritized search placement in local results.
                </div>
              </div>

              {isPaying ? (
                <div className="flex flex-col items-center justify-center py-6 gap-3" id="payment-processing">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                  <span className="text-sm font-bold text-slate-700">Connecting payment gateway...</span>
                  <span className="text-xs text-slate-400">Verifying security token. Do not close.</span>
                </div>
              ) : paymentSuccess ? (
                <div className="flex flex-col items-center justify-center py-6 gap-3 text-emerald-600" id="payment-success">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <span className="text-sm font-black text-slate-900">Payment Verified!</span>
                  <span className="text-xs text-emerald-600">Token unlocked. Proceeding to form...</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handlePay100INR}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-100 transition-all cursor-pointer"
                    id="pay-100-inr-btn"
                  >
                    Pay ₹100 & Post Ad
                  </button>
                  <button
                    onClick={() => setIsPostAdOpen(false)}
                    className="w-full text-slate-400 text-xs font-semibold hover:text-slate-600 py-2 cursor-pointer"
                  >
                    Cancel and return to Home
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ACTUAL CREATE LISTING FORM */
            <form onSubmit={handleSubmit} className="space-y-4" id="ad-creation-form">
              {hasPaidTemporaryToken && (
                <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold p-3.5 rounded-lg border border-emerald-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Premium listing unlock active via ₹100 token payment.</span>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ad Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Vintage Leather Jacket - Genuine Leather"
                  required
                  className="w-full text-sm border border-slate-200 bg-slate-50 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    required
                    className="w-full text-sm border border-slate-200 bg-slate-50 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    Category *
                  </label>
                  <select
                    className="w-full text-sm border border-slate-200 bg-slate-50 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  Listing Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Saket, New Delhi or Bandra West, Mumbai"
                  required
                  className="w-full text-sm border border-slate-200 bg-slate-50 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Item Description *</label>
                <textarea
                  placeholder="Describe your item details, dimensions, usage state, or reasons for sale..."
                  required
                  rows={3}
                  className="w-full text-sm border border-slate-200 bg-slate-50 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Image URL & Quick Templates */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  Product Image URL *
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="w-full text-sm border border-slate-200 bg-slate-50 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all mb-2"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />

                {/* Templates Selector */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Or Select Quick Preset:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {IMAGE_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.name}
                        type="button"
                        onClick={() => handleSelectTemplate(tmpl.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-md border transition-all font-medium ${
                          formData.imageUrl === tmpl.url
                            ? 'bg-emerald-600 border-emerald-600 text-white font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {tmpl.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPostAdOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                  id="publish-ad-submit"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Listing'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
