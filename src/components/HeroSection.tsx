import React, { useState } from 'react';
import { Sparkles, ArrowRight, Shield, AlertTriangle, BookOpen, Clock, HelpCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { LegalCategory, UKJurisdiction } from '../types';

interface HeroSectionProps {
  problemText: string;
  setProblemText: (text: string) => void;
  category: LegalCategory;
  setCategory: (cat: LegalCategory) => void;
  jurisdiction: UKJurisdiction;
  setJurisdiction: (jur: UKJurisdiction) => void;
  urgency: string;
  setUrgency: (urgency: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onSelectSample: (sampleId: string) => void;
}

const CATEGORIES: { label: LegalCategory; desc: string }[] = [
  { label: 'Housing', desc: 'Evictions, s.21, deposits, repairs & damp' },
  { label: 'Employment', desc: 'Dismissal, wages, ACAS conciliation & sick pay' },
  { label: 'Consumer Rights', desc: 'CRA 2015, refunds, faulty tech & chargebacks' },
  { label: 'Benefits', desc: 'PIP appeals, Universal Credit sanctions & DWP' },
  { label: 'NHS & Healthcare', desc: 'Complaints, delayed care & medical records' },
  { label: 'Financial Services & Debt', desc: 'Debt collectors, FOS, bank fraud & energy bills' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  problemText,
  setProblemText,
  category,
  setCategory,
  jurisdiction,
  setJurisdiction,
  urgency,
  setUrgency,
  onSubmit,
  isLoading,
}) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [crestImgFailed, setCrestImgFailed] = useState(false);

  const heroImagePath = '/assets/images/rightsfix_justice_hero_1791193279340.jpg';
  const crestImagePath = '/assets/images/rightsfix_crest_seal_1791193291994.jpg';

  return (
    <section className="relative pt-8 pb-12 bg-linear-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row with Founder Credential & Tagline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2.5 text-xs text-slate-600 mb-3 flex-wrap">
              <span className="font-semibold text-blue-900 tracking-wider uppercase">RightsFix AI</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-700 font-medium">UK Rights Navigator</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-emerald-700 font-medium">General Information, Not Legal Advice</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-legal font-bold text-slate-900 tracking-tight leading-[1.15] text-balance mb-4">
              Know your rights. Fix what's wrong in plain language.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              RightsFix AI is a UK rights navigator to know your rights and fix what's wrong in plain language. General information, not legal advice. Describe your issue below for instant plain-English statutory guidance, action steps, and pre-action notices.
            </p>

            {/* Core Preventative Principles */}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-medium">
                ✓ Plain-English Compliance
              </span>
              <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-medium">
                ✓ Preventative Focus (Act Early)
              </span>
              <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-medium">
                ✓ Pre-Action Notice Templates
              </span>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 aspect-16/10">
              {!heroImgFailed ? (
                <img
                  src={heroImagePath}
                  alt="UK Everyday Justice Library and Law Resources"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgFailed(true)}
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-linear-to-br from-slate-900 to-slate-800 text-slate-300">
                  <BookOpen className="w-10 h-10 text-amber-400 mb-2" />
                  <span className="font-serif-legal font-bold text-white text-lg">Everyday Justice Bureau</span>
                  <span className="text-xs text-slate-400 mt-1">Plain English Rights Analysis</span>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-xs text-white">
                  <p className="font-medium">Democratising UK Law</p>
                  <p className="text-slate-300 text-[11px]">Free statutory rights for ordinary citizens</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Console Container */}
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-5 sm:p-7">
          {/* Controls Bar: Category & Jurisdiction */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-5 border-b border-slate-100">
            {/* Jurisdiction Picker */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                UK Legal Jurisdiction
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden text-xs bg-slate-50 p-1">
                {(['England & Wales', 'Scotland', 'Northern Ireland'] as UKJurisdiction[]).map((jur) => (
                  <button
                    key={jur}
                    type="button"
                    onClick={() => setJurisdiction(jur)}
                    className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-colors text-center truncate ${
                      jurisdiction === jur
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {jur}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {jurisdiction === 'England & Wales'
                  ? 'Standard English & Welsh statutes apply.'
                  : jurisdiction === 'Scotland'
                  ? 'Scottish tenancy (PRT) and tribunal rules applied.'
                  : 'Northern Ireland statutory frameworks applied.'}
              </p>
            </div>

            {/* Urgency Selector */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Urgency / Deadlines
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Normal">Normal (Information &amp; planning)</option>
                <option value="Medium">Medium (Received letter or deadline within 14 days)</option>
                <option value="High">High (Notice to quit / disciplinary / bailiff threat)</option>
                <option value="Critical">Critical (Immediate deadline / hearing imminent)</option>
              </select>
            </div>

            {/* Quick Category Focus */}
            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Area of Everyday Law
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['Housing', 'Employment', 'Consumer Rights', 'Benefits', 'Financial Services & Debt'] as LegalCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(category === cat ? 'All' : cat)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors border ${
                      category === cat
                        ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Problem Textarea */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="problem-input" className="text-sm font-semibold text-slate-900">
                Describe what happened in plain English
              </label>
              <span className="text-xs text-slate-600 font-mono">
                {problemText.length} characters (min 10)
              </span>
            </div>

            <textarea
              id="problem-input"
              rows={5}
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="e.g. My landlord served me an eviction notice last week because I asked for the boiler and mould in my bedroom to be fixed. They haven't protected my deposit and never sent a gas safety certificate. What are my legal rights and what should I do?"
              className="w-full p-4 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-900 placeholder:text-slate-400 leading-relaxed font-sans"
            />
          </div>

          {/* Footer of Input Box: Action Button & Prompt Assist */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>We do not store your personal details. Free and confidential.</span>
            </div>

            <div className="flex items-center gap-2">
              {problemText && (
                <button
                  type="button"
                  onClick={() => setProblemText('')}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}

              <button
                type="button"
                onClick={onSubmit}
                disabled={isLoading || problemText.trim().length < 10}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                  isLoading || problemText.trim().length < 10
                    ? 'bg-slate-400 cursor-not-allowed opacity-70'
                    : 'bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg active:scale-98'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing UK Law &amp; Statutes...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Rights &amp; Action Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
