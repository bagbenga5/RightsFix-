import React from 'react';
import { Scale, Heart } from 'lucide-react';

interface FooterProps {
  onNavClick: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-amber-400">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                RightsFix <span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-slate-300 font-medium text-xs">
              UK rights navigator — to know your rights and fix what's wrong in plain language.
            </p>
            <p className="text-slate-400 max-w-md leading-relaxed text-[11px]">
              General information, not legal advice. An initiative of Everyday Justice Lab to help people understand their rights and act early.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Everyday Law Areas
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Housing &amp; Eviction Defence</li>
              <li>Employment &amp; Workplace Rights</li>
              <li>Consumer Rights Act 2015</li>
              <li>PIP &amp; Universal Credit Appeals</li>
              <li>Debt &amp; Bailiff Restrictions</li>
              <li>NHS Healthcare Complaints</li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Navigation &amp; Support
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onNavClick('navigator')} className="hover:text-white transition-colors">
                  Rights Navigator
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('samples')} className="hover:text-white transition-colors">
                  Sample Scenarios
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('directory')} className="hover:text-white transition-colors">
                  UK Help Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('about')} className="hover:text-white transition-colors">
                  About the Founder
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            Created by <strong className="text-slate-300">Bagbenga Bamodu</strong>, Access to Justice Advocate &amp; Citizens Advice Adviser.
          </div>
          <div>
            General information only · Not formal legal advice · United Kingdom Civil Rights Tool
          </div>
        </div>
      </div>
    </footer>
  );
};
