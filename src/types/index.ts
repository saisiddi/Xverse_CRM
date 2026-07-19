export type LeadStatus = 
  | 'New' 
  | 'Proposal' 
  | 'Deposit' 
  | 'Follow-Up Ongoing' 
  | 'Meeting Follow-Up' 
  | 'Won' 
  | 'Lost';

export type MeetingStatus = 
  | 'Show' 
  | 'No-Show' 
  | 'Rescheduled By Us' 
  | 'Rescheduled By Them' 
  | 'Cancel' 
  | 'DQ';

export type CallType = '1-Call Sale' | 'Follow-Up Sale';

export type LossReason = 
  | 'Price' 
  | 'Timing' 
  | 'Partner-Spouse' 
  | 'Competitor' 
  | 'Ghosted' 
  | 'Not Qualified';

export type LeadSource = 
  | 'Cold Call' 
  | 'Cold Email' 
  | 'LinkedIn' 
  | 'Referral' 
  | 'Inbound' 
  | 'Ad' 
  | 'Other';

export interface Lead {
  id: string;
  // Contact Info
  lead_name: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: LeadSource;
  setter_name?: string;
  closer_name?: string;
  
  // Status
  status: LeadStatus;
  
  // Dates
  date_created: string;
  first_contact_date?: string;
  date_meeting_booked?: string;
  date_of_meeting?: string;
  last_touch_date?: string;
  date_paid_in_full?: string;
  
  // Meeting Status
  meeting_status?: MeetingStatus;
  
  // Call Outcome
  offer_made: boolean;
  call_type?: CallType;
  
  // Loss Details
  loss_reason?: LossReason;
  
  // Money
  deposit_amount: number;
  total_deal_value: number;
  cash_collected: number;
  refund_clawback_amount: number;
  commission_pct: number;
  earnings: number; // computed
  
  // Computed flags
  aging_flag: boolean;
  booking_lag_flag: boolean;
  deposit_unpaid_flag: boolean;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

export interface SetterActivity {
  id: string;
  setter_name: string;
  activity_date: string;
  dials_dms: number;
  conversations: number;
  calls_scheduled: number;
  calls_taken: number;
  declines: number;
  cancels: number;
  no_shows: number;
  created_at: string;
  updated_at: string;
}

export interface RevenueGoal {
  id: string;
  month: string; // YYYY-MM-01
  revenue_goal: number;
  created_at: string;
  updated_at: string;
}

export type ViewType = 'kanban' | 'leadlog' | 'dashboard' | 'projection';

export interface DashboardFilters {
  setter_name?: string;
  closer_name?: string;
  source?: LeadSource;
  date_from?: string;
  date_to?: string;
}

export interface ProjectionAssumptions {
  show_up_rate: number;
  offer_rate: number;
  close_rate: number;
  avg_deal_size: number;
  collection_rate: number;
  best_case_multiplier: number;
  worst_case_multiplier: number;
}

export interface ProjectionResult {
  scheduled_meetings: number;
  projected_shows: number;
  projected_offers: number;
  projected_sales: number;
  projected_revenue: number;
  projected_cash: number;
}

export interface ProjectionScenarios {
  best: ProjectionResult;
  expected: ProjectionResult;
  worst: ProjectionResult;
}

export interface SetterMetrics {
  setter_name: string;
  dials_dms: number;
  conversations: number;
  conversations_to_booked_pct: number;
  speed_to_lead_min: number;
  booking_lag_days: number;
  calls_scheduled: number;
  calls_taken: number;
  declines: number;
  cancels: number;
  no_shows: number;
  show_up_rate: number;
  dq_rate: number;
}

export interface CloserMetrics {
  closer_name: string;
  calls_taken: number;
  offers_made: number;
  offer_rate: number;
  total_sales: number;
  close_rate: number;
  close_rate_on_offers: number;
  one_call_sales: number;
  follow_up_sales: number;
  avg_deal_size: number;
  revenue_per_call: number;
  loss_reasons: Record<LossReason, number>;
}

export interface MoneyMetrics {
  total_deposits: number;
  total_sales: number;
  revenue_generated: number;
  cash_collected: number;
  deposit_to_paid_conversion: number;
  avg_days_to_collect: number;
  total_refunds_clawbacks: number;
  net_revenue: number;
  revenue_goal: number;
  goal_completion_pct: number;
  commissions_by_rep: Record<string, number>;
}

export interface DashboardData {
  setter_metrics: SetterMetrics[];
  closer_metrics: CloserMetrics[];
  money_metrics: MoneyMetrics;
  aging_deals: Lead[];
}