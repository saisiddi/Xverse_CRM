import { useState, useEffect } from 'react';
import { useLeads, useUpdateLead, useCreateLead } from '../../hooks/useLeads';
import { useUIStore } from '../../hooks/useUIStore';
import { formatDate, formatDateTime, formatCurrency, getStatusColor, getMeetingStatusColor, getCallTypeColor, getLossReasonColor, getRedFlagLabels } from '../../lib/computations';
import { LEAD_STATUSES, LOSS_REASONS, CALL_TYPES, MEETING_STATUSES, LEAD_SOURCES } from '../../lib/constants';
import type { Lead } from '../../types';
import { Button, Input, Select, Badge, Modal, Label, Card, CardBody } from '../ui/BaseComponents';
import { X, Save, Calendar, DollarSign, Phone, Mail, User, Building2, Tag, AlertTriangle, MoreHorizontal, Trash2, Edit2, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LeadCardModal({ lead, isOpen, onClose, onUpdate }: { lead: Lead | null; isOpen: boolean; onClose: () => void; onUpdate: (id: string, updates: Partial<Lead>) => void }) {
  if (!lead || !isOpen) return null;

  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState<Partial<Lead>>({});

  useEffect(() => {
    if (lead) {
      setValues({
        lead_name: lead.lead_name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        setter_name: lead.setter_name,
        closer_name: lead.closer_name,
        status: lead.status,
        first_contact_date: lead.first_contact_date ? lead.first_contact_date.slice(0, 16) : '',
        date_meeting_booked: lead.date_meeting_booked ? lead.date_meeting_booked.slice(0, 10) : '',
        date_of_meeting: lead.date_of_meeting ? lead.date_of_meeting.slice(0, 10) : '',
        last_touch_date: lead.last_touch_date ? lead.last_touch_date.slice(0, 10) : '',
        meeting_status: lead.meeting_status,
        offer_made: lead.offer_made,
        call_type: lead.call_type,
        loss_reason: lead.loss_reason,
        deposit_amount: lead.deposit_amount,
        total_deal_value: lead.total_deal_value,
        cash_collected: lead.cash_collected,
        date_paid_in_full: lead.date_paid_in_full ? lead.date_paid_in_full.slice(0, 10) : '',
        refund_clawback_amount: lead.refund_clawback_amount,
        commission_pct: lead.commission_pct,
      });
    }
  }, [lead]);

  const handleSave = (field: keyof Lead, value: any) => {
    const updates: Partial<Lead> = { [field]: value };
    onUpdate(lead.id, updates);
    setEditMode(prev => ({ ...prev, [field]: false }));
  };

  const redFlags = getRedFlagLabels(lead);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lead.lead_name} size="lg">
      <div className="space-y-6">
        {/* Header with status and red flags */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className={cn('px-3 py-1 text-sm font-medium rounded-full border', getStatusColor(lead.status))}>
            {lead.status}
          </span>
          {redFlags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {redFlags.map(flag => (
                <Badge key={flag} variant="danger" className="animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {flag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Contact Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 border-b pb-2">Contact Information</h4>
            
            <div>
              <Label htmlFor="lead_name">Lead Name *</Label>
              <Input
                id="lead_name"
                value={values.lead_name || ''}
                onChange={e => setValues(prev => ({ ...prev, lead_name: e.target.value }))}
                onBlur={e => handleSave('lead_name', e.target.value)}
                placeholder="Enter lead name"
              />
            </div>
            
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={values.company || ''}
                onChange={e => setValues(prev => ({ ...prev, company: e.target.value }))}
                onBlur={e => handleSave('company', e.target.value)}
                placeholder="Company name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={values.email || ''}
                onChange={e => setValues(prev => ({ ...prev, email: e.target.value }))}
                onBlur={e => handleSave('email', e.target.value)}
                placeholder="email@company.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={values.phone || ''}
                onChange={e => setValues(prev => ({ ...prev, phone: e.target.value }))}
                onBlur={e => handleSave('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="source">Source</Label>
              <Select
                id="source"
                value={values.source || ''}
                onChange={e => setValues(prev => ({ ...prev, source: e.target.value as any }))}
                onBlur={e => handleSave('source', e.target.value as any)}
              >
                {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>

            <div>
              <Label htmlFor="setter_name">Setter</Label>
              <Input
                id="setter_name"
                value={values.setter_name || ''}
                onChange={e => setValues(prev => ({ ...prev, setter_name: e.target.value }))}
                onBlur={e => handleSave('setter_name', e.target.value)}
                placeholder="Setter name"
              />
            </div>

            <div>
              <Label htmlFor="closer_name">Closer</Label>
              <Input
                id="closer_name"
                value={values.closer_name || ''}
                onChange={e => setValues(prev => ({ ...prev, closer_name: e.target.value }))}
                onBlur={e => handleSave('closer_name', e.target.value)}
                placeholder="Closer name"
              />
            </div>
          </div>

          {/* Dates & Status Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 border-b pb-2">Dates & Status</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Created</Label>
                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{formatDateTime(lead.date_created)}</div>
              </div>
              <div>
                <Label>First Contact</Label>
                <Input
                  type="datetime-local"
                  value={values.first_contact_date || ''}
                  onChange={e => setValues(prev => ({ ...prev, first_contact_date: e.target.value }))}
                  onBlur={e => handleSave('first_contact_date', e.target.value ? new Date(e.target.value).toISOString() : '')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Meeting Booked</Label>
                <Input
                  type="date"
                  value={values.date_meeting_booked || ''}
                  onChange={e => setValues(prev => ({ ...prev, date_meeting_booked: e.target.value }))}
                  onBlur={e => handleSave('date_meeting_booked', e.target.value)}
                />
              </div>
              <div>
                <Label>Meeting Date</Label>
                <Input
                  type="date"
                  value={values.date_of_meeting || ''}
                  onChange={e => setValues(prev => ({ ...prev, date_of_meeting: e.target.value }))}
                  onBlur={e => handleSave('date_of_meeting', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Last Touch</Label>
              <Input
                type="date"
                value={values.last_touch_date || ''}
                onChange={e => setValues(prev => ({ ...prev, last_touch_date: e.target.value }))}
                onBlur={e => handleSave('last_touch_date', e.target.value)}
              />
            </div>

            <div>
              <Label>Meeting Status</Label>
              <Select
                value={values.meeting_status || ''}
                onChange={e => setValues(prev => ({ ...prev, meeting_status: e.target.value as any }))}
                onBlur={e => handleSave('meeting_status', e.target.value as any)}
              >
                <option value="">Select status</option>
                {MEETING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>

            <div className="flex gap-3">
              <Label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.offer_made || false}
                  onChange={e => setValues(prev => ({ ...prev, offer_made: e.target.checked }))}
                  onBlur={e => handleSave('offer_made', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Offer Made
              </Label>
            </div>

            <div>
              <Label>Call Type</Label>
              <Select
                value={values.call_type || ''}
                onChange={e => setValues(prev => ({ ...prev, call_type: e.target.value as any }))}
                onBlur={e => handleSave('call_type', e.target.value as any)}
              >
                <option value="">Select type</option>
                {CALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </div>

            <div>
              <Label>Loss Reason</Label>
              <Select
                value={values.loss_reason || ''}
                onChange={e => setValues(prev => ({ ...prev, loss_reason: e.target.value as any }))}
                onBlur={e => handleSave('loss_reason', e.target.value as any)}
                disabled={lead.status !== 'Lost'}
              >
                <option value="">Select reason</option>
                {LOSS_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
              {lead.status === 'Lost' && !values.loss_reason && (
                <p className="text-xs text-danger-600 mt-1">Required for Lost leads</p>
              )}
            </div>
          </div>
        </div>

        {/* Money Section */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Financial Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="deposit_amount">Deposit Amount</Label>
              <Input
                id="deposit_amount"
                type="number"
                step="0.01"
                min="0"
                value={values.deposit_amount || 0}
                onChange={e => setValues(prev => ({ ...prev, deposit_amount: parseFloat(e.target.value) || 0 }))}
                onBlur={e => handleSave('deposit_amount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="total_deal_value">Total Deal Value</Label>
              <Input
                id="total_deal_value"
                type="number"
                step="0.01"
                min="0"
                value={values.total_deal_value || 0}
                onChange={e => setValues(prev => ({ ...prev, total_deal_value: parseFloat(e.target.value) || 0 }))}
                onBlur={e => handleSave('total_deal_value', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="cash_collected">Cash Collected</Label>
              <Input
                id="cash_collected"
                type="number"
                step="0.01"
                min="0"
                value={values.cash_collected || 0}
                onChange={e => setValues(prev => ({ ...prev, cash_collected: parseFloat(e.target.value) || 0 }))}
                onBlur={e => handleSave('cash_collected', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="refund_clawback_amount">Refund/Clawback</Label>
              <Input
                id="refund_clawback_amount"
                type="number"
                step="0.01"
                min="0"
                value={values.refund_clawback_amount || 0}
                onChange={e => setValues(prev => ({ ...prev, refund_clawback_amount: parseFloat(e.target.value) || 0 }))}
                onBlur={e => handleSave('refund_clawback_amount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="commission_pct">Commission %</Label>
              <Input
                id="commission_pct"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={values.commission_pct || 0}
                onChange={e => setValues(prev => ({ ...prev, commission_pct: parseFloat(e.target.value) || 0 }))}
                onBlur={e => handleSave('commission_pct', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="date_paid_in_full">Date Paid in Full</Label>
              <Input
                id="date_paid_in_full"
                type="date"
                value={values.date_paid_in_full || ''}
                onChange={e => setValues(prev => ({ ...prev, date_paid_in_full: e.target.value }))}
                onBlur={e => handleSave('date_paid_in_full', e.target.value)}
              />
            </div>
          </div>

          {/* Computed Earnings Display */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Computed Earnings</span>
              <span className="text-lg font-bold text-primary-600">
                {formatCurrency((lead.total_deal_value - lead.refund_clawback_amount) * (lead.commission_pct / 100))}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">(Total Deal Value - Refunds) × Commission %</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function AddLeadModal({ isOpen, onClose, onCreate }: { isOpen: boolean; onClose: () => void; onCreate: (lead: any) => void }) {
  const [formData, setFormData] = useState({
    lead_name: '',
    company: '',
    email: '',
    phone: '',
    source: 'Cold Call',
    setter_name: '',
    closer_name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lead_name.trim()) return;
    
    onCreate({
      ...formData,
      status: 'New',
      date_created: new Date().toISOString(),
      deposit_amount: 0,
      total_deal_value: 0,
      cash_collected: 0,
      refund_clawback_amount: 0,
      commission_pct: 0,
      offer_made: false,
    });
    onClose();
    setFormData({
      lead_name: '',
      company: '',
      email: '',
      phone: '',
      source: 'Cold Call',
      setter_name: '',
      closer_name: '',
    });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={true} onClose={onClose} title="Add New Lead" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="lead_name">Lead Name *</Label>
          <Input
            id="lead_name"
            value={formData.lead_name}
            onChange={e => setFormData(prev => ({ ...prev, lead_name: e.target.value }))}
            placeholder="Enter lead name"
            required
            autoFocus
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Company name"
            />
          </div>
          <div>
            <Label htmlFor="source">Source</Label>
            <Select
              id="source"
              value={formData.source}
              onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))}
            >
              {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@company.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="setter_name">Setter</Label>
            <Input
              id="setter_name"
              value={formData.setter_name}
              onChange={e => setFormData(prev => ({ ...prev, setter_name: e.target.value }))}
              placeholder="Setter name"
            />
          </div>
          <div>
            <Label htmlFor="closer_name">Closer</Label>
            <Input
              id="closer_name"
              value={formData.closer_name}
              onChange={e => setFormData(prev => ({ ...prev, closer_name: e.target.value }))}
              placeholder="Closer name"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Create Lead</Button>
        </div>
      </form>
    </Modal>
  );
}