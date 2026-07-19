import { useState } from 'react';
import { TrendingUp, DollarSign, Target, Calendar, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { useProjectionAssumptions } from '../../hooks/useFilters';
import { useLeads } from '../../hooks/useLeads';
import { calculateProjections } from '../../lib/computations';
import { formatCurrency, formatPercent, formatNumber } from '../../lib/computations';
import { MoneyMetricsPanel } from '../dashboard/DashboardPanels';
import { Card, CardHeader, CardBody, Badge, Button, Input, Label } from '../ui/BaseComponents';
import { cn } from '../../lib/utils';

function ScenarioCard({ 
  title, 
  scenario, 
  color,
  revenueGoal
}: { 
  title: string; 
  scenario: any; 
  color: string;
  revenueGoal: number;
}) {
  return (
    <Card className={cn('border-t-4', color === 'green' ? 'border-t-success-500' : color === 'amber' ? 'border-t-warning-500' : 'border-t-gray-500')}>
      <CardBody className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <Badge variant={color === 'green' ? 'success' : color === 'amber' ? 'warning' : 'gray'}>
            {color === 'green' ? 'Optimistic' : color === 'amber' ? 'Expected' : 'Conservative'}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Projected Revenue</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(scenario.projected_revenue)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Scheduled Meetings</p>
              <p className="text-lg font-semibold">{formatNumber(scenario.scheduled_meetings)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Projected Shows</p>
              <p className="text-lg font-semibold">{formatNumber(scenario.projected_shows)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Projected Offers</p>
              <p className="text-lg font-semibold">{formatNumber(scenario.projected_offers)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Projected Sales</p>
              <p className="text-lg font-semibold">{formatNumber(scenario.projected_sales)}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Projected Cash</p>
            <p className="text-2xl font-bold text-primary-600">{formatCurrency(scenario.projected_cash)}</p>
          </div>

          {revenueGoal > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between text-sm mb-1">
                <span>vs. Revenue Goal</span>
                <span className={cn('font-medium', scenario.projected_revenue >= revenueGoal ? 'text-success-600' : 'text-danger-600')}>
                  {scenario.projected_revenue >= revenueGoal ? '+' : ''}{formatCurrency(scenario.projected_revenue - revenueGoal)}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={cn('h-full rounded-full', scenario.projected_revenue >= revenueGoal ? 'bg-success-500' : 'bg-danger-500')}
                  style={{ width: `${Math.min((scenario.projected_revenue / revenueGoal) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export function ProjectionModule({ revenueGoal }: { revenueGoal: number }) {
  const { assumptions, updateAssumption, resetAssumptions } = useProjectionAssumptions();
  const { data: leads } = useLeads();
  const [showAssumptions, setShowAssumptions] = useState(true);

  const scheduledLeads = (leads || []).filter(l => 
    l.status === 'Proposal' || 
    l.status === 'Deposit' || 
    l.status === 'Follow-Up Ongoing' || 
    l.status === 'Meeting Follow-Up'
  );

  const projections = calculateProjections(scheduledLeads, assumptions);

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <p className="text-sm text-gray-500">Active Pipeline</p>
            <p className="text-2xl font-bold">{formatNumber(scheduledLeads.length)}</p>
            <p className="text-xs text-gray-400">leads in pipeline</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <p className="text-sm text-gray-500">Expected Revenue</p>
            <p className="text-2xl font-bold text-primary-600">{formatCurrency(projections.expected.projected_revenue)}</p>
            <p className="text-xs text-gray-400">end of month forecast</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <p className="text-sm text-gray-500">Best Case</p>
            <p className="text-2xl font-bold text-success-600">{formatCurrency(projections.best.projected_revenue)}</p>
            <p className="text-xs text-gray-400">+{formatPercent(assumptions.best_case_multiplier - 1)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <p className="text-sm text-gray-500">Worst Case</p>
            <p className="text-2xl font-bold text-gray-600">{formatCurrency(projections.worst.projected_revenue)}</p>
            <p className="text-xs text-gray-400">{formatPercent(1 - assumptions.worst_case_multiplier)} downside</p>
          </CardBody>
        </Card>
      </div>

      {/* Assumptions Panel */}
      <Card>
        <CardHeader className="flex items-center justify-between cursor-pointer" onClick={() => setShowAssumptions(!showAssumptions)}>
          <h3 className="font-semibold">Forecast Assumptions</h3>
          {showAssumptions ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </CardHeader>
        {showAssumptions && (
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Show-Up Rate</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={assumptions.show_up_rate}
                    onChange={e => updateAssumption('show_up_rate', parseFloat(e.target.value))}
                  />
                  <span className="text-sm font-medium w-16">{formatPercent(assumptions.show_up_rate)}</span>
                </div>
              </div>
              <div>
                <Label>Offer Rate</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={assumptions.offer_rate}
                    onChange={e => updateAssumption('offer_rate', parseFloat(e.target.value))}
                  />
                  <span className="text-sm font-medium w-16">{formatPercent(assumptions.offer_rate)}</span>
                </div>
              </div>
              <div>
                <Label>Close Rate</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="range"
                    min="0.05"
                    max="1.0"
                    step="0.05"
                    value={assumptions.close_rate}
                    onChange={e => updateAssumption('close_rate', parseFloat(e.target.value))}
                  />
                  <span className="text-sm font-medium w-16">{formatPercent(assumptions.close_rate)}</span>
                </div>
              </div>
              <div>
                <Label>Average Deal Size</Label>
                <Input
                  type="number"
                  min="0"
                  step="100"
                  value={assumptions.avg_deal_size}
                  onChange={e => updateAssumption('avg_deal_size', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Collection Rate</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={assumptions.collection_rate}
                    onChange={e => updateAssumption('collection_rate', parseFloat(e.target.value))}
                  />
                  <span className="text-sm font-medium w-16">{formatPercent(assumptions.collection_rate)}</span>
                </div>
              </div>
              <div>
                <Label>Best Case Multiplier</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="range"
                    min="1.0"
                    max="2.0"
                    step="0.05"
                    value={assumptions.best_case_multiplier}
                    onChange={e => updateAssumption('best_case_multiplier', parseFloat(e.target.value))}
                  />
                  <span className="text-sm font-medium w-16">×{assumptions.best_case_multiplier.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <Label>Worst Case Multiplier</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={assumptions.worst_case_multiplier}
                    onChange={e => updateAssumption('worst_case_multiplier', parseFloat(e.target.value))}
                  />
                  <span className="text-sm font-medium w-16">×{assumptions.worst_case_multiplier.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="ghost" size="sm" onClick={resetAssumptions}>Reset to Defaults</Button>
            </div>
          </CardBody>
        )}
      </Card>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ScenarioCard title="Worst Case" scenario={projections.worst} color="gray" revenueGoal={revenueGoal} />
        <ScenarioCard title="Expected Case" scenario={projections.expected} color="amber" revenueGoal={revenueGoal} />
        <ScenarioCard title="Best Case" scenario={projections.best} color="green" revenueGoal={revenueGoal} />
      </div>
    </div>
  );
}