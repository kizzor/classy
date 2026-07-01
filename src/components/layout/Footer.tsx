import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Info, HelpCircle, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-500 text-[11px] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-[280px] space-y-2">
            <div className="text-white font-bold text-sm">ClassifiedsHub</div>
            <p className="leading-relaxed">
              We connect local buyers and sellers in India. List anything from old mobile phones to mountain bikes, furniture, and vintage outfits with absolutely zero commission.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="space-y-1.5">
              <div className="text-white font-semibold mb-1.5 text-xs">Company</div>
              <div><Link to="/" className="hover:text-emerald-400 transition-colors">About Us</Link></div>
              <div><Link to="/" className="hover:text-emerald-400 transition-colors">Safety Guidelines</Link></div>
            </div>
            <div className="space-y-1.5">
              <div className="text-white font-semibold mb-1.5 text-xs">Support</div>
              <div><Link to="/" className="hover:text-emerald-400 transition-colors">Help Center</Link></div>
              <div><Link to="/" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></div>
            </div>
            <div className="max-w-[220px] md:text-right space-y-1.5">
              <div className="text-emerald-400 font-bold mb-1.5 flex items-center md:justify-end gap-1 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Safe Transactions
              </div>
              <p className="leading-relaxed text-slate-400">
                Always meet in busy public locations for hand-to-hand transactions. Never send money in advance!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} ClassifiedsHub Private Limited. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/" className="hover:text-white transition-colors">Platform Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
