import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const queryKeys = {
  leads: ['leads'],
  lead: (id: string) => ['leads', id],
  setterActivities: ['setter-activities'],
  setterActivity: (setter: string, date: string) => ['setter-activities', setter, date],
  revenueGoals: ['revenue-goals'],
  revenueGoal: (month: string) => ['revenue-goals', month],
  dashboard: ['dashboard'],
  projection: ['projection'],
};