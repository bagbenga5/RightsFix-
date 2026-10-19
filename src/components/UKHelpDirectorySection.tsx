import React, { useState } from 'react';
import { Phone, Globe, Search, Building2, ExternalLink, ShieldCheck } from 'lucide-react';
import { SupportOrganisation } from '../types';

export const UKHelpDirectorySection: React.FC = () => {
  const [filterCat, setFilterCat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const directory: (SupportOrganisation & { category: string; address?: string })[] = [
    {
      category: 'General Advice',
      name: 'Citizens Advice',
      role: 'National network of charities offering free, confidential, and impartial advice on debt, housing, benefits, and employment.',
      phone: '0800 144 8848 (Adviceline England)',
      website: 'https://www.citizensadvice.org.uk',
      cost: '100% Free, confidential',
    },
    {
      category: 'Housing',
      name: 'Shelter England & Scotland',
      role: 'The leading UK housing charity. Provides legal advice, emergency housing aid, and public guides for tenants facing eviction or disrepair.',
      phone: '0808 800 4444 (Emergency helpline)',
      website: 'https://www.shelter.org.uk',
      cost: 'Free housing charity',
    },
    {
      category: 'Employment',
      name: 'ACAS (Advisory, Conciliation and Arbitration Service)',
      role: 'Independent public body providing workplace guidance and mandatory statutory Early Conciliation prior to any Employment Tribunal application.',
      phone: '0300 123 1100 (Helpline)',
      website: 'https://www.acas.org.uk',
      cost: 'Free statutory body',
    },
    {
      category: 'Debt & Finance',
      name: 'StepChange Debt Charity',
      role: 'UK’s largest specialist debt charity. Tailored debt solutions, Debt Relief Orders (DROs), and fee-free Debt Management Plans.',
      phone: '0800 138 1111',
      website: 'https://www.stepchange.org',
      cost: 'Free, non-profit',
    },
    {
      category: 'Debt & Finance',
      name: 'National Debtline',
      role: 'Free debt advice service run by the Money Advice Trust. Provides webchat, budgeting tools, and statutory Breathing Space assistance.',
      phone: '0808 808 4000',
      website: 'https://www.nationaldebtline.org',
      cost: 'Free & independent',
    },
    {
      category: 'Debt & Finance',
      name: 'Financial Ombudsman Service (FOS)',
      role: 'Official independent body establishing binding decisions on disputes with banks, building societies, insurers, and loan companies.',
      phone: '0800 023 4567',
      website: 'https://www.financial-ombudsman.org.uk',
      cost: 'Free for consumers',
    },
    {
      category: 'Consumer Rights',
      name: 'Citizens Advice Consumer Helpline',
      role: 'Funded by the Department for Business and Trade to assist UK consumers with unfair trading, faulty goods, and rogue trader reporting.',
      phone: '0808 223 1133',
      website: 'https://www.citizensadvice.org.uk/consumer',
      cost: 'Free advice service',
    },
    {
      category: 'NHS & Healthcare',
      name: 'Parliamentary and Health Service Ombudsman (PHSO)',
      role: 'Investigates unresolved complaints about the NHS in England, UK government departments, and other public bodies.',
      phone: '0345 015 4033',
      website: 'https://www.ombudsman.org.uk',
      cost: 'Free public ombudsman',
    },
    {
      category: 'Legal Aid & Representation',
      name: 'Civil Legal Advice (CLA)',
      role: 'Government service providing free legal aid solicitors for eligible individuals facing homelessness, eviction, or domestic violence.',
      phone: '0345 345 4345',
      website: 'https://www.gov.uk/civil-legal-advice',
      cost: 'Free if eligible for Legal Aid',
    },
    {
      category: 'Legal Aid & Representation',
      name: 'Law Centres Network',
      role: 'Charitable community legal centres employing solicitors and caseworkers to defend vulnerable people in housing, employment, and immigration.',
      phone: 'Local branches across UK',
      website: 'https://www.lawcentres.org.uk',
      cost: 'Free legal defence',
    },
    {
      category: 'Legal Aid & Representation',
      name: 'LawWorks (Solicitors Pro Bono Group)',
      role: 'Connects volunteer solicitors offering free pro bono legal advice clinics to individuals who do not qualify for Legal Aid.',
      website: 'https://www.lawworks.org.uk',
      cost: 'Free pro bono clinics',
    },
    {
      category: 'Equality & Human Rights',
      name: 'Equality Advisory and Support Service (EASS)',
      role: 'Advises and assists individuals on issues relating to equality, the Equality Act 2010, and human rights across England, Scotland, and Wales.',
      phone: '0808 800 0082',
      website: 'https://www.equalityadvisoryservice.com',
      cost: 'Free helpline',
    },
  ];

  const categories = ['All', 'General Advice', 'Housing', 'Employment', 'Debt & Finance', 'Consumer Rights', 'NHS & Healthcare', 'Legal Aid & Representation'];

  const filtered = directory.filter((item) => {
    const matchesCat = filterCat === 'All' || item.category === filterCat;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="directory-section" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
              UK Legal Support Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-legal font-bold text-slate-900 mt-1">
              Verified UK Public &amp; Charitable Organisations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Direct contact telephone numbers, websites, and services for official free legal and civic support.
            </p>
          </div>

          {/* Search box */}
          <div className="mt-4 md:mt-0 relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search organisation or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Category Pills/Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap border ${
                filterCat === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-blue-900">{item.category}</span>
                  <span className="text-emerald-700 font-medium text-[11px]">{item.cost}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.role}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                {item.phone ? (
                  <a
                    href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.phone}</span>
                  </a>
                ) : (
                  <span className="text-slate-400">Refer via website</span>
                )}

                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-900 hover:text-blue-700"
                >
                  <span>Visit site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
            No organizations match "{searchQuery}". Try selecting "All" or clearing the search box.
          </div>
        )}
      </div>
    </section>
  );
};
