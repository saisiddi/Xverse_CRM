import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, DollarSign, Users, Target, ArrowUpRight, ArrowDownRight, CalendarDays } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent, formatMinutesToHours, formatDays } from '../../lib/computations';
import type { SetterMetrics, CloserMetrics, MoneyMetrics, DashboardData } from '../../types';
import { Card, CardHeader, CardBody, Badge, Button, Tabs } from '../ui/BaseComponents';
import { cn } from '../../lib/utils';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

function KPICard({ title, value, change, icon: Icon, trend, className }: { 
  title: string; 
  value: string | number; 
  change?: string; 
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}) {
  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardBody className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <p className={cn('text-sm mt-1 flex items-center gap-1', trend === 'up' ? 'text-success-600' : trend === 'down' ? 'text-danger-600' : 'text-gray-500')}>
                {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                {trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                {change}
              </p>
            )}
          </div>
          <div className="p-3 bg-primary-100 rounded-xl text-primary-600">
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function MetricRow({ label, value, subLabel, alert }: { label: string; value: string; subLabel?: string; alert?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {subLabel && <p className="text-xs text-gray-500">{subLabel}</p>}
      </div>
      <p className={cn('text-sm font-semibold', alert ? 'text-danger-600' : 'text-gray-900')}>{value}</p>
    </div>
  );
}

export function SetterMetricsPanel({ data }: { data: SetterMetrics[] }) {
  if (!data.length) return <div className="text-center py-8 text-gray-500">No setter data available</div>;

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Dials/DMs"
          value={formatNumber(data.reduce((s, d) => s + d.dials_dms, 0))}
          icon={Users}
        />
        <KPICard
          title="Conversations"
          value={formatNumber(data.reduce((s, d) => s + d.conversations, 0))}
          icon={Users}
        />
        <KPICard
          title="Calls Scheduled"
          value={formatNumber(data.reduce((s, d) => s + d.calls_scheduled, 0))}
          icon={CalendarDays}
        />
        <KPICard
          title="Show-Up Rate"
          value={formatPercent(data.reduce((s, d) => s + d.show_up_rate, 0) / data.length)}
          icon={Target}
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Setter Performance</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis type="number" tickFormatter={formatNumber} />
              <YAxis dataKey="setter_name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any, name: any) => [formatNumber(Number(value)), name]} />
              <Legend />
              <Bar dataKey="dials_dms" name="Dials/DMs" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="conversations" name="Conversations" fill="#22c55e" radius={[0, 4, 4, 0]} />
              <Bar dataKey="calls_scheduled" name="Calls Scheduled" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Detail Table */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Setter Details</h3>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3">Setter</th>
                  <th className="px-4 py-3">Dials</th>
                  <th className="px-4 py-3">Convos</th>
                  <th className="px-4 py-3">Conv→Booked</th>
                  <th className="px-4 py-3">Speed to Lead</th>
                  <th className="px-4 py-3">Booking Lag</th>
                  <th className="px-4 py-3">Scheduled</th>
                  <th className="px-4 py-3">Taken</th>
                  <th className="px-4 py-3">Show Rate</th>
                  <th className="px-4 py-3">DQ Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map(d => (
                  <tr key={d.setter_name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{d.setter_name}</td>
                    <td className="px-4 py-3">{formatNumber(d.dials_dms)}</td>
                    <td className="px-4 py-3">{formatNumber(d.conversations)}</td>
                    <td className="px-4 py-3">{formatPercent(d.conversations_to_booked_pct)}</td>
                    <td className="px-4 py-3">{formatMinutesToHours(d.speed_to_lead_min)}</td>
                    <td className={cn('px-4 py-3', d.booking_lag_days > 4 ? 'text-danger-600 font-medium' : '')}>
                      {formatDays(d.booking_lag_days)}
                    </td>
                    <td className="px-4 py-3">{formatNumber(d.calls_scheduled)}</td>
                    <td className="px-4 py-3">{formatNumber(d.calls_taken)}</td>
                    <td className={cn('px-4 py-3', d.show_up_rate < 0.7 ? 'text-danger-600 font-medium' : '')}>
                      {formatPercent(d.show_up_rate)}
                    </td>
                    <td className="px-4 py-3">{formatPercent(d.dq_rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export function CloserMetricsPanel({ data }: { data: CloserMetrics[] }) {
  if (!data.length) return <div className="text-center py-8 text-gray-500">No closer data available</div>;

  const totalSales = data.reduce((s, d) => s + d.total_sales, 0);
  const totalCalls = data.reduce((s, d) => s + d.calls_taken, 0);
  const totalOffers = data.reduce((s, d) => s + d.offers_made, 0);

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Calls Taken"
          value={formatNumber(totalCalls)}
          icon={Users}
        />
        <KPICard
          title="Offers Made"
          value={formatNumber(totalOffers)}
          icon={Target}
        />
        <KPICard
          title="Total Sales"
          value={formatNumber(totalSales)}
          icon={DollarSign}
        />
        <KPICard
          title="Offer Rate"
          value={formatPercent(totalCalls > 0 ? totalOffers / totalCalls : 0)}
          icon={Target}
        />
        <KPICard
          title="Close Rate"
          value={formatPercent(totalCalls > 0 ? totalSales / totalCalls : 0)}
          icon={TrendingUp}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Chart */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Sales Funnel</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { stage: 'Calls Taken', value: totalCalls },
                { stage: 'Offers Made', value: totalOffers },
                { stage: 'Sales', value: totalSales },
              ]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" tickFormatter={formatNumber} />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip formatter={(value: any) => [formatNumber(Number(value)), 'Count']} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Loss Reasons Pie */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Loss Reasons</h3>
          </CardHeader>
          <CardBody>
            {(() => {
              const lossData = data.flatMap(d => 
                Object.entries(d.loss_reasons).map(([reason, count]) => ({ reason, count }))
              ).reduce((acc, { reason, count }) => {
                acc[reason] = (acc[reason] || 0) + count;
                return acc;
              }, {} as Record<string, number>);
              
              const pieData = Object.entries(lossData).map(([reason, count]) => ({ reason, count }));
              
              if (pieData.length === 0) {
                return <p className="text-center text-gray-500 py-8">No loss data</p>;
              }
              
              return (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="reason"
                      label={({ reason, percent }: any) => `${reason} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [formatNumber(Number(value)), 'Deals']} />
                  </PieChart>
                </ResponsiveContainer>
              );
            })()}
          </CardBody>
        </Card>
      </div>

      {/* Sales Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Sale Types</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" tickFormatter={formatNumber} />
                <YAxis dataKey="closer_name" type="category" width={100} />
                <Tooltip formatter={(value: any, name: any) => [formatNumber(Number(value)), name]} />
                <Legend />
                <Bar dataKey="one_call_sales" name="1-Call Sales" fill="#22c55e" radius={[0, 4, 4, 0]} />
                <Bar dataKey="follow_up_sales" name="Follow-Up Sales" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Revenue Metrics</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {data.map(d => (
                <div key={d.closer_name} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{d.closer_name}</p>
                  <div className="grid grid-cols-3 gap-2 text-sm mt-2">
                    <div>
                      <p className="text-gray-500">Avg Deal</p>
                      <p className="font-medium">{formatCurrency(d.avg_deal_size)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">RPC</p>
                      <p className="font-medium">{formatCurrency(d.revenue_per_call)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Close on Offers</p>
                      <p className="font-medium">{formatPercent(d.close_rate_on_offers)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Detail Table */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Closer Details</h3>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3">Closer</th>
                  <th className="px-4 py-3">Calls</th>
                  <th className="px-4 py-3">Offers</th>
                  <th className="px-4 py-3">Offer Rate</th>
                  <th className="px-4 py-3">Sales</th>
                  <th className="px-4 py-3">Close Rate</th>
                  <th className="px-4 py-3">Close/Offer</th>
                  <th className="px-4 py-3">1-Call</th>
                  <th className="px-4 py-3">FU Sales</th>
                  <th className="px-4 py-3">Avg Deal</th>
                  <th className="px-4 py-3">RPC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map(d => (
                  <tr key={d.closer_name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{d.closer_name}</td>
                    <td className="px-4 py-3">{formatNumber(d.calls_taken)}</td>
                    <td className="px-4 py-3">{formatNumber(d.offers_made)}</td>
                    <td className={cn('px-4 py-3', d.offer_rate < 0.4 ? 'text-danger-600 font-medium' : '')}>
                      {formatPercent(d.offer_rate)}
                    </td>
                    <td className="px-4 py-3">{formatNumber(d.total_sales)}</td>
                    <td className={cn('px-4 py-3', d.close_rate < 0.2 ? 'text-danger-600 font-medium' : '')}>
                      {formatPercent(d.close_rate)}
                    </td>
                    <td className="px-4 py-3">{formatPercent(d.close_rate_on_offers)}</td>
                    <td className="px-4 py-3">{formatNumber(d.one_call_sales)}</td>
                    <td className="px-4 py-3">{formatNumber(d.follow_up_sales)}</td>
                    <td className="px-4 py-3">{formatCurrency(d.avg_deal_size)}</td>
                    <td className="px-4 py-3">{formatCurrency(d.revenue_per_call)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export function MoneyMetricsPanel({ data }: { data: MoneyMetrics }) {
  const goalPct = data.goal_completion_pct * 100;
  const isBehind = goalPct < 100;

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Deposits"
          value={formatCurrency(data.total_deposits)}
          icon={DollarSign}
        />
        <KPICard
          title="Total Sales"
          value={formatCurrency(data.total_sales)}
          icon={DollarSign}
        />
        <KPICard
          title="Cash Collected"
          value={formatCurrency(data.cash_collected)}
          icon={DollarSign}
          trend={data.cash_collected > data.total_refunds_clawbacks ? 'up' : 'down'}
        />
        <KPICard
          title="Net Revenue"
          value={formatCurrency(data.net_revenue)}
          icon={TrendingUp}
          trend={data.net_revenue > 0 ? 'up' : 'down'}
        />
        <KPICard
          title="Goal Completion"
          value={`${goalPct.toFixed(1)}%`}
          icon={Target}
          trend={isBehind ? 'down' : 'up'}
          className={isBehind ? 'border-danger-200' : ''}
        />
      </div>

      {/* Revenue Waterfall */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Revenue Waterfall</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { stage: 'Deposits', value: data.total_deposits },
              { stage: 'Total Sales', value: data.total_sales },
              { stage: 'Cash Collected', value: data.cash_collected },
              { stage: 'Refunds/Clawbacks', value: -data.total_refunds_clawbacks },
              { stage: 'Net Revenue', value: data.net_revenue },
            ]} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis type="number" tickFormatter={value => formatCurrency(value)} />
              <YAxis dataKey="stage" type="category" width={120} />
              <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Collection Metrics</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <MetricRow label="Deposit → Paid Conversion" value={formatPercent(data.deposit_to_paid_conversion)} />
            <MetricRow label="Avg Days to Collect" value={formatDays(data.avg_days_to_collect)} alert={data.avg_days_to_collect > 30} />
            <MetricRow label="Total Refunds/Clawbacks" value={formatCurrency(data.total_refunds_clawbacks)} alert={data.total_refunds_clawbacks > 0} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Revenue Goal</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{goalPct.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={cn('h-full rounded-full transition-all', isBehind ? 'bg-danger-500' : 'bg-success-500')}
                    style={{ width: `${Math.min(goalPct, 100)}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Goal</p>
                  <p className="font-medium">{formatCurrency(data.revenue_goal)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Remaining</p>
                  <p className={cn('font-medium', isBehind ? 'text-danger-600' : 'text-success-600')}>
                    {formatCurrency(Math.max(0, data.revenue_goal - data.net_revenue))}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Commissions by Rep</h3>
          </CardHeader>
          <CardBody>
            {Object.entries(data.commissions_by_rep).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(data.commissions_by_rep).map(([rep, commission]) => (
                  <div key={rep} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="font-medium">{rep}</span>
                    <span className="text-primary-600 font-semibold">{formatCurrency(commission)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No commission data</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export function AgingTable({ deals }: { deals: any[] }) {
  if (!deals.length) return <div className="text-center py-8 text-gray-500">No aging deals</div>;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h3 className="font-semibold">Follow-Up Aging (7+ days untouched)</h3>
        <Badge variant="danger">{deals.length} deals</Badge>
      </CardHeader>
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3">Lead</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Setter</th>
                <th className="px-4 py-3">Closer</th>
                <th className="px-4 py-3">Last Touch</th>
                <th className="px-4 py-3">Days Stale</th>
                <th className="px-4 py-3">Deal Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deals.map(deal => {
                const lastTouch = deal.last_touch_date ? new Date(deal.last_touch_date) : new Date(deal.date_created);
                const daysStale = Math.floor((Date.now() - lastTouch.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{deal.lead_name}</td>
                    <td className="px-4 py-3">{deal.company || '—'}</td>
                    <td className="px-4 py-3">{deal.setter_name || '—'}</td>
                    <td className="px-4 py-3">{deal.closer_name || '—'}</td>
                    <td className="px-4 py-3 text-danger-600 font-medium">{daysStale}d ago</td>
                    <td className="px-4 py-3 text-danger-600 font-medium">{daysStale}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(deal.total_deal_value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}