import React from 'react';
import { Scale, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onNavClick: (section: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavClick, activeSection }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavClick('navigator')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-amber-400 group-hover:bg-slate-800 transition-colors shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
              RightsFix <span className="text-blue-700">AI</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-tight">
              UK Rights Navigator
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 clean text navigation links with subtle hover underlines */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavClick('navigator')}
            className={`transition-colors hover:text-slate-900 ${
              activeSection === 'navigator' ? 'text-slate-950 font-semibold underline underline-offset-8 decoration-2 decoration-blue-600' : ''
            }`}
          >
            RightsFix Navigator
          </button>
          <button
            onClick={() => onNavClick('areas')}
            className={`transition-colors hover:text-slate-900 ${
              activeSection === 'areas' ? 'text-slate-950 font-semibold underline underline-offset-8 decoration-2 decoration-blue-600' : ''
            }`}
          >
            UK Law Areas
          </button>
          <button
            onClick={() => onNavClick('samples')}
            className={`transition-colors hover:text-slate-900 ${
              activeSection === 'samples' ? 'text-slate-950 font-semibold underline underline-offset-8 decoration-2 decoration-blue-600' : ''
            }`}
          >
            Sample Cases
          </button>
          <button
            onClick={() => onNavClick('directory')}
            className={`transition-colors hover:text-slate-900 ${
              activeSection === 'directory' ? 'text-slate-950 font-semibold underline underline-offset-8 decoration-2 decoration-blue-600' : ''
            }`}
          >
            Help Directory
          </button>
          <button
            onClick={() => onNavClick('about')}
            className={`transition-colors hover:text-slate-900 ${
              activeSection === 'about' ? 'text-slate-950 font-semibold underline underline-offset-8 decoration-2 decoration-blue-600' : ''
            }`}
          >
            About Lab &amp; Advocate
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavClick('navigator')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            Early Rights Check
          </button>
        </div>
      </div>
    </header>
  );
};
