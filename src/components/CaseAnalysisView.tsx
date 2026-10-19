import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  FileText, 
  ArrowRight, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Phone, 
  Globe, 
  Clock, 
  ShieldAlert, 
  HelpCircle,
  ChevronRight,
  BookOpen,
  Send,
  UserCheck,
  ListChecks,
  Sparkles,
  Share2,
  Mail
} from 'lucide-react';
import { CaseAnalysisResult } from '../types';
import { InteractiveActionChecklist } from './InteractiveActionChecklist';

interface CaseAnalysisViewProps {
  analysis: CaseAnalysisResult;
  problemText: string;
  onReset: () => void;
}

type TabType = 'preventative' | 'law' | 'plan' | 'pitfalls' | 'letter' | 'orgs' | 'escalation';

export const CaseAnalysisView: React.FC<CaseAnalysisViewProps> = ({
  analysis,
  problemText,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('preventative');
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedCaseSummary, setCopiedCaseSummary] = useState(false);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [isPersonalizingLoading, setIsPersonalizingLoading] = useState(false);

  const handleCopyCaseSummary = () => {
    const stepsText = analysis.actionPlan
      .map(
        (s) =>
          `Step ${s.stepNumber}: ${s.title}\n- Deadline/Timing: ${s.deadlineOrTiming}\n- Action Details: ${s.actionDetails}${
            s.evidenceToCollect ? `\n- Evidence to Gather: ${s.evidenceToCollect}` : ''
          }`
      )
      .join('\n\n');

    const statutesText = analysis.whatTheLawSays.relevantStatutes
      .map((st) => `- ${st.actName}${st.section ? ` (${st.section})` : ''}: ${st.explanation}`)
      .join('\n');

    const pitfallsText = analysis.whatNotToDo
      .map((p) => `- DO NOT: ${p.pitfall}\n  Risk: ${p.whyDangerous}\n  Alternative: ${p.whatToAlternative}`)
      .join('\n');

    const fullText = `CASE SUMMARY & ACTION PLAN FOR LEGAL ADVISER / CASEWORKER
Prepared via Everyday Justice Lab (RightsFix Navigator)
Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}

---
1. CASE OVERVIEW
- Category: ${analysis.detectedCategory}
- Jurisdiction: ${analysis.jurisdictionNote}
- Urgency Rating: ${analysis.urgencyRating}

2. CLIENT PROBLEM STATEMENT
"${problemText.trim()}"

3. LEGAL EVALUATION & CORE STANDING
${analysis.summary}

Core Rule:
${analysis.whatTheLawSays.coreRule}

Specific Statutory Rights:
${analysis.whatTheLawSays.detailedRights.map((r) => `• ${r}`).join('\n')}

Relevant UK Statutes & Regulations:
${statutesText}

4. SUGGESTED ACTION PLAN & STATUTORY TIMELINES
${stepsText}

5. CRITICAL PITFALLS TO AVOID
${pitfallsText}

6. FORMAL PRE-ACTION NOTICE
A draft pre-action letter has been generated in accordance with UK Pre-Action Protocols.
---
Notice: Prepared for legal information, triage, and casework reference.`;

    navigator.clipboard.writeText(fullText);
    setCopiedCaseSummary(true);
    setTimeout(() => setCopiedCaseSummary(false), 2500);
  };

  // Letter Personalization Form
  const [senderName, setSenderName] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [demandedRemedy, setDemandedRemedy] = useState('');
  const [currentLetterText, setCurrentLetterText] = useState(analysis.formalLetter.letterText);

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(currentLetterText);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2200);
  };

  const handleDownloadLetter = () => {
    const blob = new Blob([currentLetterText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RightsFix_${analysis.detectedCategory.replace(/\s+/g, '_')}_Letter.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePersonalizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPersonalizingLoading(true);
    try {
      const res = await fetch('/api/personalize-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseLetter: analysis.formalLetter.letterText,
          senderName,
          senderAddress,
          recipientName,
          recipientAddress,
          referenceNumber: refNumber,
          incidentDate,
          specificDemands: demandedRemedy,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.formattedLetter) {
        setCurrentLetterText(data.data.formattedLetter);
        setIsPersonalizing(false);
      }
    } catch (err) {
      console.error('Error personalizing letter:', err);
    } finally {
      setIsPersonalizingLoading(false);
    }
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button onClick={onReset} className="hover:text-slate-900 font-medium">
              Home
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-semibold">{analysis.detectedCategory}</span>
            <span aria-hidden="true">/</span>
            <span className="truncate max-w-xs">{analysis.summary.slice(0, 45)}...</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyCaseSummary}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-2xs ${
                copiedCaseSummary
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
              title="Copy summary and action plan for sending to a solicitor, Citizens Advice or caseworker"
            >
              {copiedCaseSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Summary Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary for Legal Adviser</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Advice</span>
            </button>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
            >
              <span>New Problem</span>
            </button>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-7 mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
            <span className="font-semibold text-blue-900 uppercase tracking-wide">
              {analysis.detectedCategory}
            </span>
            <span aria-hidden="true">·</span>
            <span>{analysis.jurisdictionNote}</span>
            <span aria-hidden="true">·</span>
            <span className={`font-semibold ${
              analysis.urgencyRating.toLowerCase().includes('critical') || analysis.urgencyRating.toLowerCase().includes('high')
                ? 'text-rose-700'
                : 'text-amber-700'
            }`}>
              Urgency: {analysis.urgencyRating}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-legal font-bold text-slate-900 mb-3">
            Legal Evaluation &amp; Your Standing
          </h2>

          <p className="text-base text-slate-700 leading-relaxed max-w-4xl bg-slate-50 p-4 rounded-lg border border-slate-200">
            {analysis.summary}
          </p>

          {/* Quick Copy for Legal Adviser Banner */}
          <div className="mt-5 p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-950">
                  Sharing this case with Citizens Advice, a solicitor, or trade union?
                </h4>
                <p className="text-[11px] text-blue-900/90 mt-0.5 leading-relaxed">
                  Copy a formatted case brief with your problem facts, statutory rights, and action steps ready to paste directly into an email or message.
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyCaseSummary}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap self-start sm:self-auto shrink-0 shadow-xs ${
                copiedCaseSummary
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
            >
              {copiedCaseSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary &amp; Action Plan</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              <span className="font-medium text-slate-700">Problem Reviewed: </span>
              <span className="italic text-slate-600 line-clamp-1">"{problemText}"</span>
            </div>
            <div className="text-emerald-800 font-medium">
              Statutory analysis verified for everyday justice navigation
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200 rounded-xl mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('preventative')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'preventative'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5 text-blue-700" />
            <span>1. Action Checklist &amp; Progress Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('law')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'law'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>2. What the Law Says</span>
          </button>

          <button
            onClick={() => setActiveTab('plan')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'plan'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>3. Action Plan ({analysis.actionPlan.length} Steps)</span>
          </button>

          <button
            onClick={() => setActiveTab('pitfalls')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'pitfalls'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>4. What NOT to Do</span>
          </button>

          <button
            onClick={() => setActiveTab('letter')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'letter'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>5. Formal Letter / Notice</span>
          </button>

          <button
            onClick={() => setActiveTab('orgs')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'orgs'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>6. Organisations That Can Help</span>
          </button>

          <button
            onClick={() => setActiveTab('escalation')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'escalation'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>7. Follow-up &amp; Escalation</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE ACTION CHECKLIST & PROGRESS TRACKER */}
        {activeTab === 'preventative' && (
          <InteractiveActionChecklist
            caseSummary={analysis.summary}
            categoryName={analysis.detectedCategory}
            actionPlan={analysis.actionPlan}
            preventativeTasks={analysis.earlyPreventativeChecklist?.immediateChecklist}
            onOpenLetter={() => setActiveTab('letter')}
          />
        )}

        {/* TAB 2: WHAT THE LAW SAYS */}
        {activeTab === 'law' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider mb-2">
                <Scale className="w-4 h-4 text-blue-700" />
                <span>The Core Legal Rule</span>
              </div>
              <h3 className="text-xl font-serif-legal font-bold text-slate-900 mb-3">
                {analysis.whatTheLawSays.coreRule}
              </h3>

              <div className="mt-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Your Specific UK Statutory Rights
                </h4>
                <ul className="space-y-2.5">
                  {analysis.whatTheLawSays.detailedRights.map((right, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{right}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Statutes and Acts Citation Section */}
            <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                <BookOpen className="w-4 h-4 text-slate-600" />
                <span>Relevant UK Acts of Parliament &amp; Regulations</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.whatTheLawSays.relevantStatutes.map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs text-blue-900 font-bold mb-1">
                      <span>{stat.actName}</span>
                      {stat.section && (
                        <span className="font-mono text-[11px] text-slate-500">{stat.section}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">
                      {stat.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Plain English Guarantee:</span> We extract the exact statutory protection so you can cite actual UK law without having to read hundred-page legislation.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTION PLAN */}
        {activeTab === 'plan' && (
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
                Step-by-Step Pathway
              </span>
              <h3 className="text-xl font-serif-legal font-bold text-slate-900 mt-1">
                Your Clear UK Action Plan
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Execute these steps in order to protect your rights, collect vital evidence, and preserve legal deadlines.
              </p>
            </div>

            <div className="space-y-6">
              {analysis.actionPlan.map((step) => (
                <div key={step.stepNumber} className="relative pl-8 sm:pl-10 pb-6 border-l-2 border-slate-200 last:border-l-transparent last:pb-0">
                  {/* Step Number Dot */}
                  <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center ring-4 ring-white">
                    {step.stepNumber}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h4 className="text-base font-bold text-slate-900">
                        {step.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-md">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>{step.deadlineOrTiming}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                      {step.actionDetails}
                    </p>

                    {step.evidenceToCollect && (
                      <div className="pt-3 border-t border-slate-200 text-xs">
                        <span className="font-semibold text-slate-900">Evidence to secure: </span>
                        <span className="text-slate-600">{step.evidenceToCollect}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Need to draft your initial formal letter?</span>
              <button
                onClick={() => setActiveTab('letter')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <span>Go to Formal Letter Draft</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: WHAT NOT TO DO */}
        {activeTab === 'pitfalls' && (
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Critical Pitfalls &amp; Mistakes to Avoid</span>
              </div>
              <h3 className="text-xl font-serif-legal font-bold text-slate-900 mt-1">
                What NOT to Do
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Every year thousands of people lose valid claims because they make an avoidable tactical or legal mistake early on.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {analysis.whatNotToDo.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-rose-200 bg-rose-50/50">
                  <div className="flex items-start gap-2.5 mb-2">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✕
                    </span>
                    <h4 className="text-sm font-bold text-rose-950">
                      {item.pitfall}
                    </h4>
                  </div>

                  <div className="space-y-3 mt-3 text-xs">
                    <div>
                      <span className="font-semibold text-rose-900">Why this hurts you: </span>
                      <span className="text-rose-800/90 leading-relaxed">{item.whyDangerous}</span>
                    </div>

                    <div className="pt-2 border-t border-rose-200/80">
                      <span className="font-semibold text-slate-900">What to do instead: </span>
                      <span className="text-slate-700 leading-relaxed">{item.whatToAlternative}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700">
              <span className="font-semibold">Citizens Advice Principle:</span> Never sign "full and final settlement" forms or surrender tenancy keys without getting independent written confirmation of your rights first.
            </div>
          </div>
        )}

        {/* TAB 4: ORGANISATIONS THAT CAN HELP */}
        {activeTab === 'orgs' && (
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
                Free UK Legal &amp; Civic Infrastructure
              </span>
              <h3 className="text-xl font-serif-legal font-bold text-slate-900 mt-1">
                Verified Organisations That Can Help
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Official UK charities, statutory conciliation bodies, and ombudsman services with verified telephone and website contacts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.organisationsThatCanHelp.map((org, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-900 text-sm">{org.name}</span>
                      <span className="text-emerald-700 font-medium">{org.cost}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2 mb-4">
                      {org.role}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {org.phone ? (
                      <a
                        href={`tel:${org.phone.replace(/[^0-9]/g, '')}`}
                        className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{org.phone}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400">Online portal</span>
                    )}

                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-blue-900 hover:text-blue-700 underline"
                    >
                      <span>Official Website</span>
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong>Legal Aid eligibility in the UK:</strong> If you are on Universal Credit, Income Support, or have very low household income, you may qualify for government-funded <strong>Civil Legal Advice (CLA)</strong> for housing repossession, domestic abuse, or special educational needs. Call 0345 345 4345.
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FORMAL LETTER / NOTICE */}
        {activeTab === 'letter' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Official UK Pre-Action Communication
                  </span>
                  <h3 className="text-xl font-serif-legal font-bold text-slate-900 mt-1">
                    {analysis.formalLetter.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Addressed to: <strong className="text-slate-800">{analysis.formalLetter.recipientTitle}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsPersonalizing(!isPersonalizing)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isPersonalizing ? 'Close Form' : 'Fill Your Details'}</span>
                  </button>

                  <button
                    onClick={handleCopyLetter}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLetter ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
                  </button>

                  <button
                    onClick={handleDownloadLetter}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .txt</span>
                  </button>
                </div>
              </div>

              {/* Personalization Form Drawer */}
              {isPersonalizing && (
                <form onSubmit={handlePersonalizeSubmit} className="mb-6 p-5 rounded-xl bg-slate-100 border border-slate-300 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm mb-3">
                    Auto-Fill Letter Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sarah Jenkins"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Your Address &amp; Postcode</label>
                      <input
                        type="text"
                        placeholder="e.g. 14 High St, Manchester, M1 4AB"
                        value={senderAddress}
                        onChange={(e) => setSenderAddress(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Recipient Name / Company</label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Property Management Ltd"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Recipient Address / Email</label>
                      <input
                        type="text"
                        placeholder="e.g. 100 London Wall, London, EC2M 5QQ"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Reference / Account / Tenancy No.</label>
                      <input
                        type="text"
                        placeholder="e.g. TEN-84920 or ORD-10934"
                        value={refNumber}
                        onChange={(e) => setRefNumber(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Date of Incident / Letter</label>
                      <input
                        type="text"
                        placeholder="e.g. 5 October 2026"
                        value={incidentDate}
                        onChange={(e) => setIncidentDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block font-medium text-slate-700 mb-1">Exact Remedy Demanded</label>
                    <input
                      type="text"
                      placeholder="e.g. Immediate repair of heating within 7 days, or return of deposit £1,200"
                      value={demandedRemedy}
                      onChange={(e) => setDemandedRemedy(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPersonalizingLoading}
                    className="px-4 py-2 bg-slate-900 text-white rounded font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    {isPersonalizingLoading ? (
                      <span>Updating Letter with Your Details...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Update Letter Draft</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Letter Display Console */}
              <div className="relative rounded-xl border border-slate-300 bg-slate-50 p-6 sm:p-8 font-mono text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap select-all custom-scrollbar max-h-[600px] overflow-y-auto">
                {currentLetterText}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                <span>
                  <strong>Tip for sending:</strong> Always send via Royal Mail "Signed For" or retain email delivery receipts with timestamp as legal proof.
                </span>
                <span className="font-semibold text-slate-700">Pre-Action Protocol compliant</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FOLLOW-UP & ESCALATION */}
        {activeTab === 'escalation' && (
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
                Next Stage Roadmap
              </span>
              <h3 className="text-xl font-serif-legal font-bold text-slate-900 mt-1">
                Follow-up &amp; Escalation Guidance
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                What to do if the counterparty ignores your letter, denies liability, or misses the statutory deadline.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>1. If they ignore your letter or refuse your demand</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2">
                  {analysis.followUpGuidance.ifIgnored}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>2. Statutory Ombudsman &amp; Dispute Services</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2">
                  {analysis.followUpGuidance.escalationBody}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-slate-800" />
                  <span>3. Court &amp; Tribunal Realities (Costs &amp; Fee Remissions)</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2">
                  {analysis.followUpGuidance.courtWarning}
                </p>
                <div className="mt-3 text-xs bg-white p-3 rounded border border-slate-200 text-slate-600">
                  <strong>UK Small Claims Track rule:</strong> For claims under £10,000 in England &amp; Wales, you generally do NOT have to pay the other party's legal fees even if you lose, making it accessible to individuals representing themselves (Litigants in Person).
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-700" />
                  <span>4. Statutory Limitation Deadlines (Limitation Act 1980)</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2">
                  {analysis.followUpGuidance.statuteOfLimitations}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
