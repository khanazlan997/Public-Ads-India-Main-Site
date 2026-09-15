import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where 
} from 'firebase/firestore';
import type { BankDetails, DataSubmission } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

export interface MaskedBankSample {
  publisherId: string;
  holderName: string;
  maskedAccount: string;
  maskedUpi: string;
  phone: string;
  hasQrCode: boolean;
}

export interface LeadSample {
  id: string;
  publisherId: string;
  publisherName: string;
  campaignName: string;
  clientName: string;
  submitDate: string;
  status: string;
  payout: number;
}

export interface FirestoreDiagnosticResult {
  timestamp: string;
  databaseId: string;
  projectId: string;
  authenticatedUser: {
    type: 'publisher' | 'admin' | 'employee' | 'anonymous';
    id: string;
    name: string;
    role?: string;
  } | null;
  bankDetails: {
    status: 'HEALTHY' | 'EMPTY' | 'ERROR';
    totalCount: number;
    targetUserRecordFound: boolean;
    targetUserRecord: MaskedBankSample | null;
    allPublisherIds: string[];
    samples: MaskedBankSample[];
    error?: string;
  };
  leads: {
    status: 'HEALTHY' | 'EMPTY' | 'ERROR';
    totalCount: number;
    targetUserLeadsCount: number;
    statusBreakdown: Record<string, number>;
    targetUserSamples: LeadSample[];
    globalSamples: LeadSample[];
    error?: string;
  };
  performance: {
    bankFetchDurationMs: number;
    leadsFetchDurationMs: number;
    totalDurationMs: number;
  };
  overallStatus: 'VERIFIED' | 'PARTIAL' | 'FAILED';
  summary: string;
}

/**
 * Masks account number for safe diagnostic preview (e.g. ••••••••5678)
 */
function maskAccountNumber(acc?: string): string {
  if (!acc) return 'Not Provided';
  const clean = acc.replace(/\s/g, '');
  if (clean.length <= 4) return clean;
  return '•'.repeat(Math.max(0, clean.length - 4)) + clean.slice(-4);
}

/**
 * Masks UPI ID for safe diagnostic preview (e.g. ro***@okaxis)
 */
function maskUpi(upi?: string): string {
  if (!upi) return 'Not Provided';
  const parts = upi.split('@');
  if (parts.length < 2) return upi;
  const user = parts[0];
  const domain = parts[1];
  const maskedUser = user.length > 2 ? `${user.slice(0, 2)}***` : user;
  return `${maskedUser}@${domain}`;
}

/**
 * Fetches bank details directly from the Firestore collection 'bank_details'
 */
export async function fetchDirectBankDetails(targetPublisherId?: string): Promise<{
  success: boolean;
  totalCount: number;
  records: Record<string, BankDetails>;
  targetUserBank: BankDetails | null;
  samples: MaskedBankSample[];
  allPublisherIds: string[];
  durationMs: number;
  error?: string;
}> {
  const startTime = performance.now();
  const records: Record<string, BankDetails> = {};
  const allPublisherIds: string[] = [];
  const samples: MaskedBankSample[] = [];
  let targetUserBank: BankDetails | null = null;

  try {
    const snap = await getDocs(collection(db, 'bank_details'));
    snap.forEach((docSnap) => {
      const data = docSnap.data() as BankDetails;
      const pubId = String(data.publisherId || docSnap.id).trim();
      if (pubId) {
        records[pubId] = { ...data, publisherId: pubId };
        if (!allPublisherIds.includes(pubId)) {
          allPublisherIds.push(pubId);
        }
      }
    });

    // Check if target user bank is present in collection snapshot
    if (targetPublisherId) {
      const cleanTarget = targetPublisherId.trim().toLowerCase();
      const match = Object.values(records).find(b => 
        b.publisherId.toLowerCase() === cleanTarget
      );
      if (match) {
        targetUserBank = match;
      } else {
        // Direct document probe attempt by ID (both uppercase & lowercase)
        try {
          const directSnap = await getDoc(doc(db, 'bank_details', targetPublisherId.trim().toUpperCase()));
          if (directSnap.exists()) {
            targetUserBank = directSnap.data() as BankDetails;
            records[targetPublisherId.trim().toUpperCase()] = targetUserBank;
          } else {
            const directSnapLower = await getDoc(doc(db, 'bank_details', targetPublisherId.trim().toLowerCase()));
            if (directSnapLower.exists()) {
              targetUserBank = directSnapLower.data() as BankDetails;
              records[targetPublisherId.trim().toLowerCase()] = targetUserBank;
            }
          }
        } catch (probeErr) {
          console.warn('[Diagnostic] Direct document lookup notice:', probeErr);
        }
      }
    }

    // Build sanitized diagnostic samples (up to 5)
    Object.values(records).slice(0, 5).forEach((b) => {
      samples.push({
        publisherId: b.publisherId,
        holderName: b.holderName || 'N/A',
        maskedAccount: maskAccountNumber(b.accountNumber),
        maskedUpi: maskUpi(b.upi),
        phone: b.phone ? `${b.phone.slice(0, 3)}***${b.phone.slice(-3)}` : 'N/A',
        hasQrCode: Boolean(b.qrCode && b.qrCode.length > 50)
      });
    });

    const durationMs = Math.round(performance.now() - startTime);
    return {
      success: true,
      totalCount: Object.keys(records).length,
      records,
      targetUserBank,
      samples,
      allPublisherIds,
      durationMs
    };
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - startTime);
    return {
      success: false,
      totalCount: 0,
      records: {},
      targetUserBank: null,
      samples: [],
      allPublisherIds: [],
      durationMs,
      error: err?.message || String(err)
    };
  }
}

/**
 * Fetches leads / submissions directly from the Firestore collection 'submissions'
 */
export async function fetchDirectLeads(targetPublisherId?: string): Promise<{
  success: boolean;
  totalCount: number;
  leads: DataSubmission[];
  targetUserLeads: DataSubmission[];
  statusBreakdown: Record<string, number>;
  targetUserSamples: LeadSample[];
  globalSamples: LeadSample[];
  durationMs: number;
  error?: string;
}> {
  const startTime = performance.now();
  const leads: DataSubmission[] = [];
  const targetUserLeads: DataSubmission[] = [];
  const statusBreakdown: Record<string, number> = {};

  try {
    const snap = await getDocs(collection(db, 'submissions'));
    const cleanTarget = targetPublisherId ? targetPublisherId.trim().toLowerCase() : null;

    snap.forEach((docSnap) => {
      const data = docSnap.data() as DataSubmission;
      const leadItem = { ...data, id: data.id || docSnap.id };
      leads.push(leadItem);

      // Status breakdown
      const st = leadItem.status || 'Process';
      statusBreakdown[st] = (statusBreakdown[st] || 0) + 1;

      // Target user check
      if (cleanTarget && leadItem.publisherId && leadItem.publisherId.trim().toLowerCase() === cleanTarget) {
        targetUserLeads.push(leadItem);
      }
    });

    // If target publisher had 0 results from general fetch, also try a direct Firestore query filter
    if (targetPublisherId && targetUserLeads.length === 0) {
      try {
        const qUpper = query(collection(db, 'submissions'), where('publisherId', '==', targetPublisherId.trim().toUpperCase()));
        const qSnap = await getDocs(qUpper);
        qSnap.forEach((docSnap) => {
          const item = { ...(docSnap.data() as DataSubmission), id: docSnap.id };
          if (!targetUserLeads.some(l => l.id === item.id)) {
            targetUserLeads.push(item);
          }
        });
      } catch (qErr) {
        console.warn('[Diagnostic] Direct where query notice:', qErr);
      }
    }

    const toLeadSample = (l: DataSubmission): LeadSample => ({
      id: l.id,
      publisherId: l.publisherId,
      publisherName: l.publisherName || 'N/A',
      campaignName: l.campaignName || 'N/A',
      clientName: l.clientName || 'N/A',
      submitDate: l.submitDate || 'N/A',
      status: l.status,
      payout: l.payout || 0
    });

    const globalSamples = leads.slice(0, 5).map(toLeadSample);
    const targetUserSamples = targetUserLeads.slice(0, 5).map(toLeadSample);
    const durationMs = Math.round(performance.now() - startTime);

    return {
      success: true,
      totalCount: leads.length,
      leads,
      targetUserLeads,
      statusBreakdown,
      targetUserSamples,
      globalSamples,
      durationMs
    };
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - startTime);
    return {
      success: false,
      totalCount: 0,
      leads: [],
      targetUserLeads: [],
      statusBreakdown: {},
      targetUserSamples: [],
      globalSamples: [],
      durationMs,
      error: err?.message || String(err)
    };
  }
}

/**
 * Master diagnostic runner to fetch and verify bank details and leads from Firestore
 */
export async function runFirestoreDiagnostic(options?: {
  user?: { type: 'publisher' | 'admin' | 'employee'; id: string; name: string; role?: string } | null;
  targetPublisherId?: string;
  logToConsole?: boolean;
}): Promise<FirestoreDiagnosticResult> {
  const overallStart = performance.now();
  const shouldLog = options?.logToConsole !== false;

  // Resolve current user if not provided
  let activeUser = options?.user || null;
  if (!activeUser && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('pai_user_session');
      if (cached) activeUser = JSON.parse(cached);
    } catch (e) {}
  }

  const effectivePublisherId = options?.targetPublisherId || (activeUser?.type === 'publisher' ? activeUser.id : undefined);

  // Parallel retrieval of bank details and leads directly from Firestore
  const [bankResult, leadsResult] = await Promise.all([
    fetchDirectBankDetails(effectivePublisherId),
    fetchDirectLeads(effectivePublisherId)
  ]);

  const totalDurationMs = Math.round(performance.now() - overallStart);

  // Determine health states
  const bankStatus = bankResult.success ? (bankResult.totalCount > 0 ? 'HEALTHY' : 'EMPTY') : 'ERROR';
  const leadsStatus = leadsResult.success ? (leadsResult.totalCount > 0 ? 'HEALTHY' : 'EMPTY') : 'ERROR';
  
  let overallStatus: 'VERIFIED' | 'PARTIAL' | 'FAILED' = 'VERIFIED';
  if (!bankResult.success || !leadsResult.success) {
    overallStatus = 'FAILED';
  } else if (bankStatus === 'EMPTY' && leadsStatus === 'EMPTY') {
    overallStatus = 'PARTIAL';
  }

  const summaryParts: string[] = [];
  summaryParts.push(`Firestore Collection [bank_details]: ${bankResult.totalCount} docs retrieved in ${bankResult.durationMs}ms (${bankStatus}).`);
  summaryParts.push(`Firestore Collection [submissions]: ${leadsResult.totalCount} leads retrieved in ${leadsResult.durationMs}ms (${leadsStatus}).`);
  
  if (effectivePublisherId) {
    summaryParts.push(
      `Publisher (${effectivePublisherId}): Bank Ledger ${bankResult.targetUserBank ? 'FOUND ✅' : 'NOT FOUND ⚠️'} | Leads: ${leadsResult.targetUserLeads.length} record(s).`
    );
  }

  const result: FirestoreDiagnosticResult = {
    timestamp: new Date().toISOString(),
    databaseId: firebaseConfig.firestoreDatabaseId || 'default',
    projectId: firebaseConfig.projectId,
    authenticatedUser: activeUser ? {
      type: activeUser.type,
      id: activeUser.id,
      name: activeUser.name,
      role: activeUser.role
    } : null,
    bankDetails: {
      status: bankStatus,
      totalCount: bankResult.totalCount,
      targetUserRecordFound: Boolean(bankResult.targetUserBank),
      targetUserRecord: bankResult.targetUserBank ? {
        publisherId: bankResult.targetUserBank.publisherId,
        holderName: bankResult.targetUserBank.holderName,
        maskedAccount: maskAccountNumber(bankResult.targetUserBank.accountNumber),
        maskedUpi: maskUpi(bankResult.targetUserBank.upi),
        phone: bankResult.targetUserBank.phone,
        hasQrCode: Boolean(bankResult.targetUserBank.qrCode)
      } : null,
      allPublisherIds: bankResult.allPublisherIds,
      samples: bankResult.samples,
      error: bankResult.error
    },
    leads: {
      status: leadsStatus,
      totalCount: leadsResult.totalCount,
      targetUserLeadsCount: leadsResult.targetUserLeads.length,
      statusBreakdown: leadsResult.statusBreakdown,
      targetUserSamples: leadsResult.targetUserSamples,
      globalSamples: leadsResult.globalSamples,
      error: leadsResult.error
    },
    performance: {
      bankFetchDurationMs: bankResult.durationMs,
      leadsFetchDurationMs: leadsResult.durationMs,
      totalDurationMs
    },
    overallStatus,
    summary: summaryParts.join(' ')
  };

  // Diagnostic Console Output for Admin / Developer verification
  if (shouldLog && typeof console !== 'undefined') {
    const isSuccess = overallStatus === 'VERIFIED';
    const headerColor = isSuccess ? '#10b981' : '#f59e0b';
    console.groupCollapsed(
      `%c🔍 [Firestore Diagnostic] Status: ${overallStatus} | ${result.databaseId} (${totalDurationMs}ms)`,
      `color: #ffffff; background: ${headerColor}; font-weight: bold; padding: 3px 8px; border-radius: 4px;`
    );
    console.log('User Session:', activeUser || 'Anonymous / Guest');
    console.log('Database:', { projectId: result.projectId, databaseId: result.databaseId });
    console.log('Bank Details Retrieval:', {
      status: result.bankDetails.status,
      count: result.bankDetails.totalCount,
      durationMs: bankResult.durationMs,
      targetPublisher: effectivePublisherId || 'All',
      targetFound: result.bankDetails.targetUserRecordFound,
      targetRecord: result.bankDetails.targetUserRecord,
      allPublishers: result.bankDetails.allPublisherIds
    });
    console.table(result.bankDetails.samples);

    console.log('Leads / Submissions Retrieval:', {
      status: result.leads.status,
      count: result.leads.totalCount,
      targetUserCount: result.leads.targetUserLeadsCount,
      durationMs: leadsResult.durationMs,
      statusBreakdown: result.leads.statusBreakdown
    });
    console.table(result.leads.globalSamples.slice(0, 10));

    if (result.leads.targetUserSamples.length > 0) {
      console.log(`User Specific Leads (${effectivePublisherId}):`);
      console.table(result.leads.targetUserSamples);
    }
    console.groupEnd();
  }

  return result;
}

// Automatically expose diagnostic utility on window for browser console testing
if (typeof window !== 'undefined') {
  (window as any).runFirestoreDiagnostic = runFirestoreDiagnostic;
  (window as any).fetchDirectBankDetails = fetchDirectBankDetails;
  (window as any).fetchDirectLeads = fetchDirectLeads;
  console.log('⚡ [PublicAds] Firestore diagnostic utility loaded. Run `window.runFirestoreDiagnostic()` in console to verify retrieval anytime.');
}
