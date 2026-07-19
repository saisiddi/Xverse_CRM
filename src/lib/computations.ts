import { format, parseISO, differenceInMinutes, differenceInDays, isValid, addDays } from 'date-fns';
import type { Lead, SetterActivity, DashboardFilters, SetterMetrics, CloserMetrics, MoneyMetrics, ProjectionAssumptions, ProjectionScenarios, ProjectionResult } from '../types';
import { LOSS_REASONS } from './constants';

export function formatDate(dateStr: string | undefined | null, fmt?: string): string {
  const fmt2 = fmt || 'MMM d, yyyy';
  if (!dateStr) return '—';
  try {
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, fmt2) : '—';
  } catch {
    return '—';
  }
}

export function formatDateOnly(dateStr: string | undefined | null): string {
  return formatDate(dateStr, 'yyyy-MM-dd');
}

export function formatDateTime(dateStr: string | undefined | null): string {
  return formatDate(dateStr, 'MMM d, yyyy h:mm a');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatPercentWhole(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatMinutesToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function formatDays(days: number): string {
  return `${days.toFixed(1)}d`;
}

export function filterLeads(leads: Lead[], filters: DashboardFilters): Lead[] {
  return leads.filter(lead => {
    if (filters.setter_name && lead.setter_name !== filters.setter_name) return false;
    if (filters.closer_name && lead.closer_name !== filters.closer_name) return false;
    if (filters.source && lead.source !== filters.source) return false;
    return true;
  });
}

export function filterLeadsByDateRange(leads: Lead[], dateFrom?: string, dateTo?: string): Lead[] {
  if (!dateFrom && !dateTo) return leads;
  
  return leads.filter(lead => {
    const created = lead.date_created ? parseISO(lead.date_created) : null;
    if (!created) return false;
    
    if (dateFrom) {
      const from = parseISO(dateFrom);
      if (created < from) return false;
    }
    if (dateTo) {
      const to = addDays(parseISO(dateTo), 1); // Include end date
      if (created >= to) return false;
    }
    return true;
  });
}

export function calculateSetterMetrics(leads: Lead[], activities: SetterActivity[]): SetterMetrics[] {
  const setterMap = new Map<string, SetterMetrics>();
  
  // Initialize from activities
  activities.forEach(activity => {
    const existing = setterMap.get(activity.setter_name) || {
      setter_name: activity.setter_name,
      dials_dms: 0,
      conversations: 0,
      conversations_to_booked_pct: 0,
      speed_to_lead_min: 0,
      booking_lag_days: 0,
      calls_scheduled: 0,
      calls_taken: 0,
      declines: 0,
      cancels: 0,
      no_shows: 0,
      show_up_rate: 0,
      dq_rate: 0,
    };
    
    existing.dials_dms += activity.dials_dms;
    existing.conversations += activity.conversations;
    existing.calls_scheduled += activity.calls_scheduled;
    existing.calls_taken += activity.calls_taken;
    existing.declines += activity.declines;
    existing.cancels += activity.cancels;
    existing.no_shows += activity.no_shows;
    
    setterMap.set(activity.setter_name, existing);
  });
  
  // Calculate from leads
  const setterLeads = new Map<string, Lead[]>();
  leads.forEach(lead => {
    if (lead.setter_name) {
      const arr = setterLeads.get(lead.setter_name) || [];
      arr.push(lead);
      setterLeads.set(lead.setter_name, arr);
    }
  });
  
  setterLeads.forEach((setterLeadsArr, setterName) => {
    const metrics = setterMap.get(setterName) || {
      setter_name: setterName,
      dials_dms: 0,
      conversations: 0,
      conversations_to_booked_pct: 0,
      speed_to_lead_min: 0,
      booking_lag_days: 0,
      calls_scheduled: 0,
      calls_taken: 0,
      declines: 0,
      cancels: 0,
      no_shows: 0,
      show_up_rate: 0,
      dq_rate: 0,
    };
    
    // Speed to lead
    const speedToLeadLeads = setterLeadsArr.filter(l => l.first_contact_date);
    if (speedToLeadLeads.length > 0) {
      const totalMinutes = speedToLeadLeads.reduce((sum, l) => {
        const created = parseISO(l.date_created);
        const contacted = parseISO(l.first_contact_date!);
        return sum + differenceInMinutes(contacted, created);
      }, 0);
      metrics.speed_to_lead_min = Math.round(totalMinutes / speedToLeadLeads.length);
    }
    
    // Booking lag
    const bookedLeads = setterLeadsArr.filter(l => l.date_meeting_booked && l.date_of_meeting);
    if (bookedLeads.length > 0) {
      const totalDays = bookedLeads.reduce((sum, l) => {
        const booked = parseISO(l.date_meeting_booked!);
        const meeting = parseISO(l.date_of_meeting!);
        return sum + differenceInDays(meeting, booked);
      }, 0);
      metrics.booking_lag_days = totalDays / bookedLeads.length;
    }
    
    // DQ rate
    const meetingsSet = setterLeadsArr.filter(l => l.status !== 'New');
    const dqLeads = setterLeadsArr.filter(l => l.meeting_status === 'DQ');
    metrics.dq_rate = meetingsSet.length > 0 ? dqLeads.length / meetingsSet.length : 0;
    
    // Show up rate
    const shows = setterLeadsArr.filter(l => l.meeting_status === 'Show').length;
    const scheduled = setterLeadsArr.filter(l => l.meeting_status).length;
    metrics.show_up_rate = scheduled > 0 ? shows / scheduled : 0;
    
    setterMap.set(setterName, metrics);
  });
  
  // Calculate derived metrics
  setterMap.forEach(metrics => {
    metrics.conversations_to_booked_pct = metrics.conversations > 0 
      ? metrics.calls_scheduled / metrics.conversations 
      : 0;
    
    const totalCalls = metrics.calls_taken + metrics.no_shows + metrics.cancels;
    metrics.show_up_rate = totalCalls > 0 ? metrics.calls_taken / totalCalls : 0;
  });
  
  return Array.from(setterMap.values()).sort((a, b) => a.setter_name.localeCompare(b.setter_name));
}

export function calculateCloserMetrics(leads: Lead[]): CloserMetrics[] {
  const closerMap = new Map<string, CloserMetrics>();
  
  const closerLeads = new Map<string, Lead[]>();
  leads.forEach(lead => {
    if (lead.closer_name) {
      const arr = closerLeads.get(lead.closer_name) || [];
      arr.push(lead);
      closerLeads.set(lead.closer_name, arr);
    }
  });
  
  closerLeads.forEach((leadsArr, closerName) => {
    const taken = leadsArr.filter(l => l.meeting_status === 'Show');
    const offers = leadsArr.filter(l => l.offer_made);
    const sales = leadsArr.filter(l => l.status === 'Won');
    const oneCallSales = sales.filter(l => l.call_type === '1-Call Sale');
    const followUpSales = sales.filter(l => l.call_type === 'Follow-Up Sale');
    
    const lossReasons: Record<string, number> = {};
    LOSS_REASONS.forEach(r => lossReasons[r] = 0);
    leadsArr.filter(l => l.loss_reason).forEach(l => {
      if (l.loss_reason) lossReasons[l.loss_reason]++;
    });
    
    const totalDealValue = sales.reduce((sum, l) => sum + l.total_deal_value, 0);
    
    closerMap.set(closerName, {
      closer_name: closerName,
      calls_taken: taken.length,
      offers_made: offers.length,
      offer_rate: taken.length > 0 ? offers.length / taken.length : 0,
      total_sales: sales.length,
      close_rate: taken.length > 0 ? sales.length / taken.length : 0,
      close_rate_on_offers: offers.length > 0 ? sales.length / offers.length : 0,
      one_call_sales: oneCallSales.length,
      follow_up_sales: followUpSales.length,
      avg_deal_size: sales.length > 0 ? totalDealValue / sales.length : 0,
      revenue_per_call: taken.length > 0 ? totalDealValue / taken.length : 0,
      loss_reasons: lossReasons as CloserMetrics['loss_reasons'],
    });
  });
  
  return Array.from(closerMap.values()).sort((a, b) => a.closer_name.localeCompare(b.closer_name));
}

export function calculateMoneyMetrics(leads: Lead[], revenueGoal: number): MoneyMetrics {
  const wonLeads = leads.filter(l => l.status === 'Won');
  const depositLeads = leads.filter(l => l.deposit_amount > 0);
  const paidInFullLeads = wonLeads.filter(l => l.date_paid_in_full);
  
  const totalDeposits = leads.reduce((sum, l) => sum + l.deposit_amount, 0);
  const totalSales = wonLeads.reduce((sum, l) => sum + l.total_deal_value, 0);
  const revenueGenerated = totalSales;
  const cashCollected = leads.reduce((sum, l) => sum + l.cash_collected, 0);
  const totalRefunds = leads.reduce((sum, l) => sum + l.refund_clawback_amount, 0);
  const netRevenue = revenueGenerated - totalRefunds;
  
  const depositToPaidConversion = depositLeads.length > 0 
    ? paidInFullLeads.length / depositLeads.length 
    : 0;
  
  const avgDaysToCollect = paidInFullLeads.length > 0
    ? paidInFullLeads.reduce((sum, l) => {
        const created = parseISO(l.date_created);
        const paid = parseISO(l.date_paid_in_full!);
        return sum + differenceInDays(paid, created);
      }, 0) / paidInFullLeads.length
    : 0;
  
  const goalCompletionPct = revenueGoal > 0 ? netRevenue / revenueGoal : 0;
  
  // Commissions by rep
  const commissionsByRep: Record<string, number> = {};
  leads.forEach(l => {
    if (l.closer_name) {
      commissionsByRep[l.closer_name] = (commissionsByRep[l.closer_name] || 0) + l.earnings;
    }
  });
  
  return {
    total_deposits: totalDeposits,
    total_sales: totalSales,
    revenue_generated: revenueGenerated,
    cash_collected: cashCollected,
    deposit_to_paid_conversion: depositToPaidConversion,
    avg_days_to_collect: avgDaysToCollect,
    total_refunds_clawbacks: totalRefunds,
    net_revenue: netRevenue,
    revenue_goal: revenueGoal,
    goal_completion_pct: goalCompletionPct,
    commissions_by_rep: commissionsByRep,
  };
}

export function getAgingDeals(leads: Lead[]): Lead[] {
  return leads
    .filter(l => l.status === 'Follow-Up Ongoing' && l.aging_flag)
    .sort((a, b) => (a.last_touch_date || '').localeCompare(b.last_touch_date || ''));
}

export function getUniqueSetters(leads: Lead[]): string[] {
  const setters = new Set<string>();
  leads.forEach(l => {
    if (l.setter_name) setters.add(l.setter_name);
  });
  return Array.from(setters).sort();
}

export function getUniqueClosers(leads: Lead[]): string[] {
  const closers = new Set<string>();
  leads.forEach(l => {
    if (l.closer_name) closers.add(l.closer_name);
  });
  return Array.from(closers).sort();
}

export function getUniqueSources(leads: Lead[]): string[] {
  const sources = new Set<string>();
  leads.forEach(l => {
    if (l.source) sources.add(l.source);
  });
  return Array.from(sources).sort();
}

function calculateProjection(leads: Lead[], assumptions: ProjectionAssumptions, multiplier: number): ProjectionResult {
  const scheduledMeetings = leads.filter(l => 
    l.status === 'Proposal' || 
    l.status === 'Deposit' || 
    l.status === 'Follow-Up Ongoing' || 
    l.status === 'Meeting Follow-Up'
  ).length;
  
  const projectedShows = scheduledMeetings * assumptions.show_up_rate * multiplier;
  const projectedOffers = projectedShows * assumptions.offer_rate;
  const projectedSales = projectedOffers * assumptions.close_rate;
  const projectedRevenue = projectedSales * assumptions.avg_deal_size;
  const projectedCash = projectedRevenue * assumptions.collection_rate;
  
  return {
    scheduled_meetings: scheduledMeetings,
    projected_shows: Math.round(projectedShows),
    projected_offers: Math.round(projectedOffers),
    projected_sales: Math.round(projectedSales),
    projected_revenue: Math.round(projectedRevenue),
    projected_cash: Math.round(projectedCash),
  };
}

export function calculateProjections(leads: Lead[], assumptions: ProjectionAssumptions): ProjectionScenarios {
  return {
    best: calculateProjection(leads, assumptions, assumptions.best_case_multiplier),
    expected: calculateProjection(leads, assumptions, 1),
    worst: calculateProjection(leads, assumptions, assumptions.worst_case_multiplier),
  };
}

export function isRedFlag(lead: Lead): { flag: string; message: string }[] {
  const flags: { flag: string; message: string }[] = [];
  
  if (lead.booking_lag_flag) {
    flags.push({ flag: 'booking_lag', message: 'Booking lag > 4 days' });
  }
  if (lead.aging_flag) {
    flags.push({ flag: 'aging', message: 'Follow-up aging 7+ days' });
  }
  if (lead.deposit_unpaid_flag) {
    flags.push({ flag: 'deposit_unpaid', message: 'Deposit unpaid 14+ days' });
  }
  
  return flags;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'New': 'bg-primary-100 text-primary-800 border-primary-200',
    'Proposal': 'bg-warning-100 text-warning-800 border-warning-200',
    'Deposit': 'bg-primary-100 text-primary-800 border-primary-200',
    'Follow-Up Ongoing': 'bg-warning-100 text-warning-800 border-warning-200',
    'Meeting Follow-Up': 'bg-primary-100 text-primary-800 border-primary-200',
    'Won': 'bg-success-100 text-success-800 border-success-200',
    'Lost': 'bg-danger-100 text-danger-800 border-danger-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function getMeetingStatusColor(status: string | undefined): string {
  if (!status) return 'bg-gray-100 text-gray-800';
  const colors: Record<string, string> = {
    'Show': 'bg-success-100 text-success-800',
    'No-Show': 'bg-danger-100 text-danger-800',
    'Rescheduled By Us': 'bg-warning-100 text-warning-800',
    'Rescheduled By Them': 'bg-warning-100 text-warning-800',
    'Cancel': 'bg-gray-100 text-gray-800',
    'DQ': 'bg-danger-100 text-danger-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getCallTypeColor(type: string | undefined): string {
  if (!type) return 'bg-gray-100 text-gray-800';
  return type === '1-Call Sale' ? 'bg-success-100 text-success-800' : 'bg-primary-100 text-primary-800';
}

export function getLossReasonColor(reason: string | undefined): string {
  if (!reason) return 'bg-gray-100 text-gray-800';
  const colors: Record<string, string> = {
    'Price': 'bg-warning-100 text-warning-800',
    'Timing': 'bg-primary-100 text-primary-800',
    'Partner-Spouse': 'bg-purple-100 text-purple-800',
    'Competitor': 'bg-danger-100 text-danger-800',
    'Ghosted': 'bg-gray-100 text-gray-800',
    'Not Qualified': 'bg-gray-100 text-gray-800',
  };
  return colors[reason] || 'bg-gray-100 text-gray-800';
}

export function getRedFlagLabels(lead: Lead): string[] {
  const labels: string[] = [];
  if (lead.aging_flag) labels.push('Aging 7d+');
  if (lead.booking_lag_flag) labels.push('Booking Lag >4d');
  if (lead.deposit_unpaid_flag) labels.push('Deposit 14d+');
  return labels;
}