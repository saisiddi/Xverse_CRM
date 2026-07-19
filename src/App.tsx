import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { useUIStore } from './hooks/useUIStore';
import { useLeads, useCurrentMonthGoal, useUpsertRevenueGoal } from './hooks/useLeads';
import { formatCurrency } from './lib/computations';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { LeadLogTable } from './components/leadlog/LeadLogTable';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProjectionModule } from './components/projection/ProjectionModule';
import { ActivityModal } from './components/activity/ActivityModal';
import { Modal, Input, Label, Button } from './components/ui/BaseComponents';
import { LayoutDashboard, Kanban, Table, TrendingUp, Activity, Menu, X } from 'lucide-react';
import { cn } from './lib/utils';

const NAV_ITEMS = [
  { id: 'kanban', label: 'Kanban', icon: Kanban },
  { id: 'leadlog', label: 'Lead Log', icon: Table },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projection', label: 'Projection', icon: TrendingUp },
] as const;

function TopBar({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
  const { currentView, setCurrentView, setActivityModalOpen } = useUIStore();
  const { data: leads } = useLeads();
  const { data: currentGoal } = useCurrentMonthGoal();
  const upsertGoal = useUpsertRevenueGoal();
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goalValue, setGoalValue] = useState(currentGoal?.revenue_goal || 0);

  useEffect(() => {
    if (currentGoal) setGoalValue(currentGoal.revenue_goal);
  }, [currentGoal]);

  const activeLeads = (leads || []).filter(l => l.status !== 'Won' && l.status !== 'Lost').length;
  const wonLeads = (leads || []).filter(l => l.status === 'Won').length;
  const goalPct = currentGoal?.revenue_goal ? (
    (leads || []).reduce((s, l) => s + (l.status === 'Won' ? l.total_deal_value : 0), 0) / currentGoal.revenue_goal * 100
  ) : 0;

  const handleSaveGoal = async () => {
    const month = new Date().toISOString().slice(0, 7) + '-01';
    await upsertGoal.mutateAsync({ month, revenue_goal: goalValue });
    setGoalModalOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Sales Tracker CRM</h1>

            <nav className="hidden lg:flex items-center gap-1 ml-6">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    currentView === item.id 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 text-sm">
              <span className="text-gray-500">
                <span className="font-medium text-success-600">{activeLeads}</span> active
              </span>
              <span className="text-gray-500">
                <span className="font-medium text-primary-600">{wonLeads}</span> won
              </span>
              <button 
                onClick={() => setGoalModalOpen(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                Goal: <span className="font-medium">{goalPct.toFixed(0)}%</span>
              </button>
            </div>

            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setActivityModalOpen(true)}
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Log Activity</span>
            </Button>

            {/* Mobile Navigation */}
            <nav className="lg:hidden flex items-center gap-2">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    currentView === item.id 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Revenue Goal Modal */}
      <Modal isOpen={goalModalOpen} onClose={() => setGoalModalOpen(false)} title="Set Revenue Goal" size="sm">
        <div className="space-y-4">
          <div>
            <Label htmlFor="goal">Monthly Revenue Goal ($)</Label>
            <Input
              id="goal"
              type="number"
              min="0"
              step="1000"
              value={goalValue}
              onChange={e => setGoalValue(parseFloat(e.target.value) || 0)}
              placeholder="Enter goal amount"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setGoalModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveGoal}>Save Goal</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function ViewContainer() {
  const { currentView } = useUIStore();
  const { data: leads, isLoading, error } = useLeads();
  const { data: currentGoal } = useCurrentMonthGoal();
  const revenueGoal = currentGoal?.revenue_goal || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-danger-600">
        Error loading data. Please check your Supabase connection.
      </div>
    );
  }

  switch (currentView) {
    case 'kanban':
      return <KanbanBoard />;
    case 'leadlog':
      return <LeadLogTable leads={leads} />;
    case 'dashboard':
      return <DashboardView revenueGoal={revenueGoal} />;
    case 'projection':
      return <ProjectionModule revenueGoal={revenueGoal} />;
    default:
      return <KanbanBoard />;
  }
}

function Sidebar() {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Navigation</h2>
          <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as any);
                setSidebarOpen(false);
              }}
              className={cn(
                'flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                currentView === item.id 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

function App() {
  const { activityModalOpen, setActivityModalOpen } = useUIStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-4">
            <ViewContainer />
          </div>
        </main>
      </div>

      {/* Activity Modal */}
      <ActivityModal isOpen={activityModalOpen} onClose={() => setActivityModalOpen(false)} />

      {/* Set sidebar state in store */}
      <GlobalSidebarSync sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </QueryClientProvider>
  );
}

function GlobalSidebarSync({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
  const { sidebarOpen: storeOpen, setSidebarOpen: setStoreOpen } = useUIStore();
  
  useEffect(() => {
    if (storeOpen !== sidebarOpen) {
      setStoreOpen(sidebarOpen);
    }
  }, [sidebarOpen]);
  
  useEffect(() => {
    if (sidebarOpen !== storeOpen) {
      setSidebarOpen(storeOpen);
    }
  }, [storeOpen]);

  return null;
}

export default App;