import { useState, useCallback } from 'react';
import type { DashboardFilters, ProjectionAssumptions } from '../types';
import { DEFAULT_PROJECTION_ASSUMPTIONS } from '../lib/constants';

export function useProjectionAssumptions() {
  const [assumptions, setAssumptions] = useState<ProjectionAssumptions>(() => {
    const stored = localStorage.getItem('projection-assumptions');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_PROJECTION_ASSUMPTIONS;
      }
    }
    return DEFAULT_PROJECTION_ASSUMPTIONS;
  });
  
  const updateAssumption = useCallback(<K extends keyof ProjectionAssumptions>(key: K, value: ProjectionAssumptions[K]) => {
    setAssumptions(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('projection-assumptions', JSON.stringify(next));
      return next;
    });
  }, []);
  
  const resetAssumptions = useCallback(() => {
    setAssumptions(DEFAULT_PROJECTION_ASSUMPTIONS);
    localStorage.setItem('projection-assumptions', JSON.stringify(DEFAULT_PROJECTION_ASSUMPTIONS));
  }, []);
  
  return { assumptions, updateAssumption, resetAssumptions };
}

export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilters>({
    date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
  });
  
  const updateFilter = useCallback(<K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const resetFilters = useCallback(() => {
    setFilters({
      date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      date_to: new Date().toISOString().split('T')[0],
    });
  }, []);
  
  return { filters, updateFilter, resetFilters };
}