export const DEFAULT_PROJECTION_ASSUMPTIONS = {
  show_up_rate: 0.7,
  offer_rate: 0.4,
  close_rate: 0.25,
  avg_deal_size: 5000,
  collection_rate: 0.8,
  best_case_multiplier: 1.3,
  worst_case_multiplier: 0.7,
} as const;

export const RED_FLAG_THRESHOLDS = {
  booking_lag_days: 4,
  aging_days: 7,
  deposit_unpaid_days: 14,
  show_up_rate_min: 0.7,
  offer_rate_min: 0.4,
  close_rate_min: 0.2,
} as const;

export const DATE_FORMATS = {
  display: 'MMM d, yyyy',
  displayTime: 'MMM d, yyyy h:mm a',
  input: 'yyyy-MM-dd',
  inputTime: 'yyyy-MM-dd HH:mm',
  month: 'yyyy-MM',
} as const;

export const STATUS_ORDER = {
  'New': 0,
  'Proposal': 1,
  'Deposit': 2,
  'Follow-Up Ongoing': 3,
  'Meeting Follow-Up': 4,
  'Won': 5,
  'Lost': 6,
} as const;

export const LEAD_STATUSES = [
  'New',
  'Proposal',
  'Deposit',
  'Follow-Up Ongoing',
  'Meeting Follow-Up',
  'Won',
  'Lost',
] as const;

export const MEETING_STATUSES = [
  'Show',
  'No-Show',
  'Rescheduled By Us',
  'Rescheduled By Them',
  'Cancel',
  'DQ',
] as const;

export const CALL_TYPES = [
  '1-Call Sale',
  'Follow-Up Sale',
] as const;

export const LOSS_REASONS = [
  'Price',
  'Timing',
  'Partner-Spouse',
  'Competitor',
  'Ghosted',
  'Not Qualified',
] as const;

export const LEAD_SOURCES = [
  'Cold Call',
  'Cold Email',
  'LinkedIn',
  'Referral',
  'Inbound',
  'Ad',
  'Other',
] as const;