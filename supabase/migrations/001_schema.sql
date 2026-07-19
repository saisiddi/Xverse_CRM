-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  source TEXT,
  setter_name TEXT,
  closer_name TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN (
    'New', 'Proposal', 'Deposit', 'Follow-Up Ongoing',
    'Meeting Follow-Up', 'Won', 'Lost'
  )),
  date_created TIMESTAMPTZ DEFAULT NOW(),
  first_contact_date TIMESTAMPTZ,
  date_meeting_booked TIMESTAMPTZ,
  date_of_meeting TIMESTAMPTZ,
  last_touch_date TIMESTAMPTZ,
  date_paid_in_full TIMESTAMPTZ,
  meeting_status TEXT CHECK (meeting_status IN (
    'Show', 'No-Show', 'Rescheduled By Us',
    'Rescheduled By Them', 'Cancel', 'DQ'
  )),
  offer_made BOOLEAN DEFAULT FALSE,
  call_type TEXT CHECK (call_type IN ('1-Call Sale', 'Follow-Up Sale')),
  loss_reason TEXT CHECK (loss_reason IN (
    'Price', 'Timing', 'Partner-Spouse', 'Competitor', 'Ghosted', 'Not Qualified'
  )),
  deposit_amount DECIMAL(12,2) DEFAULT 0,
  total_deal_value DECIMAL(12,2) DEFAULT 0,
  cash_collected DECIMAL(12,2) DEFAULT 0,
  refund_clawback_amount DECIMAL(12,2) DEFAULT 0,
  commission_pct DECIMAL(5,2) DEFAULT 0,
  earnings DECIMAL(12,2) GENERATED ALWAYS AS (
    (total_deal_value - refund_clawback_amount) * (commission_pct / 100)
  ) STORED,
  aging_flag BOOLEAN DEFAULT FALSE,
  booking_lag_flag BOOLEAN DEFAULT FALSE,
  deposit_unpaid_flag BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create setter_activities table
CREATE TABLE IF NOT EXISTS setter_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setter_name TEXT NOT NULL,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  dials_dms INTEGER DEFAULT 0,
  conversations INTEGER DEFAULT 0,
  calls_scheduled INTEGER DEFAULT 0,
  calls_taken INTEGER DEFAULT 0,
  declines INTEGER DEFAULT 0,
  cancels INTEGER DEFAULT 0,
  no_shows INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(setter_name, activity_date)
);

-- Create revenue_goals table
CREATE TABLE IF NOT EXISTS revenue_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month DATE NOT NULL UNIQUE,
  revenue_goal DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (allow anon access since no auth)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE setter_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_goals ENABLE ROW LEVEL SECURITY;

-- Allow anon access
CREATE POLICY "anon_all_leads" ON leads FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_setter_activities" ON setter_activities FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_revenue_goals" ON revenue_goals FOR ALL TO anon USING (true) WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE setter_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE revenue_goals;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_setter ON leads(setter_name);
CREATE INDEX IF NOT EXISTS idx_leads_closer ON leads(closer_name);
CREATE INDEX IF NOT EXISTS idx_leads_date_created ON leads(date_created);
CREATE INDEX IF NOT EXISTS idx_leads_status_date ON leads(status, date_created);
CREATE INDEX IF NOT EXISTS idx_activities_setter_date ON setter_activities(setter_name, activity_date);