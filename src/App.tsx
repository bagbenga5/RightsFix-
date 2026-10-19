import React, { useState, useEffect } from 'react';
import { LegalDisclaimerBanner } from './components/LegalDisclaimerBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SampleCasesBar } from './components/SampleCasesBar';
import { CaseAnalysisView } from './components/CaseAnalysisView';
import { AreasOfLawSection } from './components/AreasOfLawSection';
import { UKHelpDirectorySection } from './components/UKHelpDirectorySection';
import { AboutAdvocateSection } from './components/AboutAdvocateSection';
import { Footer } from './components/Footer';
import { CaseAnalysisResult, LegalCategory, SampleCase, UKJurisdiction } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

const FALLBACK_SAMPLES: SampleCase[] = [
  {
    id: 'case-s21-eviction',
    title: 'Section 21 Eviction Notice Received',
    category: 'Housing',
    jurisdiction: 'England & Wales',
    description: 'My private landlord sent me a Form 6A Section 21 eviction notice telling me to leave in 2 months. However, my deposit was never protected in a government scheme, and I was never given a valid Gas Safety Certificate or How to Rent guide.',
    urgency: 'High',
  },
  {
    id: 'case-redundancy-sickpay',
    title: 'Dismissed After Requesting Statutory Sick Pay',
    category: 'Employment',
    jurisdiction: 'England & Wales',
    description: 'I have worked at a warehouse for 14 months. Last week I had a chest infection and asked my manager for Statutory Sick Pay (SSP). Two days later I was dismissed via WhatsApp with no disciplinary hearing or explanation.',
    urgency: 'Critical',
  },
  {
    id: 'case-faulty-tech',
    title: 'Retailer Refusing Refund on Broken Laptop',
    category: 'Consumer Rights',
    jurisdiction: 'England & Wales',
    description: 'I bought a laptop for £650 35 days ago. The motherboard died yesterday. The retailer says their store policy is 30 days only and that I must contact the manufacturer in Taiwan myself.',
    urgency: 'Medium',
  },
  {
    id: 'case-pip-rejection',
    title: 'Personal Independence Payment (PIP) Scored 0 Points',
    category: 'Benefits',
    jurisdiction: 'England & Wales',
    description: 'I have severe degenerative arthritis and fibromyalgia. The DWP assessment report completely fabricated my abilities, claiming I have good grip and can walk 200m without pain. I was awarded 0 points for both daily living and mobility.',
    urgency: 'High',
  },
  {
    id: 'case-debt-collector',
    title: 'Debt Collector Threatening Immediate Bailiff Visit',
    category: 'Financial Services & Debt',
    jurisdiction: 'England & Wales',
    description: 'A private debt collection agency sent a red letter threatening to send bailiffs to clamp my car and remove goods from my house within 7 days for an old energy bill from 2018. They do not have a County Court Judgment (CCJ).',
    urgency: 'High',
  },
  {
    id: 'case-nhs-delayed-treatment',
    title: 'Cancelled Urgent Cancer Referral & Lost Records',
    category: 'NHS & Healthcare',
    jurisdiction: 'England & Wales',
    description: 'My GP made an urgent two-week cancer pathway referral 7 weeks ago. The hospital lost the booking and cancelled two follow-up appointments without contacting me, causing severe health deterioration and anxiety.',
    urgency: 'Critical',
  },
];

export default function App() {
  const [problemText, setProblemText] = useState<string>('');
  const [category, setCategory] = useState<LegalCategory>('All');
  const [jurisdiction, setJurisdiction] = useState<UKJurisdiction>('England & Wales');
  const [urgency, setUrgency] = useState<string>('Normal');
  const [samples, setSamples] = useState<SampleCase[]>(FALLBACK_SAMPLES);
  const [analysisResult, setAnalysisResult] = useState<CaseAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('navigator');

  useEffect(() => {
    fetch('/api/sample-cases')
      .then((res) => res.json())
      .then((data) => {
        if (data.cases && Array.isArray(data.cases) && data.cases.length > 0) {
          setSamples(data.cases);
        }
      })
      .catch((err) => {
        console.warn('Could not load samples from server, using fallback', err);
      });
  }, []);

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    if (section === 'navigator') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'areas') {
      document.getElementById('areas-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'samples') {
      document.getElementById('sample-cases-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'directory') {
      document.getElementById('directory-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'about') {
      document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSample = (sample: SampleCase) => {
    setProblemText(sample.description);
    setCategory(sample.category as LegalCategory);
    setJurisdiction((sample.jurisdiction as UKJurisdiction) || 'England & Wales');
    setUrgency(sample.urgency || 'Normal');
    setAnalysisResult(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async () => {
    if (!problemText || problemText.trim().length < 10) {
      setErrorMessage('Please describe the problem in a bit more detail (minimum 10 characters).');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText: problemText.trim(),
          category: category === 'All' ? undefined : category,
          jurisdiction,
          urgency,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || resData.details || 'Failed to analyze UK legal rights.');
      }

      setAnalysisResult(resData.data);
      // Smooth scroll to results
      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred while analyzing the case.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setErrorMessage(null);
    setProblemText('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Legal Disclaimer Banner */}
      <LegalDisclaimerBanner />

      {/* Top Navigation */}
      <Navbar onNavClick={handleNavClick} activeSection={activeSection} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If results exist, display comprehensive analysis view */}
        {analysisResult ? (
          <CaseAnalysisView
            analysis={analysisResult}
            problemText={problemText}
            onReset={handleReset}
          />
        ) : (
          <>
            {/* Hero & Problem Input Section */}
            <HeroSection
              problemText={problemText}
              setProblemText={setProblemText}
              category={category}
              setCategory={setCategory}
              jurisdiction={jurisdiction}
              setJurisdiction={setJurisdiction}
              urgency={urgency}
              setUrgency={setUrgency}
              onSubmit={handleAnalyze}
              isLoading={isLoading}
              onSelectSample={(id) => {
                const s = samples.find((x) => x.id === id);
                if (s) handleSelectSample(s);
              }}
            />

            {/* Error Message Box */}
            {errorMessage && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                <div className="p-4 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 text-xs flex items-start justify-between gap-3 shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-rose-950">Notice: </span>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="text-rose-700 hover:text-rose-900 font-semibold"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Instant Sample Scenarios Bar */}
            <SampleCasesBar onSelectCase={handleSelectSample} samples={samples} />

            {/* Areas of Law Pillars */}
            <AreasOfLawSection
              onSelectCategory={(cat) => {
                setCategory(cat);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* UK Help Directory */}
            <UKHelpDirectorySection />

            {/* Founder & Advocate Story */}
            <AboutAdvocateSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavClick={handleNavClick} />
    </div>
  );
}
