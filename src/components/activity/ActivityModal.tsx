import { useState, useEffect } from 'react';
import { X, Save, Phone, MessageSquare, Calendar, ThumbsDown, AlertCircle } from 'lucide-react';
import { useSetterActivities, useUpsertSetterActivity } from '../../hooks/useLeads';
import { useLeads } from '../../hooks/useLeads';
import { getUniqueSetters } from '../../lib/computations';
import { Modal, Button, Input, Label, Select } from '../ui/BaseComponents';

interface ActivityFormData {
  setter_name: string;
  activity_date: string;
  dials_dms: number;
  conversations: number;
  calls_scheduled: number;
  calls_taken: number;
  declines: number;
  cancels: number;
  no_shows: number;
}

export function ActivityModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: leads } = useLeads();
  const { data: activities } = useSetterActivities();
  const upsertActivity = useUpsertSetterActivity();
  const setters = getUniqueSetters(leads || []);
  
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<ActivityFormData>({
    setter_name: setters[0] || '',
    activity_date: today,
    dials_dms: 0,
    conversations: 0,
    calls_scheduled: 0,
    calls_taken: 0,
    declines: 0,
    cancels: 0,
    no_shows: 0,
  });

  useEffect(() => {
    if (setters.length > 0 && !formData.setter_name) {
      setFormData(prev => ({ ...prev, setter_name: setters[0] }));
    }
  }, [setters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.setter_name) return;
    
    await upsertActivity.mutateAsync({
      setter_name: formData.setter_name,
      activity_date: formData.activity_date,
      dials_dms: formData.dials_dms,
      conversations: formData.conversations,
      calls_scheduled: formData.calls_scheduled,
      calls_taken: formData.calls_taken,
      declines: formData.declines,
      cancels: formData.cancels,
      no_shows: formData.no_shows,
    });
    
    setFormData(prev => ({
      ...prev,
      dials_dms: 0,
      conversations: 0,
      calls_scheduled: 0,
      calls_taken: 0,
      declines: 0,
      cancels: 0,
      no_shows: 0,
    }));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Daily Activity" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="setter_name">Setter</Label>
            <Select
              id="setter_name"
              value={formData.setter_name}
              onChange={e => setFormData(prev => ({ ...prev, setter_name: e.target.value }))}
              required
            >
              <option value="">Select setter</option>
              {setters.map(s => <option key={s} value={s}>{s}</option>)}
              {setters.length === 0 && <option value="">No setters yet</option>}
            </Select>
          </div>
          <div>
            <Label htmlFor="activity_date">Date</Label>
            <Input
              id="activity_date"
              type="date"
              value={formData.activity_date}
              onChange={e => setFormData(prev => ({ ...prev, activity_date: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="dials_dms">Dials/DMs</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="dials_dms"
                type="number"
                min="0"
                value={formData.dials_dms}
                onChange={e => setFormData(prev => ({ ...prev, dials_dms: parseInt(e.target.value) || 0 }))}
                className="pl-10"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="conversations">Conversations</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="conversations"
                type="number"
                min="0"
                value={formData.conversations}
                onChange={e => setFormData(prev => ({ ...prev, conversations: parseInt(e.target.value) || 0 }))}
                className="pl-10"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="calls_scheduled">Calls Scheduled</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="calls_scheduled"
                type="number"
                min="0"
                value={formData.calls_scheduled}
                onChange={e => setFormData(prev => ({ ...prev, calls_scheduled: parseInt(e.target.value) || 0 }))}
                className="pl-10"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="calls_taken">Calls Taken</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="calls_taken"
                type="number"
                min="0"
                value={formData.calls_taken}
                onChange={e => setFormData(prev => ({ ...prev, calls_taken: parseInt(e.target.value) || 0 }))}
                className="pl-10"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="declines">Declines</Label>
            <div className="relative">
              <ThumbsDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="declines"
                type="number"
                min="0"
                value={formData.declines}
                onChange={e => setFormData(prev => ({ ...prev, declines: parseInt(e.target.value) || 0 }))}
                className="pl-10"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="cancels">Cancels</Label>
            <div className="relative">
              <X className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="cancels"
                type="number"
                min="0"
                value={formData.cancels}
                onChange={e => setFormData(prev => ({ ...prev, cancels: parseInt(e.target.value) || 0 }))}
                className="pl-10"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="no_shows">No-Shows</Label>
            <div className="relative">
              <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="no_shows"
                type="number"
                min="0"
                value={formData.no_shows}
                onChange={e => setFormData(prev => ({ ...prev, no_shows: parseInt(e.target.value) || 0 }))}
                className="pl-10"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={!formData.setter_name}>
            <Save className="w-4 h-4" />
            Save Activity
          </Button>
        </div>
      </form>
    </Modal>
  );
}