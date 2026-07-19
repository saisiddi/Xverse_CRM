import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { queryKeys } from '../lib/queryClient';
import type { Lead, SetterActivity, RevenueGoal } from '../types';
import { formatDateOnly } from '../lib/computations';

export function useLeads() {
  return useQuery({
    queryKey: queryKeys.leads,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('date_created', { ascending: false });
      
      if (error) throw error;
      return data as unknown as Lead[];
    },
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: queryKeys.lead(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as unknown as Lead;
    },
    enabled: !!id,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lead: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from('leads')
        .insert([lead as never])
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as Lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Record<string, unknown> & { id: string }) => {
      const { data, error } = await supabase
        .from('leads')
        .update({ ...updates, updated_at: new Date().toISOString() } as never)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as Lead;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.lead((data as Lead).id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: queryKeys.lead(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
    },
  });
}

export function useSetterActivities() {
  return useQuery({
    queryKey: queryKeys.setterActivities,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('setter_activities')
        .select('*')
        .order('activity_date', { ascending: false });
      
      if (error) throw error;
      return data as unknown as SetterActivity[];
    },
  });
}

export function useSetterActivity(setterName: string, date: string) {
  return useQuery({
    queryKey: queryKeys.setterActivity(setterName, date),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('setter_activities')
        .select('*')
        .eq('setter_name', setterName)
        .eq('activity_date', date)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as unknown as SetterActivity | null;
    },
    enabled: !!setterName && !!date,
  });
}

export function useUpsertSetterActivity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activity: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from('setter_activities')
        .upsert([{ ...activity, updated_at: new Date().toISOString() } as never], {
          onConflict: 'setter_name,activity_date',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as SetterActivity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.setterActivities });
    },
  });
}

export function useRevenueGoals() {
  return useQuery({
    queryKey: queryKeys.revenueGoals,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenue_goals')
        .select('*')
        .order('month', { ascending: false });
      
      if (error) throw error;
      return data as unknown as RevenueGoal[];
    },
  });
}

export function useRevenueGoal(month: string) {
  return useQuery({
    queryKey: queryKeys.revenueGoal(month),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenue_goals')
        .select('*')
        .eq('month', month)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as unknown as RevenueGoal | null;
    },
    enabled: !!month,
  });
}

export function useUpsertRevenueGoal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (goal: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from('revenue_goals')
        .upsert([{ ...goal, updated_at: new Date().toISOString() } as never], {
          onConflict: 'month',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as RevenueGoal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.revenueGoals });
    },
  });
}

export function useCurrentMonthGoal() {
  const currentMonth = formatDateOnly(new Date().toISOString().slice(0, 10));
  return useRevenueGoal(currentMonth);
}