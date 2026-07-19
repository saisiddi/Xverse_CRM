'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, AlertCircle, AlertTriangle, Calendar, DollarSign, Phone, Mail, User, Building2, Tag, ArrowRight, ChevronDown, ChevronUp, MoreHorizontal, Plus, Trash2, Edit2, X } from 'lucide-react';
import { useLeads, useUpdateLead, useCreateLead } from '../../hooks/useLeads';
import { useUIStore } from '../../hooks/useUIStore';
import { formatDate, formatDateTime, formatCurrency, getRedFlagLabels, getStatusColor, getMeetingStatusColor, getCallTypeColor, getLossReasonColor, getRedFlagLabels as getRedFlagLabelsLib } from '../../lib/computations';
import { LEAD_STATUSES, LOSS_REASONS, CALL_TYPES, MEETING_STATUSES, LEAD_SOURCES } from '../../lib/constants';
import type { Lead, LeadStatus } from '../../types';
import { Button, Input, Select, Badge, Modal, Label, Card, CardBody } from '../ui/BaseComponents';
import { cn } from '../../lib/utils';

const STATUS_COLUMNS: { status: LeadStatus; label: string }[] = [
  { status: 'New', label: 'New' },
  { status: 'Proposal', label: 'Proposal' },
  { status: 'Deposit', label: 'Deposit' },
  { status: 'Follow-Up Ongoing', label: 'Follow-Up' },
  { status: 'Meeting Follow-Up', label: 'Meeting FU' },
  { status: 'Won', label: 'Won' },
  { status: 'Lost', label: 'Lost' },
];

function SortableLeadCard({ lead, onUpdate, onOpen }: { lead: Lead; onUpdate: (id: string, updates: Partial<Lead>) => void; onOpen: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<Partial<Lead>>({});
  const redFlags = getRedFlagLabelsLib(lead);

  const handleBlur = useCallback((field: keyof Lead, value: any) => {
    const updates: Partial<Lead> = { [field]: value };
    onUpdate(lead.id, updates);
    setIsEditing(prev => ({ ...prev, [field]: false }));
  }, [lead.id, onUpdate]);

  const handleChange = (field: keyof Lead, value: any) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (field: keyof Lead, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.currentTarget as HTMLElement).blur();
    } else if (e.key === 'Escape') {
      setEditValues(prev => ({ ...prev, [field]: lead[field] as any }));
      setIsEditing(prev => ({ ...prev, [field]: false }));
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={cn('bg-white rounded-xl border border-gray-200 shadow-sm p-4 transition-all', isDragging && 'shadow-lg ring-2 ring-primary-500')}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="font-semibold text-gray-900 truncate">{lead.lead_name || 'Unnamed Lead'}</h4>
            <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full border', getStatusColor(lead.status))}>
              {lead.status}
            </span>
          </div>

          {lead.company && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <Building2 className="w-4 h-4" />
              <span className="truncate">{lead.company}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
            {lead.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span className="truncate">{lead.phone}</span>
              </div>
            )}
            {lead.setter_name && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="truncate">S: {lead.setter_name}</span>
              </div>
            )}
            {lead.closer_name && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="truncate">C: {lead.closer_name}</span>
              </div>
            )}
            {lead.source && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span className="truncate">{lead.source}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(lead.date_created)}</span>
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-3 p-2 bg-gray-50 rounded-lg">
            <div>
              <div className="text-gray-400">First Contact</div>
              <div className="font-medium">{lead.first_contact_date ? formatDateTime(lead.first_contact_date) : '-'}</div>
            </div>
            <div>
              <div className="text-gray-400">Meeting Booked</div>
              <div className="font-medium">{lead.date_meeting_booked ? formatDate(lead.date_meeting_booked) : '-'}</div>
            </div>
            <div>
              <div className="text-gray-400">Meeting Date</div>
              <div className="font-medium">{lead.date_of_meeting ? formatDate(lead.date_of_meeting) : '-'}</div>
            </div>
            <div>
              <div className="text-gray-400">Last Touch</div>
              <div className="font-medium">{lead.last_touch_date ? formatDate(lead.last_touch_date) : '-'}</div>
            </div>
          </div>

          {/* Meeting Status & Call Outcome */}
          <div className="flex flex-wrap gap-2 mb-3">
            {lead.meeting_status && (
              <Badge variant="default" className={getMeetingStatusColor(lead.meeting_status)}>
                {lead.meeting_status}
              </Badge>
            )}
            {lead.offer_made && (
              <Badge variant="primary">Offer Made</Badge>
            )}
            {lead.call_type && (
              <Badge variant="default" className={getCallTypeColor(lead.call_type)}>
                {lead.call_type}
              </Badge>
            )}
            {lead.loss_reason && (
              <Badge variant="default" className={getLossReasonColor(lead.loss_reason)}>
                Lost: {lead.loss_reason}
              </Badge>
            )}
          </div>

          {/* Red Flags */}
          {redFlags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {redFlags.map(flag => (
                <Badge key={flag} variant="danger" className="animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {flag}
                </Badge>
              ))}
            </div>
          )}

          {/* Money Section */}
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-gray-400">Deposit</div>
                <div className="font-medium text-gray-900">{formatCurrency(lead.deposit_amount)}</div>
              </div>
              <div>
                <div className="text-gray-400">Total Value</div>
                <div className="font-medium text-gray-900">{formatCurrency(lead.total_deal_value)}</div>
              </div>
              <div>
                <div className="text-gray-400">Collected</div>
                <div className="font-medium text-success-600">{formatCurrency(lead.cash_collected)}</div>
              </div>
              <div>
                <div className="text-gray-400">Refund/Clawback</div>
                <div className="font-medium text-danger-600">{formatCurrency(lead.refund_clawback_amount)}</div>
              </div>
              <div>
                <div className="text-gray-400">Commission %</div>
                <div className="font-medium">{lead.commission_pct}%</div>
              </div>
              <div>
                <div className="text-gray-400">Earnings</div>
                <div className="font-medium text-primary-600">{formatCurrency(lead.earnings)}</div>
              </div>
              {lead.date_paid_in_full && (
                <div className="col-span-2">
                  <div className="text-gray-400">Paid in Full</div>
                  <div className="font-medium">{formatDate(lead.date_paid_in_full)}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-gray-300 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function KanbanColumn({ status, label, leads, onUpdateLead, onOpenLead, onAddLead }: { 
  status: LeadStatus; 
  label: string; 
  leads: Lead[]; 
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
  onOpenLead: (id: string) => void;
  onAddLead: () => void;
}) {
  return (
    <div className="flex flex-col h-full min-w-[320px] max-w-[320px] bg-gray-50 rounded-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white rounded-t-xl">
        <h3 className="font-semibold text-gray-900">{label}</h3>
        <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
          {leads.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3" role="list" aria-label={`${label} leads`}>
        {leads.map(lead => (
          <SortableLeadCard 
            key={lead.id} 
            lead={lead} 
            onUpdate={onUpdateLead} 
            onOpen={onOpenLead} 
          />
        ))}
        
        {leads.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No leads in this stage</p>
          </div>
        )}
      </div>
      
      {status === 'New' && (
        <Button 
          variant="secondary" 
          size="sm" 
          className="mx-3 mb-3 w-[calc(100%-1.5rem)]"
          onClick={onAddLead}
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </Button>
      )}
    </div>
  );
}

export function KanbanBoard() {
  const { data: leads, isLoading, error, refetch } = useLeads();
  const updateLead = useUpdateLead();
  const createLead = useCreateLead();
  const { setLeadModalOpen } = useUIStore();
  const [newLeadData, setNewLeadData] = useState<Partial<Lead>>({
    status: 'New',
    lead_name: '',
    company: '',
    email: '',
    phone: '',
    source: 'Cold Call',
    setter_name: '',
    closer_name: '',
    deposit_amount: 0,
    total_deal_value: 0,
    cash_collected: 0,
    refund_clawback_amount: 0,
    commission_pct: 0,
    offer_made: false,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const targetColumn = over.id as LeadStatus;
      if (STATUS_COLUMNS.some(c => c.status === targetColumn)) {
        await updateLead.mutateAsync({ id: active.id as string, status: targetColumn });
      }
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadData.lead_name?.trim()) return;
    
    await createLead.mutateAsync({
      ...newLeadData,
      lead_name: newLeadData.lead_name!,
      date_created: new Date().toISOString(),
    } as any);
    
    setNewLeadData({
      status: 'New',
      lead_name: '',
      company: '',
      email: '',
      phone: '',
      source: 'Cold Call',
      setter_name: '',
      closer_name: '',
      deposit_amount: 0,
      total_deal_value: 0,
      cash_collected: 0,
      refund_clawback_amount: 0,
      commission_pct: 0,
      offer_made: false,
    });
  };

  const groupedLeads = LEAD_STATUSES.reduce((acc, status) => {
    acc[status] = leads?.filter(l => l.status === status) || [];
    return acc;
  }, {} as Record<LeadStatus, Lead[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-danger-600">
        Error loading leads: {error.message}
        <Button variant="secondary" className="mt-2" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] min-h-[600px] overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={leads?.map(l => l.id) || []} strategy={verticalListSortingStrategy}>
          <div className="flex gap-4 h-full overflow-x-auto pb-4 scrollbar-thin" role="list" aria-label="Kanban board">
            {STATUS_COLUMNS.map(({ status, label }) => (
              <KanbanColumn
                key={status}
                status={status}
                label={label}
                leads={groupedLeads[status]}
                onUpdateLead={(id, updates) => updateLead.mutate({ id, ...updates } as any)}
                onOpenLead={setLeadModalOpen}
                onAddLead={() => setLeadModalOpen('new')}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}