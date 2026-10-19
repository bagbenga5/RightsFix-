export type UKJurisdiction = 'England & Wales' | 'Scotland' | 'Northern Ireland';

export type LegalCategory = 
  | 'All'
  | 'Housing'
  | 'Employment'
  | 'Consumer Rights'
  | 'Benefits'
  | 'NHS & Healthcare'
  | 'Financial Services & Debt';

export interface StatuteCitation {
  actName: string;
  section?: string;
  explanation: string;
}

export interface ActionStep {
  stepNumber: number;
  title: string;
  deadlineOrTiming: string;
  actionDetails: string;
  evidenceToCollect?: string;
}

export interface PitfallWarning {
  pitfall: string;
  whyDangerous: string;
  whatToAlternative: string;
}

export interface SupportOrganisation {
  name: string;
  role: string;
  phone?: string;
  website: string;
  cost: string;
}

export interface FollowUpGuidance {
  ifIgnored: string;
  escalationBody: string;
  courtWarning: string;
  statuteOfLimitations: string;
}

export interface FormalLetter {
  title: string;
  recipientTitle: string;
  letterText: string;
}

export interface WhatTheLawSays {
  coreRule: string;
  detailedRights: string[];
  relevantStatutes: StatuteCitation[];
}

export interface PreventativeTask {
  task: string;
  whyItPreventsDispute: string;
  suggestedDeadline: string;
}

export interface EarlyPreventativeChecklist {
  stageDiagnosis: string;
  immediateChecklist: PreventativeTask[];
  deEscalationTip: string;
}

export interface CaseAnalysisResult {
  summary: string;
  detectedCategory: string;
  jurisdictionNote: string;
  urgencyRating: string;
  whatTheLawSays: WhatTheLawSays;
  actionPlan: ActionStep[];
  whatNotToDo: PitfallWarning[];
  earlyPreventativeChecklist?: EarlyPreventativeChecklist;
  organisationsThatCanHelp: SupportOrganisation[];
  followUpGuidance: FollowUpGuidance;
  formalLetter: FormalLetter;
}

export interface SampleCase {
  id: string;
  title: string;
  category: string;
  jurisdiction: string;
  description: string;
  urgency: string;
}
