import React from 'react';
import { Home, Briefcase, ShoppingBag, Award, Landmark, Stethoscope, ArrowUpRight } from 'lucide-react';
import { SampleCase } from '../types';

interface SampleCasesBarProps {
  onSelectCase: (sampleCase: SampleCase) => void;
  samples: SampleCase[];
}

export const SampleCasesBar: React.FC<SampleCasesBarProps> = ({ onSelectCase, samples }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Housing':
        return <Home className="w-4 h-4 text-emerald-700" />;
      case 'Employment':
        return <Briefcase className="w-4 h-4 text-blue-700" />;
      case 'Consumer Rights':
        return <ShoppingBag className="w-4 h-4 text-amber-700" />;
      case 'Benefits':
        return <Award className="w-4 h-4 text-purple-700" />;
      case 'Financial Services':
      case 'Financial Services & Debt':
        return <Landmark className="w-4 h-4 text-rose-700" />;
      case 'NHS & Healthcare':
        return <Stethoscope className="w-4 h-4 text-teal-700" />;
      default:
        return <Home className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <section id="sample-cases-section" className="py-8 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-5">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Instant Exploration
            </span>
            <h2 className="text-xl font-serif-legal font-bold text-slate-900 mt-1">
              Common Everyday UK Legal Scenarios
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Click any realistic scenario below to load the facts and analyze your rights under UK law.
            </p>
          </div>
          <div className="mt-2 md:mt-0 text-xs text-slate-500">
            6 curated test disputes
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {samples.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCase(c)}
              className="text-left bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-xs transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    {getCategoryIcon(c.category)}
                    <span>{c.category}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{c.jurisdiction}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors mb-2 line-clamp-1">
                  {c.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                  {c.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-900 group-hover:text-blue-700">
                <span>Test this problem</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
