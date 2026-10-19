import React from 'react';
import { Scale, HeartHandshake, ShieldCheck, Mail, BookOpen, AlertCircle } from 'lucide-react';

export const AboutAdvocateSection: React.FC = () => {
  const crestImagePath = '/assets/images/rightsfix_crest_seal_1791193291994.jpg';

  return (
    <section id="about-section" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-900 mx-auto mb-4 border-2 border-amber-400/40 p-0.5 shadow-sm">
            <img
              src={crestImagePath}
              alt="RightsFix Crest"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                // Fallback styling
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
            Brand Identity &amp; Core Mission
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-legal font-bold text-slate-900 mt-1">
            Everyday Justice Lab
          </h2>
          <p className="text-sm font-medium text-slate-600 mt-1">
            Led by Bagbenga Bamodu · Access to Justice Advocate &amp; Citizens Advice Adviser
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 text-sm text-slate-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 font-medium">
            "Everyday Justice Lab is a community of builders who turn confusing legal systems into plain-English tools that people can use. We prototype, test and share practical solutions that help people understand their rights and act early, before a problem becomes a dispute."
          </div>

          <p>
            In the United Kingdom, millions of tenants, employees, consumers, and families face overwhelming legal questions alone. With solicitors charging upwards of £250–£500 an hour, access to civil justice has become out of reach for ordinary people. Too often, people only seek help after they have received a court summons, a bailiff visit, or an irreversible eviction notice.
          </p>

          <p>
            <strong>Everyday Justice Lab</strong> changes that dynamic through three strict design principles:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-700" />
                <span>1. Plain-English Compliance</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                No dense legal jargon or intimidating legalese. All legal terms are broken down into clear, conversational explanations.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>2. Preventative Focus</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Early diagnostic checks, printable checklists, and proactive templates to resolve issues before they escalate into formal disputes.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-amber-700" />
                <span>3. Empathetic UX</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calm, supportive, and accessible design that reassures anxious individuals and gives them tangible power to act.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
            <p>
              <strong>General Information Notice:</strong> RightsFix AI is a diagnostic and preventative information tool, not a solicitor-client retainer. If you face imminent court eviction or statutory deadlines, contact Shelter, ACAS, or a local Law Centre immediately.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
