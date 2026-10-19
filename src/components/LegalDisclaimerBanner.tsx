import React, { useState } from 'react';
import { AlertCircle, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export const LegalDisclaimerBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-900 text-slate-100 text-xs border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300 flex-wrap">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong className="text-white font-medium">RightsFix AI:</strong> UK rights navigator — know your rights and fix what's wrong in plain language.
          </span>
          <span className="hidden sm:inline text-slate-500">·</span>
          <span className="hidden sm:inline text-amber-400 font-medium">
            General information, not legal advice.
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
        >
          <span>{isExpanded ? 'Hide Scope & Limits' : 'Important Scope & Limits'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 border-t border-slate-800 text-slate-300 leading-relaxed bg-slate-950/70">
          <p className="mb-2">
            <strong>About Everyday Justice Lab:</strong> We are a community of builders who turn confusing legal systems into plain-English tools that people can use. We prototype, test, and share practical solutions that help people understand their rights and act early, before an everyday problem becomes an expensive dispute.
          </p>
          <p>
            RightsFix is general legal information and preventative procedural guidance, <strong>not formal solicitor representation</strong>. If you face imminent eviction, court hearings, or limitation cut-offs, contact Civil Legal Advice, Shelter, or a local Law Centre immediately.
          </p>
        </div>
      )}
    </div>
  );
};
