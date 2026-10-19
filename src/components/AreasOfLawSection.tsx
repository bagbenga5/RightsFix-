import React from 'react';
import { Home, Briefcase, ShoppingBag, Award, Stethoscope, Landmark, ArrowRight, ShieldCheck } from 'lucide-react';
import { LegalCategory } from '../types';

interface AreasOfLawSectionProps {
  onSelectCategory: (cat: LegalCategory) => void;
}

export const AreasOfLawSection: React.FC<AreasOfLawSectionProps> = ({ onSelectCategory }) => {
  const areas = [
    {
      title: 'Housing & Tenancy',
      category: 'Housing' as LegalCategory,
      icon: <Home className="w-5 h-5 text-emerald-800" />,
      statutes: 'Housing Act 1988, Landlord & Tenant Act 1985, Deregulation Act 2015',
      topics: [
        'Invalid Section 21 "no fault" eviction notices',
        'Deposit unprotected in DPS/TDS (claim 1x-3x deposit penalty)',
        'Damp, mould & broken heating under Landlord & Tenant Act s.11',
        'Illegal lockouts & Protection from Eviction Act 1977',
      ],
      description: 'Your home is protected by strict statutory prerequisites. Landlords cannot evict without court orders and must maintain safe heating and structural repairs.',
    },
    {
      title: 'Employment & Workplace Rights',
      category: 'Employment' as LegalCategory,
      icon: <Briefcase className="w-5 h-5 text-blue-800" />,
      statutes: 'Employment Rights Act 1996, Equality Act 2010, National Minimum Wage Act',
      topics: [
        'Unfair and constructive dismissal',
        'Statutory Sick Pay (SSP) & unlawful wage deductions',
        'Equality Act discrimination & reasonable adjustments',
        'ACAS Early Conciliation (strict 3-month limitation period)',
      ],
      description: 'Workers and employees have statutory protections from day one regarding health, safety, minimum wage, discrimination, and whistleblowing.',
    },
    {
      title: 'Consumer Rights & Purchases',
      category: 'Consumer Rights' as LegalCategory,
      icon: <ShoppingBag className="w-5 h-5 text-amber-800" />,
      statutes: 'Consumer Rights Act 2015, Consumer Credit Act 1974 (Section 75)',
      topics: [
        '30-day short-term right to a full refund for faulty goods',
        '6-month reverse burden of proof on product defects',
        'Credit card Section 75 claims (£100 - £30,000 protection)',
        'Misleading services & unfair contract terms',
      ],
      description: 'Retailers cannot hide behind "30-day store policies" or pass the buck to manufacturers. UK statutory consumer law holds sellers legally accountable.',
    },
    {
      title: 'Benefits & Social Welfare',
      category: 'Benefits' as LegalCategory,
      icon: <Award className="w-5 h-5 text-purple-800" />,
      statutes: 'Welfare Reform Act 2012, Social Security Act 1998',
      topics: [
        'Mandatory Reconsideration for PIP and Universal Credit',
        'Challenging flawed medical assessment reports',
        'Overpayment dispute notices & hardship payments',
        'First-tier Social Security Appeal Tribunal submissions',
      ],
      description: 'Over 68% of PIP and disability benefit appeals won at independent tribunal. Never accept an initial DWP refusal as final.',
    },
    {
      title: 'NHS & Healthcare Services',
      category: 'NHS & Healthcare' as LegalCategory,
      icon: <Stethoscope className="w-5 h-5 text-teal-800" />,
      statutes: 'NHS Constitution, Local Authority Social Services & NHS Complaints Regs 2009',
      topics: [
        'Formal NHS Trust stage-1 complaints & clinical review',
        'Breaches of the 18-week referral-to-treatment maximum',
        'Access to full electronic medical notes (Data Protection Act 2018)',
        'Parliamentary & Health Service Ombudsman (PHSO) escalation',
      ],
      description: 'The NHS Constitution gives you enforceable rights to timely care, transparent investigations of clinical errors, and full access to your medical records.',
    },
    {
      title: 'Financial Services & Debt',
      category: 'Financial Services & Debt' as LegalCategory,
      icon: <Landmark className="w-5 h-5 text-rose-800" />,
      statutes: 'FCA Consumer Duty, Debt Respite Scheme Regs 2020, Limitation Act 1980',
      topics: [
        'Unlawful harassment by private debt collection agencies',
        '60-day statutory Breathing Space debt freeze',
        'Statute-barred debt (6-year rule under Limitation Act s.5)',
        'Financial Ombudsman Service (FOS) free adjudication',
      ],
      description: 'Debt collectors do NOT have bailiff powers without a County Court Judgment. Bailiffs cannot force entry for standard civil debt.',
    },
  ];

  return (
    <section id="areas-section" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
            Everyday Legal Coverage
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-legal font-bold text-slate-900 mt-1">
            Six Pillars of Everyday UK Civil Justice
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            The legal system can feel like an impenetrable maze designed for wealthy corporations and high-charging solicitors. RightsFix AI translates key UK statutes into plain English so you can assert your rights immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    {area.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {area.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {area.statutes}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {area.description}
                </p>

                <div className="space-y-1.5 mb-4">
                  {area.topics.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-700 shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <button
                  onClick={() => onSelectCategory(area.category)}
                  className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1 group"
                >
                  <span>Explore {area.category} Rights</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
