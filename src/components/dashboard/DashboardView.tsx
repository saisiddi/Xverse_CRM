import { useState, useMemo } from 'react';
import { BarChart2, Users, DollarSign, AlertTriangle, RefreshCw, Filter, Calendar } from 'lucide-react';
import { useLeads, useSetterActivities } from '../../hooks/useLeads';
import { useDashboardFilters } from '../../hooks/useFilters';
import { useFilterOptions } from '../../hooks/useMetrics';
import { calculateSetterMetrics, calculateCloserMetrics, calculateMoneyMetrics, getAgingDeals, filterLeads, filterLeadsByDateRange, getUniqueSetters, getUniqueClosers, getUniqueSources } from '../../lib/computations';
import { SetterMetricsPanel, CloserMetricsPanel, MoneyMetricsPanel, AgingTable } from './DashboardPanels';
import { Tabs, Card, CardBody, CardHeader, Badge, Button, Select, Input, Label } from '../ui/BaseComponents';
import { cn } from '../../lib/utils';

const dashboardTabs = [
  { id: 'setter', label: 'Setter Metrics' },
  { id: 'closer', label: 'Closer Metrics' },
  { id: 'money', label: 'Money Metrics' },
  { id: 'aging', label: 'Aging Pipeline' },
];

export function DashboardView({ revenueGoal }: { revenueGoal: number }) {
  const { data: leads, isLoading, refetch } = useLeads();
  const { data: activities } = useSetterActivities();
  const { filters, updateFilter, resetFilters } = useDashboardFilters();
  const filterOptions = useFilterOptions();
  const [activeTab, setActiveTab] = useState('setter');

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    let result = filterLeadsByDateRange(leads, filters.date_from, filters.date_to);
    result = filterLeads(result, filters);
    return result;
  }, [leads, filters]);

  const setterMetrics = useMemo(() => 
    calculateSetterMetrics(filteredLeads, activities || []),
    [filteredLeads, activities]
  );

  const closerMetrics = useMemo(() => 
    calculateCloserMetrics(filteredLeads),
    [filteredLeads]
  );

  const moneyMetrics = useMemo(() => 
    calculateMoneyMetrics(filteredLeads, revenueGoal),
    [filteredLeads, revenueGoal]
  );

  const agingDeals = useMemo(() => 
    getAgingDeals(filteredLeads),
    [filteredLeads]
  );

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-end">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 flex-1">
              <div>
                <Label>Setter</Label>
                <Select 
                  value={filters.setter_name || ''} 
                  onChange={e => updateFilter('setter_name', e.target.value || undefined)}
                >
                  <option value="">All Setters</option>
                  {(filterOptions.data?.setters || []).map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div>
                <Label>Closer</Label>
                <Select 
                  value={filters.closer_name || ''} 
                  onChange={e => updateFilter('closer_name', e.target.value || undefined)}
                >
                  <option value="">All Closers</option>
                  {(filterOptions.data?.closers || []).map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div>
                <Label>Source</Label>
                <Select 
                  value={filters.source || ''} 
                  onChange={e => updateFilter('source', (e.target.value || undefined) as any)}
                >
                  <option value="">All Sources</option>
                  {(filterOptions.data?.sources || []).map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div>
                <Label>From</Label>
                <Input 
                  type="date" 
                  value={filters.date_from || ''} 
                  onChange={e => updateFilter('date_from', e.target.value)}
                />
              </div>
              <div>
                <Label>To</Label>
                <Input 
                  type="date" 
                  value={filters.date_to || ''} 
                  onChange={e => updateFilter('date_to', e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                <Button variant="ghost" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs tabs={dashboardTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'setter' && <SetterMetricsPanel data={setterMetrics} />}
        {activeTab === 'closer' && <CloserMetricsPanel data={closerMetrics} />}
        {activeTab === 'money' && <MoneyMetricsPanel data={moneyMetrics} />}
        {activeTab === 'aging' && (
          <div className="space-y-4">
            <AgingTable deals={agingDeals} />
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      )}
    </div>
  );
}