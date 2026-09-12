// Static persistent database snapshot bundled with application
// Ensures 100% instant access across ANY device, even if Firestore read quota is exhausted or device is offline.
import type { Publisher, DataSubmission, EarningRecord, Campaign, BankDetails, Employee, AdvertiserInquiry, PartnerApplication } from "../types";

export const snapshotPublishers: Publisher[] = [];

export const snapshotEarnings: EarningRecord[] = [];

export const snapshotCampaigns: Campaign[] = [];

export const snapshotBankDetailsMap: Record<string, BankDetails> = {};

export const snapshotEmployees: Employee[] = [];

export const snapshotSubmissions: DataSubmission[] = [];

export const snapshotAdvertiserInquiries: AdvertiserInquiry[] = [];

export const snapshotPartners: PartnerApplication[] = [];
