import { create } from 'zustand';
import type { ViewType } from '../types';

interface UIState {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileView: boolean;
  setMobileView: (mobile: boolean) => void;
  activityModalOpen: boolean;
  setActivityModalOpen: (open: boolean) => void;
  leadModalOpen: string | null;
  setLeadModalOpen: (id: string | null) => void;
  projectionModalOpen: boolean;
  setProjectionModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentView: 'kanban',
  setCurrentView: (view) => set({ currentView: view }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  mobileView: false,
  setMobileView: (mobile) => set({ mobileView: mobile }),
  activityModalOpen: false,
  setActivityModalOpen: (open) => set({ activityModalOpen: open }),
  leadModalOpen: null,
  setLeadModalOpen: (id) => set({ leadModalOpen: id }),
  projectionModalOpen: false,
  setProjectionModalOpen: (open) => set({ projectionModalOpen: open }),
}));