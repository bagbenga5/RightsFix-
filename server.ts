import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '2mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Curated verified UK public interest organisations database
const UK_ORGANISATIONS_DIRECTORY = [
  {
    category: 'General & Advice',
    name: 'Citizens Advice',
    description: 'Free, confidential, and independent advice across the UK on debt, housing, benefits, and employment.',
    phone: '0800 144 8848 (England) / 0800 702 2020 (Wales)',
    website: 'https://www.citizensadvice.org.uk',
    cost: 'Free, independent charity',
  },
  {
    category: 'Housing',
    name: 'Shelter UK',
    description: 'UK housing and homelessness charity providing emergency helpline, housing rights guides, and legal aid representation.',
    phone: '0808 800 4444 (urgent line)',
    website: 'https://www.shelter.org.uk',
    cost: 'Free legal advice & helpline',
  },
  {
    category: 'Employment',
    name: 'ACAS (Advisory, Conciliation and Arbitration Service)',
    description: 'Public body providing free workplace advice and mandatory Early Conciliation before Employment Tribunal claims.',
    phone: '0300 123 1100',
    website: 'https://www.acas.org.uk',
    cost: 'Free, statutory conciliation',
  },
  {
    category: 'Debt & Finance',
    name: 'StepChange Debt Charity',
    description: 'Leading UK debt advice charity providing free, expert debt advice and fee-free debt management plans (DMPs) and DRO assistance.',
    phone: '0800 138 1111',
    website: 'https://www.stepchange.org',
    cost: '100% Free & non-profit',
  },
  {
    category: 'Debt & Finance',
    name: 'Financial Ombudsman Service (FOS)',
    description: 'Official independent body that settles disputes between UK consumers and financial businesses (banks, insurers, loans) free of charge.',
    phone: '0800 023 4567',
    website: 'https://www.financial-ombudsman.org.uk',
    cost: 'Free to consumers',
  },
  {
    category: 'Consumer',
    name: 'Citizens Advice Consumer Service (formerly Consumer Direct)',
    description: 'Official government-partnered consumer helpline for complaints regarding faulty goods, services, and rogue traders.',
    phone: '0808 223 1133',
    website: 'https://www.citizensadvice.org.uk/consumer',
    cost: 'Free, phone rates apply',
  },
  {
    category: 'NHS & Healthcare',
    name: 'Parliamentary and Health Service Ombudsman (PHSO)',
    description: 'Makes final decisions on complaints about the NHS in England and UK government departments.',
    phone: '0345 015 4033',
    website: 'https://www.ombudsman.org.uk',
    cost: 'Free public service',
  },
  {
    category: 'Legal Aid & Representation',
    name: 'Civil Legal Advice (CLA)',
    description: 'Government service providing free legal aid advice for eligible people on low incomes or benefits (housing eviction, domestic abuse, debt).',
    phone: '0345 345 4345',
    website: 'https://www.gov.uk/civil-legal-advice',
    cost: 'Free if eligible for Legal Aid',
  },
  {
    category: 'Legal Aid & Representation',
    name: 'LawWorks & Law Centres Network',
    description: 'Network of community legal centres providing free legal advice and representation to residents who cannot afford solicitors.',
    phone: 'Find local centre via website',
    website: 'https://www.lawcentres.org.uk',
    cost: 'Free community legal aid',
  },
];

// Curated UK case studies for instant exploration
const SAMPLE_CASES = [
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
    category: 'Financial Services',
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

app.get('/api/sample-cases', (_req, res) => {
  res.json({ cases: SAMPLE_CASES });
});

app.get('/api/organisations', (_req, res) => {
  res.json({ organisations: UK_ORGANISATIONS_DIRECTORY });
});

app.post('/api/analyze-case', async (req, res) => {
  try {
    const { problemText, category, jurisdiction = 'England & Wales', urgency = 'Normal' } = req.body;

    if (!problemText || typeof problemText !== 'string' || problemText.trim().length < 10) {
      return res.status(400).json({
        error: 'Please describe your problem in at least a few sentences (10+ characters).',
      });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are RightsFix AI, a UK rights navigator designed to help people know their rights and fix what's wrong in plain language. You provide general information, not legal advice. Built on behalf of the Everyday Justice Lab (created by Bagbenga Bamodu, Access to Justice Advocate and Citizens Advice Adviser).

BRAND IDENTITY & CORE MISSION:
Everyday Justice Lab is a community of builders who turn confusing legal systems into plain-English tools that people can use. We prototype, test and share practical solutions that help people understand their rights and act early, before a problem becomes a dispute.

DESIGN & UX PRINCIPLES:
1. PLAIN-ENGLISH COMPLIANCE: Absolutely no dense legal legalese or complex jargon is allowed in the user interface. All legal terms must be broken down into clear, conversational language (e.g. explain Section 21 as 'no-fault eviction notice', explain Section 75 as 'credit card refund guarantee for purchases over £100', explain Mandatory Reconsideration as 'asking the department to review their refusal before an independent tribunal').
2. PREVENTATIVE FOCUS: Emphasize early diagnostic checks and proactive next steps (e.g., immediate preventative checklists, de-escalation tips, and automated formal letter notices) to resolve issues before they escalate into formal disputes or costly court action.
3. EMPATHETIC TONE: Calm, authoritative, supportive, empowering, and accessible to ordinary people who cannot afford a private solicitor (£250-£500/hr).

UK JURISDICTION NOTE:
You specialize in UK law (England & Wales, with explicit warnings if Scots Law or Northern Ireland law differs significantly, e.g. Scottish PRT tenancies vs England AST, or Scottish employment tribunals).

You MUST return a clean JSON object according to the schema provided.`;

    const userPrompt = `Please analyze the following UK everyday justice issue on behalf of Everyday Justice Lab:
User Problem: "${problemText.trim()}"
Selected Category: ${category || 'Auto-detect (Housing, Employment, Consumer Rights, Benefits, NHS, or Financial Services)'}
Selected UK Jurisdiction: ${jurisdiction}
Self-reported Urgency: ${urgency}

Respond with full plain-English clarity, preventative checklist, what not to do, relevant statutory citations, verified UK support organisations, and a draft formal dispute/complaint letter.`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: unknown = null;
    let responseText: string | null = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.2,
            thinkingConfig: model.startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description: 'Clear, empathetic 1-2 sentence executive summary of the legal issue and user standing.',
                },
                detectedCategory: {
                  type: Type.STRING,
                  description: 'One of: Housing, Employment, Consumer Rights, Benefits, NHS & Healthcare, Financial Services & Debt',
                },
                jurisdictionNote: {
                  type: Type.STRING,
                  description: 'Specific note confirming England & Wales, Scotland, or Northern Ireland legal framework.',
                },
                urgencyRating: {
                  type: Type.STRING,
                  description: 'Urgency assessment: Low, Medium, High, or Critical Deadline',
                },
                whatTheLawSays: {
                  type: Type.OBJECT,
                  properties: {
                    coreRule: {
                      type: Type.STRING,
                      description: 'The bottom-line legal rule in plain English.',
                    },
                    detailedRights: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Bullet points explaining user specific legal rights.',
                    },
                    relevantStatutes: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          actName: { type: Type.STRING },
                          section: { type: Type.STRING },
                          explanation: { type: Type.STRING },
                        },
                        required: ['actName', 'explanation'],
                      },
                      description: 'Citations of key UK Acts of Parliament or Regulations.',
                    },
                  },
                  required: ['coreRule', 'detailedRights', 'relevantStatutes'],
                },
                actionPlan: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      deadlineOrTiming: { type: Type.STRING },
                      actionDetails: { type: Type.STRING },
                      evidenceToCollect: { type: Type.STRING },
                    },
                    required: ['stepNumber', 'title', 'deadlineOrTiming', 'actionDetails'],
                  },
                  description: 'Sequential numbered step-by-step action plan.',
                },
                whatNotToDo: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pitfall: { type: Type.STRING },
                      whyDangerous: { type: Type.STRING },
                      whatToAlternative: { type: Type.STRING },
                    },
                    required: ['pitfall', 'whyDangerous', 'whatToAlternative'],
                  },
                  description: 'Critical mistakes and pitfalls to avoid.',
                },
                organisationsThatCanHelp: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      role: { type: Type.STRING },
                      phone: { type: Type.STRING },
                      website: { type: Type.STRING },
                      cost: { type: Type.STRING },
                    },
                    required: ['name', 'role', 'website', 'cost'],
                  },
                  description: 'List of verified UK free support organisations.',
                },
                followUpGuidance: {
                  type: Type.OBJECT,
                  properties: {
                    ifIgnored: { type: Type.STRING, description: 'What to do if the counterparty ignores your letter/complaint' },
                    escalationBody: { type: Type.STRING, description: 'Statutory ombudsman, tribunal, or dispute service to escalate to' },
                    courtWarning: { type: Type.STRING, description: 'Realistic advice on County Court / Small Claims Track / Employment Tribunal risks and fee remissions' },
                    statuteOfLimitations: { type: Type.STRING, description: 'Limitation period under Limitation Act 1980 or statutory deadline' },
                  },
                  required: ['ifIgnored', 'escalationBody', 'courtWarning', 'statuteOfLimitations'],
                },
                formalLetter: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: 'Letter title, e.g. Letter Before Claim or Formal Grievance' },
                    recipientTitle: { type: Type.STRING, description: 'E.g., The Landlord / The HR Manager / The Retailer Complaints Dept' },
                    letterText: { type: Type.STRING, description: 'Full letter draft formatted with date, addresses, citations, demand, and deadline' },
                  },
                  required: ['title', 'recipientTitle', 'letterText'],
                },
                earlyPreventativeChecklist: {
                  type: Type.OBJECT,
                  properties: {
                    stageDiagnosis: {
                      type: Type.STRING,
                      description: 'Preventative diagnosis: e.g. Early Warning (pre-dispute), Impasse, or Critical Notice Stage',
                    },
                    immediateChecklist: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          task: { type: Type.STRING, description: 'Concrete preventative action in plain English' },
                          whyItPreventsDispute: { type: Type.STRING, description: 'How taking this early step prevents a costly legal battle' },
                          suggestedDeadline: { type: Type.STRING, description: 'Suggested early timing, e.g. Within 48 hours or Before next pay run' },
                        },
                        required: ['task', 'whyItPreventsDispute', 'suggestedDeadline'],
                      },
                      description: 'Printable / actionable early steps before formal escalation.',
                    },
                    deEscalationTip: {
                      type: Type.STRING,
                      description: 'Constructive, non-confrontational advice to de-escalate and resolve before court or tribunal.',
                    },
                  },
                  required: ['stageDiagnosis', 'immediateChecklist', 'deEscalationTip'],
                },
              },
              required: [
                'summary',
                'detectedCategory',
                'jurisdictionNote',
                'urgencyRating',
                'whatTheLawSays',
                'actionPlan',
                'whatNotToDo',
                'earlyPreventativeChecklist',
                'organisationsThatCanHelp',
                'followUpGuidance',
                'formalLetter',
              ],
            },
          },
        });

        if (response.text) {
          responseText = response.text.trim();
          break; // successfully got response
        }
      } catch (err) {
        console.warn(`Model ${model} failed, attempting next fallback...`, err instanceof Error ? err.message : err);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error('All models failed to respond.');
    }

    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown server error';
    console.error('Error analyzing case:', errorMsg);
    return res.status(500).json({
      error: 'Failed to generate legal guidance. Please check your query and try again.',
      details: errorMsg,
    });
  }
});

// Refine or personalize legal letter
app.post('/api/personalize-letter', async (req, res) => {
  try {
    const { baseLetter, senderName, senderAddress, recipientName, recipientAddress, referenceNumber, incidentDate, specificDemands } = req.body;

    if (!baseLetter) {
      return res.status(400).json({ error: 'Base letter text is required.' });
    }

    const ai = getGeminiClient();

    const prompt = `You are RightsFix AI UK Legal Letter Assistant.
Take this base UK legal letter:
"""
${baseLetter}
"""

Replace all placeholder brackets and personalize it using the user details:
- Sender Name: ${senderName || '[Your Full Name]'}
- Sender Address: ${senderAddress || '[Your Address, Postcode]'}
- Recipient Name/Organisation: ${recipientName || '[Recipient Name / Company]'}
- Recipient Address: ${recipientAddress || '[Recipient Address, Postcode]'}
- Reference / Account / Tenancy / Claim Number: ${referenceNumber || '[Reference / Account No.]'}
- Date of Incident / Notice: ${incidentDate || '[Date]'}
- Specific Settlement / Remedy Demanded: ${specificDemands || 'Full refund / immediate repair / withdrawal of unlawful notice'}

Ensure UK formal business letter layout, strict adherence to UK Civil Procedure Rules (Pre-Action Protocol for Debt/Housing or ACAS Code of Practice), professional assertive tone without aggression, standard 14-day deadline, and clear closing.
Return a JSON object with:
{
  "formattedLetter": string,
  "keyAdvice": string
}`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let letterTextRes: string | null = null;
    let lastErr: unknown = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          letterTextRes = response.text.trim();
          break;
        }
      } catch (e) {
        lastErr = e;
      }
    }

    if (!letterTextRes) {
      throw lastErr || new Error('Failed to personalize letter');
    }

    const parsed = JSON.parse(letterTextRes);
    return res.json({ success: true, data: parsed });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error personalizing letter:', errorMsg);
    return res.status(500).json({ error: 'Failed to personalize letter', details: errorMsg });
  }
});

// Vite or Static assets
if (!isProduction) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`RightsFix AI Server running on http://0.0.0.0:${PORT}`);
});
