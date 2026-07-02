import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, MessageSquare, Tag } from 'lucide-react';
import { Listing } from '../../types';

export const ProductCard: React.FC<Listing> = ({
  id,
  title,
  price,
  location,
  date,
  imageUrl,
  category,
}) => {
  const navigate = useNavigate();

  const handleMessageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Route to product detail and scroll to the contact form section
    navigate(`/product/${id}#message-seller`);
  };

  return (
    <article
      id={`product-card-${id}`}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full transition-all hover:shadow-md hover:border-slate-300"
    >
      {/* Product Image Gallery Wrapper */}
      <Link to={`/product/${id}`} className="relative aspect-[4/3] sm:aspect-square bg-slate-100 overflow-hidden block">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
          <Tag className="w-2.5 h-2.5 text-emerald-400" />
          {category}
        </span>
      </Link>

      {/* Product Details Block */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Price and Date */}
        <div className="flex justify-between items-start mb-1">
          <span className="text-lg font-bold text-slate-900">
            ₹{price.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-1">
            {date}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-slate-800 line-clamp-2 mb-2 flex-grow hover:text-emerald-600 transition-colors">
          <Link to={`/product/${id}`}>{title}</Link>
        </h3>

        {/* Location Row */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-4">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-300" />
          <span className="truncate">{location}</span>
        </div>

        {/* Call to Action */}
        <button
          onClick={handleMessageClick}
          className="w-full bg-emerald-50 text-emerald-700 font-bold py-2 rounded-lg text-xs hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-1"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Message Seller
        </button>
      </div>
    </article>
  );
};
