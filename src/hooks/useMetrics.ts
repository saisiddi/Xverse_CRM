import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { queryKeys } from '../lib/queryClient';
import { useLeads } from './useLeads';
import { useSetterActivities } from './useLeads';
import { filterLeads, filterLeadsByDateRange, calculateSetterMetrics, calculateCloserMetrics, calculateMoneyMetrics, calculateProjections, getAgingDeals, getUniqueSetters, getUniqueClosers, getUniqueSources } from '../lib/computations';
import type { DashboardFilters, ProjectionAssumptions, DashboardData, ProjectionScenarios } from '../types';

export function useDashboardData(filters: DashboardFilters) {
  const { data: leads } = useLeads();
  const { data: activities } = useSetterActivities();
  const { data: goals } = useQuery({
    queryKey: queryKeys.revenueGoals,
    queryFn: async () => {
      const { data, error } = await supabase.from('revenue_goals').select('*').order('month', { ascending: false });
      if (error) throw error;
      return data as unknown as Array<{ month: string; revenue_goal: number }>;
    },
  });
  
  const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
  const currentGoal = goals?.find(g => g.month === currentMonth)?.revenue_goal || 0;
  
  return useQuery({
    queryKey: [...queryKeys.dashboard, filters],
    queryFn: () => {
      let filteredLeads = leads || [];
      filteredLeads = filterLeadsByDateRange(filteredLeads, filters.date_from, filters.date_to);
      filteredLeads = filterLeads(filteredLeads, filters);
      
      const setterMetrics = calculateSetterMetrics(filteredLeads, activities || []);
      const closerMetrics = calculateCloserMetrics(filteredLeads);
      const moneyMetrics = calculateMoneyMetrics(filteredLeads, currentGoal);
      const agingDeals = getAgingDeals(filteredLeads);
      
      return {
        setter_metrics: setterMetrics,
        closer_metrics: closerMetrics,
        money_metrics: moneyMetrics,
        aging_deals: agingDeals,
      } as DashboardData;
    },
    enabled: !!leads && !!activities,
  });
}

export function useProjectionData(assumptions: ProjectionAssumptions) {
  const { data: leads } = useLeads();
  const { data: activities } = useSetterActivities();
  
  return useQuery({
    queryKey: [...queryKeys.projection, assumptions],
    queryFn: () => {
      if (!leads) return null;
      
      const filteredLeads = leads.filter(l => 
        l.status === 'Proposal' || 
        l.status === 'Deposit' || 
        l.status === 'Follow-Up Ongoing' || 
        l.status === 'Meeting Follow-Up'
      );
      
      return calculateProjections(filteredLeads, assumptions) as ProjectionScenarios;
    },
    enabled: !!leads && !!activities,
  });
}

export function useFilterOptions() {
  const { data: leads } = useLeads();
  
  return useQuery({
    queryKey: ['filter-options'],
    queryFn: () => ({
      setters: getUniqueSetters(leads || []),
      closers: getUniqueClosers(leads || []),
      sources: getUniqueSources(leads || []),
    }),
    enabled: !!leads,
  });
}

export function useRealtimeSubscription(
  _onLeadChange: any
) {
  return {
    subscribe: () => {},
    unsubscribe: () => {},
  };
}