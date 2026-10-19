import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Printer, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  StickyNote, 
  Plus, 
  Trash2,
  Filter
} from 'lucide-react';
import { ActionStep, PreventativeTask } from '../types';

export interface ChecklistItem {
  id: string;
  stepNumber: number;
  title: string;
  timing: string;
  details: string;
  evidence?: string;
  category: 'preventative' | 'statutory_action';
  completed: boolean;
  userNote?: string;
  completedAt?: string;
}

interface InteractiveActionChecklistProps {
  caseSummary: string;
  categoryName: string;
  actionPlan: ActionStep[];
  preventativeTasks?: PreventativeTask[];
  onOpenLetter?: () => void;
}

export const InteractiveActionChecklist: React.FC<InteractiveActionChecklistProps> = ({
  caseSummary,
  categoryName,
  actionPlan,
  preventativeTasks = [],
  onOpenLetter,
}) => {
  const storageKey = `everyday_justice_checklist_${categoryName.toLowerCase().replace(/\s+/g, '_')}_${caseSummary.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '')}`;

  // Build unified list of checklist items from preventative tasks and action plan
  const buildInitialItems = (): ChecklistItem[] => {
    const items: ChecklistItem[] = [];
    let counter = 1;

    // 1. Add early preventative tasks first (Act early focus)
    preventativeTasks.forEach((t) => {
      items.push({
        id: `prev-${counter}`,
        stepNumber: counter++,
        title: t.task,
        timing: t.suggestedDeadline,
        details: t.whyItPreventsDispute,
        category: 'preventative',
        completed: false,
      });
    });

    // 2. Add sequential statutory action plan steps
    actionPlan.forEach((s) => {
      items.push({
        id: `act-${counter}`,
        stepNumber: counter++,
        title: s.title,
        timing: s.deadlineOrTiming,
        details: s.actionDetails,
        evidence: s.evidenceToCollect,
        category: 'statutory_action',
        completed: false,
      });
    });

    return items;
  };

  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read saved checklist from localStorage', e);
    }
    return buildInitialItems();
  });

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save checklist to localStorage', e);
    }
  }, [items, storageKey]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextCompleted = !item.completed;
          return {
            ...item,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : undefined,
          };
        }
        return item;
      })
    );
  };

  const updateNote = (id: string, noteText: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, userNote: noteText } : item))
    );
  };

  const toggleNoteExpanded = (id: string) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = () => {
    if (window.confirm('Reset all progress and notes for this checklist?')) {
      const fresh = buildInitialItems();
      setItems(fresh);
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        // ignore
      }
    }
  };

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredItems = items.filter((item) => {
    if (filter === 'pending') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });

  const handleCopySummary = () => {
    const text = items
      .map(
        (i) =>
          `[${i.completed ? 'X' : ' '}] Step ${i.stepNumber}: ${i.title} (${i.timing})\n    Details: ${i.details}${
            i.evidence ? `\n    Evidence: ${i.evidence}` : ''
          }${i.userNote ? `\n    Note: ${i.userNote}` : ''}`
      )
      .join('\n\n');

    const fullExport = `Everyday Justice Lab — Action Tracker\nCategory: ${categoryName}\nProgress: ${completedCount}/${totalCount} (${progressPercent}%)\n\n${text}\n\nGenerated via RightsFix AI · Everyday Justice Lab`;
    navigator.clipboard.writeText(fullExport);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-5 sm:p-8">
      {/* Header with Title & Live Progress Bar */}
      <div className="pb-6 mb-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Everyday Justice Lab · Personal Action Tracker</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif-legal font-bold text-slate-900">
              Your Interactive Progress Checklist
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Click each step as you complete it. Your progress is saved automatically so you can track your case over time.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              title="Copy checklist text to clipboard"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              title="Print progress checklist"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Checklist</span>
            </button>

            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              title="Reset all checkboxes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <span>Overall Completion:</span>
              <span className="text-blue-900 font-bold">
                {completedCount} of {totalCount} steps done ({progressPercent}%)
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              {progressPercent === 100 ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All steps completed!
                </span>
              ) : progressPercent > 0 ? (
                <span className="text-blue-800">In progress · Keep going</span>
              ) : (
                <span>Ready to start</span>
              )}
            </div>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressPercent === 100
                  ? 'bg-emerald-600'
                  : progressPercent > 50
                  ? 'bg-blue-700'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Motivational Hint */}
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
            <span>
              {progressPercent === 100
                ? 'Outstanding work. You have systematically built and preserved your legal standing.'
                : progressPercent > 0
                ? 'Taking small, documented steps early prevents counterparties from ignoring your rights.'
                : 'Start with Step 1 below to establish contemporaneous evidence before speaking to the other party.'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Steps ({totalCount})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="text-xs text-slate-500 italic">
          Progress saved locally in your browser
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl border transition-all ${
              item.completed
                ? 'bg-emerald-50/40 border-emerald-300'
                : 'bg-slate-50/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3.5">
                {/* Clickable Checkbox Button */}
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-label={item.completed ? 'Mark step as incomplete' : 'Mark step as complete'}
                  className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                    item.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-400 bg-white hover:border-blue-700 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Step {item.stepNumber}
                      </span>
                      {item.category === 'preventative' && (
                        <span className="text-[10px] font-semibold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded">
                          Early Prevention
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-amber-700" />
                      <span>{item.timing}</span>
                    </div>
                  </div>

                  <h4
                    onClick={() => toggleItem(item.id)}
                    className={`text-sm sm:text-base font-bold cursor-pointer transition-colors ${
                      item.completed
                        ? 'line-through text-slate-500'
                        : 'text-slate-900 hover:text-blue-900'
                    }`}
                  >
                    {item.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5">
                    {item.details}
                  </p>

                  {/* Evidence Requirement */}
                  {item.evidence && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-xs">
                      <span className="font-semibold text-slate-800">Evidence needed: </span>
                      <span className="text-slate-600">{item.evidence}</span>
                    </div>
                  )}

                  {/* Completion Timestamp */}
                  {item.completed && item.completedAt && (
                    <div className="mt-2 text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completed on {item.completedAt}</span>
                    </div>
                  )}

                  {/* User Personal Notes Drawer */}
                  <div className="mt-3 pt-2 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleNoteExpanded(item.id)}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
                    >
                      <StickyNote className="w-3 h-3 text-amber-600" />
                      <span>
                        {item.userNote ? 'Edit your note' : 'Add personal case note'}
                      </span>
                      {expandedNotes[item.id] ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {item.title.toLowerCase().includes('letter') && onOpenLetter && (
                      <button
                        type="button"
                        onClick={onOpenLetter}
                        className="text-xs font-semibold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Jump to Letter Draft</span>
                      </button>
                    )}
                  </div>

                  {/* Note Input Field */}
                  {expandedNotes[item.id] && (
                    <div className="mt-2.5">
                      <textarea
                        rows={2}
                        value={item.userNote || ''}
                        onChange={(e) => updateNote(item.id, e.target.value)}
                        placeholder="Add date, who you spoke to, postal tracking numbers, or notes here..."
                        className="w-full bg-white p-2.5 text-xs text-slate-800 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            No steps match the current filter.
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Everyday Justice Lab: Practical plain-English tools that people can use.</span>
        </div>

        {onOpenLetter && (
          <button
            onClick={onOpenLetter}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Review Formal Letter Notice</span>
            <FileText className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
