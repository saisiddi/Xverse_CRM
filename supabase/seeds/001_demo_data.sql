-- Seed data for Sales Tracker CRM
-- Run this in Supabase SQL Editor after the schema is created

-- === REVENUE GOALS ===
INSERT INTO revenue_goals (month, revenue_goal) VALUES
  ('2026-07-01', 150000),
  ('2026-08-01', 175000),
  ('2026-09-01', 200000)
ON CONFLICT (month) DO NOTHING;

-- === SETTER ACTIVITIES (last 30 days) ===
INSERT INTO setter_activities (setter_name, activity_date, dials_dms, conversations, calls_scheduled, calls_taken, declines, cancels, no_shows) VALUES
  ('Alex Rivera',   CURRENT_DATE - 0,  85, 32, 14, 10, 8, 2, 2),
  ('Alex Rivera',   CURRENT_DATE - 1,  92, 28, 12,  9, 6, 1, 2),
  ('Alex Rivera',   CURRENT_DATE - 2,  78, 35, 16, 11, 9, 3, 2),
  ('Alex Rivera',   CURRENT_DATE - 3,  95, 30, 13,  8, 7, 2, 3),
  ('Alex Rivera',   CURRENT_DATE - 4,  88, 26, 11,  8, 5, 2, 1),
  ('Alex Rivera',   CURRENT_DATE - 7,  72, 29, 14, 10, 8, 2, 2),
  ('Alex Rivera',   CURRENT_DATE - 14, 90, 34, 15, 12, 7, 1, 2),
  ('Alex Rivera',   CURRENT_DATE - 21, 82, 27, 12,  9, 6, 2, 1),
  ('Alex Rivera',   CURRENT_DATE - 28, 76, 31, 13, 10, 8, 1, 2),
  -- Jordan Chen (high performer)
  ('Jordan Chen',   CURRENT_DATE - 0,  65, 38, 18, 15, 3, 1, 2),
  ('Jordan Chen',   CURRENT_DATE - 1,  72, 40, 20, 16, 4, 1, 3),
  ('Jordan Chen',   CURRENT_DATE - 2,  68, 42, 19, 17, 2, 1, 1),
  ('Jordan Chen',   CURRENT_DATE - 3,  70, 36, 17, 14, 5, 2, 1),
  ('Jordan Chen',   CURRENT_DATE - 4,  75, 39, 21, 18, 3, 1, 2),
  ('Jordan Chen',   CURRENT_DATE - 7,  60, 35, 16, 14, 4, 1, 1),
  ('Jordan Chen',   CURRENT_DATE - 14, 78, 41, 22, 18, 5, 2, 2),
  ('Jordan Chen',   CURRENT_DATE - 21, 66, 37, 18, 15, 3, 1, 2),
  ('Jordan Chen',   CURRENT_DATE - 28, 71, 40, 20, 17, 4, 1, 2),
  -- Maria Santos (low performer - high dials, low conv)
  ('Maria Santos',  CURRENT_DATE - 0,  110, 18, 6,  4,  10, 2, 0),
  ('Maria Santos',  CURRENT_DATE - 1,  105, 20, 7,  5,  9,  1, 1),
  ('Maria Santos',  CURRENT_DATE - 2,  115, 15, 5,  3,  11, 1, 1),
  ('Maria Santos',  CURRENT_DATE - 3,  108, 22, 8,  6,  8,  1, 1),
  ('Maria Santos',  CURRENT_DATE - 4,  98, 19, 6,  4,  10, 2, 0),
  ('Maria Santos',  CURRENT_DATE - 7,  112, 17, 5,  3,  11, 1, 1),
  ('Maria Santos',  CURRENT_DATE - 14, 102, 21, 7,  5,  9,  2, 0),
  ('Maria Santos',  CURRENT_DATE - 21, 95, 16, 4,  3,  8,  1, 0),
  ('Maria Santos',  CURRENT_DATE - 28, 100, 20, 6,  4,  10, 1, 1)
ON CONFLICT (setter_name, activity_date) DO NOTHING;

-- === LEADS ===

-- Helper: generate timestamps
-- We'll use explicit values

-- 1) NEW leads (no contact yet)
INSERT INTO leads (lead_name, company, email, phone, source, setter_name, closer_name, status, date_created, deposit_amount, total_deal_value, cash_collected, refund_clawback_amount, commission_pct, offer_made) VALUES
  ('Sarah Johnson',    'TechVista Inc',     'sarah@techvista.com',     '(555) 101-0001', 'LinkedIn',   'Alex Rivera',  NULL,        'New',     CURRENT_TIMESTAMP - INTERVAL '1 hour',   0, 0, 0, 0, 0, FALSE),
  ('Mike Chen',        'DataFlow Systems',  'mike@dataflow.io',       '(555) 101-0002', 'Cold Call',  'Jordan Chen', NULL,        'New',     CURRENT_TIMESTAMP - INTERVAL '2 hours',  0, 0, 0, 0, 0, FALSE),
  ('Emily Davis',      'GreenLeaf Co',      'emily@greenleaf.com',    '(555) 101-0003', 'Referral',   'Maria Santos',NULL,        'New',     CURRENT_TIMESTAMP - INTERVAL '3 hours',  0, 0, 0, 0, 0, FALSE),
  ('James Wilson',     'PrimeCore Ltd',     'james@primecore.com',    '(555) 101-0004', 'Inbound',    'Alex Rivera',  NULL,        'New',     CURRENT_TIMESTAMP - INTERVAL '5 hours',  0, 0, 0, 0, 0, FALSE),
  ('Lisa Thompson',    'NovaEdge Partners', 'lisa@novaedge.com',      '(555) 101-0005', 'Cold Email', 'Jordan Chen', NULL,        'New',     CURRENT_TIMESTAMP - INTERVAL '1 day',    0, 0, 0, 0, 0, FALSE),
  ('David Brown',      'Summit Group',      'david@summitgroup.com',  '(555) 101-0006', 'Ad',         'Maria Santos',NULL,        'New',     CURRENT_TIMESTAMP - INTERVAL '2 days',   0, 0, 0, 0, 0, FALSE),
  ('Anna Martinez',    'Crestview Tech',    'anna@crestview.tech',    '(555) 101-0007', 'LinkedIn',   'Alex Rivera',  NULL,        'New',     CURRENT_TIMESTAMP - INTERVAL '3 days',   0, 0, 0, 0, 0, FALSE);

-- 2) PROPOSAL (contact made, proposal sent)
INSERT INTO leads (lead_name, company, email, phone, source, setter_name, closer_name, status, date_created, first_contact_date, deposit_amount, total_deal_value, cash_collected, refund_clawback_amount, commission_pct, offer_made) VALUES
  ('Robert Garcia',    'Apex Analytics',    'robert@apexanalytics.com', '(555) 201-0001', 'Referral',   'Jordan Chen', 'Sarah Kim',   'Proposal', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '4 days', 0, 15000, 0, 0, 10, TRUE),
  ('Jennifer Lee',     'Pinnacle Corp',     'jennifer@pinnaclecorp.com','(555) 201-0002', 'LinkedIn',   'Alex Rivera', 'Sarah Kim',   'Proposal', CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 0, 22000, 0, 0, 12, TRUE),
  ('Thomas Anderson',  'Quantum Labs',      'thomas@quantumlabs.com',  '(555) 201-0003', 'Cold Call',  'Maria Santos','Mike Torres', 'Proposal', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 0, 8500,  0, 0, 8,  TRUE),
  ('Patricia White',   'Horizon Media',     'patricia@horizonmedia.com','(555) 201-0004', 'Cold Email', 'Alex Rivera', 'Sarah Kim',   'Proposal', CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '6 days', 0, 32000, 0, 0, 15, TRUE),
  ('Christopher Hall', 'Meridian Health',   'chris@meridianhealth.com', '(555) 201-0005', 'Inbound',    'Jordan Chen', 'Mike Torres', 'Proposal', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '8 days', 0, 18000, 0, 0, 10, TRUE);

-- 3) DEPOSIT (deposit received, not yet paid in full)
INSERT INTO leads (lead_name, company, email, phone, source, setter_name, closer_name, status, date_created, first_contact_date, date_meeting_booked, date_of_meeting, meeting_status, offer_made, call_type, deposit_amount, total_deal_value, cash_collected, refund_clawback_amount, commission_pct) VALUES
  ('Amanda Foster',    'BrightPath Edu',    'amanda@brightpath.edu',   '(555) 301-0001', 'Referral',   'Jordan Chen', 'Sarah Kim',   'Deposit', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '8 days',  CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '6 days', 'Show', TRUE, '1-Call Sale', 2500,  12500, 2500,  0, 12),
  ('Kevin Nguyen',     'Skyline Solutions', 'kevin@skylinesol.com',    '(555) 301-0002', 'LinkedIn',   'Alex Rivera', 'Sarah Kim',   'Deposit', CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '9 days',  CURRENT_TIMESTAMP - INTERVAL '8 days',  'Show', TRUE, '1-Call Sale', 5000,  28000, 5000,  0, 15),
  ('Rachel Adams',     'TrueNorth Software','rachel@truenorth.dev',    '(555) 301-0003', 'Cold Call',  'Maria Santos','Mike Torres', 'Deposit', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '17 days', CURRENT_TIMESTAMP - INTERVAL '16 days', 'Show', TRUE, 'Follow-Up Sale', 3000, 15000, 3000,  0, 10),
  -- This one has deposit_unpaid_flag (14+ days since created, deposit > collected)
  ('Brian Scott',      'Vanguard Ventures', 'brian@vanguardventures.com','(555) 301-0004', 'Ad',         'Jordan Chen', 'Mike Torres', 'Deposit', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '23 days', CURRENT_TIMESTAMP - INTERVAL '22 days', CURRENT_TIMESTAMP - INTERVAL '21 days', 'Show', TRUE, '1-Call Sale', 4000,  20000, 1000,  0, 12),
  ('Michelle Wright',  'Pioneer Group',     'michelle@pioneergroup.com','(555) 301-0005', 'Cold Email', 'Alex Rivera', 'Sarah Kim',   'Deposit', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '13 days', CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '11 days', 'Show', TRUE, 'Follow-Up Sale', 3500, 17500, 3500, 0, 12),
  -- Another unpaid deposit (red flag)
  ('Daniel Clark',     'Ironclad Security', 'daniel@ironcladsec.com',  '(555) 301-0006', 'Inbound',    'Maria Santos','Mike Torres', 'Deposit', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '28 days', CURRENT_TIMESTAMP - INTERVAL '27 days', CURRENT_TIMESTAMP - INTERVAL '26 days', 'Show', TRUE, '1-Call Sale', 6000,  30000, 1500,  0, 15);

-- 4) FOLLOW-UP ONGOING (some with aging flag)
INSERT INTO leads (lead_name, company, email, phone, source, setter_name, closer_name, status, date_created, first_contact_date, date_meeting_booked, date_of_meeting, meeting_status, last_touch_date, offer_made, call_type, deposit_amount, total_deal_value, cash_collected, refund_clawback_amount, commission_pct) VALUES
  -- Fresh follow-up (no aging)
  ('Stephanie Turner', 'Elite Brands Inc',  'stephanie@elitebrands.com','(555) 401-0001', 'LinkedIn',   'Jordan Chen', 'Sarah Kim',   'Follow-Up Ongoing', CURRENT_TIMESTAMP - INTERVAL '8 days',  CURRENT_TIMESTAMP - INTERVAL '6 days',  CURRENT_TIMESTAMP - INTERVAL '5 days',  CURRENT_TIMESTAMP - INTERVAL '4 days',  'Show', CURRENT_TIMESTAMP - INTERVAL '1 day',  TRUE, 'Follow-Up Sale', 5000,  25000, 5000,  0, 12),
  ('Nathan Brooks',    'CoreValue Tech',    'nathan@corevalue.tech',   '(555) 401-0002', 'Cold Call',  'Alex Rivera', 'Sarah Kim',   'Follow-Up Ongoing', CURRENT_TIMESTAMP - INTERVAL '6 days',  CURRENT_TIMESTAMP - INTERVAL '4 days',  CURRENT_TIMESTAMP - INTERVAL '3 days',  CURRENT_TIMESTAMP - INTERVAL '2 days',  'Show', CURRENT_TIMESTAMP - INTERVAL '1 day',  TRUE, '1-Call Sale', 2000,  10000, 2000,  0, 10),
  ('Olivia Carter',    'NorthStar Finance', 'olivia@northstarfin.com', '(555) 401-0003', 'Referral',   'Jordan Chen', 'Mike Torres', 'Follow-Up Ongoing', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '8 days',  CURRENT_TIMESTAMP - INTERVAL '7 days',  CURRENT_TIMESTAMP - INTERVAL '6 days',  'Show', CURRENT_TIMESTAMP - INTERVAL '2 days', TRUE, 'Follow-Up Sale', 7500,  42000, 7500,  0, 15),
  -- Aging 7+ days (red flag)
  ('Ethan Martinez',   'ClearView Data',    'ethan@clearviewdata.com', '(555) 401-0004', 'Cold Email', 'Maria Santos','Mike Torres', 'Follow-Up Ongoing', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '17 days', CURRENT_TIMESTAMP - INTERVAL '16 days', 'Show', CURRENT_TIMESTAMP - INTERVAL '10 days', TRUE, 'Follow-Up Sale', 3000,  16000, 3000,  0, 10),
  ('Sophia Reed',      'Atlas Corp',        'sophia@atlascorp.com',    '(555) 401-0005', 'Ad',         'Alex Rivera', 'Sarah Kim',   'Follow-Up Ongoing', CURRENT_TIMESTAMP - INTERVAL '22 days', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '19 days', CURRENT_TIMESTAMP - INTERVAL '18 days', 'Show', CURRENT_TIMESTAMP - INTERVAL '12 days', TRUE, '1-Call Sale', 4500,  22000, 4500,  0, 12),
  ('Derek Mitchell',   'Vanguard Software', 'derek@vanguardsw.com',    '(555) 401-0006', 'Inbound',    'Jordan Chen', 'Mike Torres', 'Follow-Up Ongoing', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '23 days', CURRENT_TIMESTAMP - INTERVAL '22 days', CURRENT_TIMESTAMP - INTERVAL '21 days', 'Show', CURRENT_TIMESTAMP - INTERVAL '15 days', TRUE, 'Follow-Up Sale', 6000,  35000, 6000,  0, 15),
  -- No show, needs follow-up
  ('Hannah Walker',    'Peak Performance',  'hannah@peakperf.com',     '(555) 401-0007', 'LinkedIn',   'Maria Santos','Mike Torres', 'Follow-Up Ongoing', CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '11 days', CURRENT_TIMESTAMP - INTERVAL '10 days', 'No-Show', CURRENT_TIMESTAMP - INTERVAL '7 days', FALSE, NULL, 0,     0,     0,    0, 0);

-- 5) MEETING FOLLOW-UP (meeting happened, decision pending)
INSERT INTO leads (lead_name, company, email, phone, source, setter_name, closer_name, status, date_created, first_contact_date, date_meeting_booked, date_of_meeting, meeting_status, last_touch_date, offer_made, call_type, deposit_amount, total_deal_value, cash_collected, refund_clawback_amount, commission_pct) VALUES
  ('Tyler Jackson',    'OmniBuild LLC',     'tyler@omnibuild.com',     '(555) 501-0001', 'Referral',   'Alex Rivera', 'Sarah Kim',   'Meeting Follow-Up', CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '9 days',  CURRENT_TIMESTAMP - INTERVAL '8 days',  'Show', CURRENT_TIMESTAMP - INTERVAL '2 days',  TRUE, 'Follow-Up Sale', 0, 50000, 0, 0, 15),
  ('Isabella Costa',   'Luxe Realty Group', 'isabella@luxerealty.com', '(555) 501-0002', 'LinkedIn',   'Jordan Chen', 'Sarah Kim',   'Meeting Follow-Up', CURRENT_TIMESTAMP - INTERVAL '8 days',  CURRENT_TIMESTAMP - INTERVAL '6 days',  CURRENT_TIMESTAMP - INTERVAL '5 days',  CURRENT_TIMESTAMP - INTERVAL '4 days',  'Show', CURRENT_TIMESTAMP - INTERVAL '1 day',   TRUE, 'Follow-Up Sale', 0, 35000, 0, 0, 12),
  ('Liam O''Brien',    'Celtic Solutions',  'liam@celticsolutions.com','(555) 501-0003', 'Cold Call',  'Maria Santos','Mike Torres', 'Meeting Follow-Up', CURRENT_TIMESTAMP - INTERVAL '9 days',  CURRENT_TIMESTAMP - INTERVAL '7 days',  CURRENT_TIMESTAMP - INTERVAL '6 days',  CURRENT_TIMESTAMP - INTERVAL '5 days',  'Show', CURRENT_TIMESTAMP - INTERVAL '1 day',   TRUE, '1-Call Sale', 0, 12000, 0, 0, 10);

-- 6) WON (closed won deals)
INSERT INTO leads (lead_name, company, email, phone, source, setter_name, closer_name, status, date_created, first_contact_date, date_meeting_booked, date_of_meeting, meeting_status, last_touch_date, offer_made, call_type, loss_reason, deposit_amount, total_deal_value, cash_collected, refund_clawback_amount, commission_pct, date_paid_in_full) VALUES
  ('William Taylor',   'Prestige Medical',  'william@prestigemed.com', '(555) 601-0001', 'Referral',   'Jordan Chen', 'Sarah Kim',   'Won', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '43 days', CURRENT_TIMESTAMP - INTERVAL '42 days', CURRENT_TIMESTAMP - INTERVAL '41 days', 'Show', CURRENT_TIMESTAMP - INTERVAL '30 days', TRUE, '1-Call Sale', NULL, 10000, 55000, 55000, 0, 12, CURRENT_TIMESTAMP - INTERVAL '30 days'),
  ('Victoria Chang',   'DragonFly Tech',    'victoria@dragonfly.tech', '(555) 601-0002', 'LinkedIn',   'Alex Rivera', 'Sarah Kim',   'Won', CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_TIMESTAMP - INTERVAL '48 days', CURRENT_TIMESTAMP - INTERVAL '47 days', CURRENT_TIMESTAMP - INTERVAL '46 days', 'Show', CURRENT_TIMESTAMP - INTERVAL '35 days', TRUE, '1-Call Sale', NULL, 8000,  42000, 42000, 0, 15, CURRENT_TIMESTAMP - INTERVAL '35 days'),
  ('George Harris',    'Apex Logistics',    'george@apexlogistics.com','(555) 601-0003', 'Cold Call',  'Alex Rivera', 'Mike Torres', 'Won', CURRENT_TIMESTAMP - INTERVAL '55 days', CURRENT_TIMESTAMP - INTERVAL '53 days', CURRENT_TIMESTAMP - INTERVAL '52 days', CURRENT_TIMESTAMP - INTERVAL '51 days', 'Show', CURRENT_TIMESTAMP - INTERVAL '40 days', TRUE, 'Follow-Up Sale', NULL, 15000, 78000, 78000, 0, 10, CURRENT_TIMESTAMP - INTERVAL '40 days'),
  ('Megan Foster',     'SilverOak Finance', 'megan@silveroakfin.com',  '(555) 601-0004', 'Inbound',    'Jordan Chen', 'Mike Torres', 'Won', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '58 days', CURRENT_TIMESTAMP - INTERVAL '57 days', CURRENT_TIMESTAMP - INTERVAL '56 days', 'Show', CURRENT_TIMESTAMP - INTERVAL '45 days', TRUE, '1-Call Sale', NULL, 12000, 63000, 63000, 0, 12, CURRENT_TIMESTAMP - INTERVAL '45 days'),
  ('Ryan Patel',       'InnovateNow Inc',   'ryan@innovatenow.com',    '(555) 601-0005', 'Cold Email', 'Maria Santos','Mike Torres', 'Won', CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_TIMESTAMP - INTERVAL '33 days', CURRENT_TIMESTAMP - INTERVAL '32 days', CURRENT_TIMESTAMP - INTERVAL '31 days', 'Show', CURRENT_TIMESTAMP - INTERVAL '20 days', TRUE, 'Follow-Up Sale', NULL, 20000, 95000, 95000, 0, 15, CURRENT_TIMESTAMP - INTERVAL '20 days'),
  ('Grace Kim',        'BlueSky Analytics', 'grace@blueskyanalytics.com','(555) 601-0006', 'Referral',   'Jordan Chen', 'Sarah Kim',   'Won', CURRENT_TIMESTAMP - INTERVAL '40 days', CURRENT_TIMESTAMP - INTERVAL '38 days', CURRENT_TIMESTAMP - INTERVAL '37 days', CURRENT_TIMESTAMP - INTERVAL '36 days', 'Show', CURRENT_TIMESTAMP - INTERVAL '25 days', TRUE, '1-Call Sale', NULL, 25000, 120000, 120000, 0, 12, CURRENT_TIMESTAMP - INTERVAL '25 days'),
  -- Won with refund/clawback
  ('Samuel Green',     'Greenfield Ag',     'samuel@greenfieldag.com', '(555) 601-0007', 'Ad',         'Maria Santos','Mike Torres', 'Won', CURRENT_TIMESTAMP - INTERVAL '70 days', CURRENT_TIMESTAMP - INTERVAL '68 days', CURRENT_TIMESTAMP - INTERVAL '67 days', CURRENT_TIMESTAMP - INTERVAL '66 days', 'Show', CURRENT_TIMESTAMP - INTERVAL '50 days', TRUE, 'Follow-Up Sale', NULL, 30000, 150000, 140000, 10000, 10, CURRENT_TIMESTAMP - INTERVAL '55 days');

-- 7) LOST (all loss reasons)
INSERT INTO leads (lead_name, company, email, phone, source, setter_name, closer_name, status, date_created, first_contact_date, date_meeting_booked, date_of_meeting, meeting_status, last_touch_date, offer_made, call_type, loss_reason, deposit_amount, total_deal_value, cash_collected, refund_clawback_amount, commission_pct) VALUES
  -- Price
  ('Ashley Morgan',    'Titan Industries',  'ashley@titanind.com',     '(555) 701-0001', 'LinkedIn',   'Alex Rivera', 'Sarah Kim',   'Lost', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '23 days', CURRENT_TIMESTAMP - INTERVAL '22 days', CURRENT_TIMESTAMP - INTERVAL '21 days', 'Show',     CURRENT_TIMESTAMP - INTERVAL '18 days', TRUE,  '1-Call Sale',    'Price',          0, 0, 0, 0, 0),
  ('Brandon Cox',      'Vertex Dynamics',   'brandon@vertexdyn.com',   '(555) 701-0002', 'Cold Call',  'Jordan Chen', 'Sarah Kim',   'Lost', CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '16 days', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '14 days', 'Show',     CURRENT_TIMESTAMP - INTERVAL '12 days', TRUE,  'Follow-Up Sale', 'Price',          0, 0, 0, 0, 0),
  -- Timing
  ('Lauren Mitchell',  'Crestwood Realty',  'lauren@crestwoodrealty.com','(555) 701-0003', 'Referral',   'Maria Santos','Mike Torres','Lost', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '28 days', CURRENT_TIMESTAMP - INTERVAL '27 days', CURRENT_TIMESTAMP - INTERVAL '26 days', 'Show',     CURRENT_TIMESTAMP - INTERVAL '24 days', TRUE,  '1-Call Sale',    'Timing',         0, 0, 0, 0, 0),
  ('Jacob Reed',       'Fusion Marketing',  'jacob@fusionmktg.com',    '(555) 701-0004', 'Inbound',    'Jordan Chen', 'Mike Torres', 'Lost', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '13 days', CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '11 days', 'Show',     CURRENT_TIMESTAMP - INTERVAL '9 days',  TRUE,  'Follow-Up Sale', 'Timing',         0, 0, 0, 0, 0),
  -- Partner-Spouse
  ('Katherine Ward',   'Heritage Homes',    'katherine@heritagehomes.com','(555) 701-0005', 'Cold Email', 'Alex Rivera', 'Mike Torres', 'Lost', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '17 days', CURRENT_TIMESTAMP - INTERVAL '16 days', 'Show',     CURRENT_TIMESTAMP - INTERVAL '14 days', TRUE,  '1-Call Sale',    'Partner-Spouse', 0, 0, 0, 0, 0),
  ('Dylan Fisher',     'Liberty Auto Group','dylan@libertyauto.com',   '(555) 701-0006', 'Ad',         'Maria Santos','Mike Torres','Lost', CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '9 days',  CURRENT_TIMESTAMP - INTERVAL '8 days',  'Show',     CURRENT_TIMESTAMP - INTERVAL '6 days',  TRUE,  'Follow-Up Sale', 'Partner-Spouse', 0, 0, 0, 0, 0),
  -- Competitor
  ('Zoe Barnes',       'NexGen Solutions',  'zoe@nexgensolutions.com', '(555) 701-0007', 'LinkedIn',   'Jordan Chen', 'Sarah Kim',   'Lost', CURRENT_TIMESTAMP - INTERVAL '22 days', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '19 days', CURRENT_TIMESTAMP - INTERVAL '18 days', 'Show',     CURRENT_TIMESTAMP - INTERVAL '16 days', TRUE,  '1-Call Sale',    'Competitor',     0, 0, 0, 0, 0),
  ('Connor Sullivan',  'PrimeSource Media', 'connor@primesource.com',  '(555) 701-0008', 'Cold Call',  'Alex Rivera', 'Sarah Kim',   'Lost', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '8 days',  CURRENT_TIMESTAMP - INTERVAL '7 days',  CURRENT_TIMESTAMP - INTERVAL '6 days',  'Show',     CURRENT_TIMESTAMP - INTERVAL '4 days',  TRUE,  'Follow-Up Sale', 'Competitor',     0, 0, 0, 0, 0),
  -- Ghosted
  ('Hailey Cooper',    'Apex Brands',       'hailey@apexbrands.com',   '(555) 701-0009', 'Referral',   'Maria Santos','Mike Torres','Lost', CURRENT_TIMESTAMP - INTERVAL '28 days', CURRENT_TIMESTAMP - INTERVAL '26 days', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '24 days', 'Show',     CURRENT_TIMESTAMP - INTERVAL '20 days', TRUE,  '1-Call Sale',    'Ghosted',        0, 0, 0, 0, 0),
  ('Lucas Peterson',   'Metro Consulting',  'lucas@metroconsult.com',  '(555) 701-0010', 'Inbound',    'Alex Rivera', 'Mike Torres', 'Lost', CURRENT_TIMESTAMP - INTERVAL '16 days', CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '13 days', CURRENT_TIMESTAMP - INTERVAL '12 days', 'Show',     CURRENT_TIMESTAMP - INTERVAL '8 days',  TRUE,  'Follow-Up Sale', 'Ghosted',        0, 0, 0, 0, 0),
  -- Not Qualified
  ('Aria Jenkins',     'BrightMedia Co',    'aria@brightmedia.co',     '(555) 701-0011', 'Ad',         'Jordan Chen', 'Mike Torres', 'Lost', CURRENT_TIMESTAMP - INTERVAL '5 days',  CURRENT_TIMESTAMP - INTERVAL '3 days',  NULL, NULL, 'Show', CURRENT_TIMESTAMP - INTERVAL '2 days',  FALSE, NULL,             'Not Qualified',  0, 0, 0, 0, 0),
  -- DQ (Disqualified at meeting level)
  ('Cole Richardson',  'Summit Advisors',   'cole@summitadvisors.com', '(555) 701-0012', 'Cold Email', 'Maria Santos','Mike Torres','Lost', CURRENT_TIMESTAMP - INTERVAL '8 days',  CURRENT_TIMESTAMP - INTERVAL '6 days',  CURRENT_TIMESTAMP - INTERVAL '5 days',  CURRENT_TIMESTAMP - INTERVAL '4 days',  'DQ',       CURRENT_TIMESTAMP - INTERVAL '4 days',  FALSE, NULL,             'Not Qualified',  0, 0, 0, 0, 0),
  -- No show then lost
  ('Jasmine Patel',    'Rising Tide LLC',   'jasmine@risingtidellc.com','(555) 701-0013', 'LinkedIn',   'Jordan Chen', 'Sarah Kim',   'Lost', CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '11 days', CURRENT_TIMESTAMP - INTERVAL '10 days', 'No-Show',  CURRENT_TIMESTAMP - INTERVAL '8 days',  FALSE, NULL,             'Ghosted',        0, 0, 0, 0, 0);

-- === BOOKING LAG FLAG EXAMPLES (meeting booked far from meeting date) ===
-- These have booking_lag_flag true (meeting booked > 4 days before meeting)
INSERT INTO leads (lead_name, company, email, phone, source, setter_name, closer_name, status, date_created, first_contact_date, date_meeting_booked, date_of_meeting, meeting_status, last_touch_date, offer_made, deposit_amount, total_deal_value, cash_collected, refund_clawback_amount, commission_pct) VALUES
  ('Nathan Drake',     'LostCity Ventures', 'nathan@lostcity.com',      '(555) 801-0001', 'LinkedIn',   'Alex Rivera', 'Sarah Kim',   'Follow-Up Ongoing', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '28 days', CURRENT_TIMESTAMP - INTERVAL '27 days', CURRENT_TIMESTAMP - INTERVAL '20 days', 'Show', CURRENT_TIMESTAMP - INTERVAL '10 days', TRUE, 5000, 25000, 5000, 0, 12),
  ('Elena Fisher',     'Uncharted Media',   'elena@unchartedmedia.com','(555) 801-0002',  'Referral',   'Maria Santos','Mike Torres', 'Follow-Up Ongoing', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '23 days', CURRENT_TIMESTAMP - INTERVAL '22 days', CURRENT_TIMESTAMP - INTERVAL '14 days', 'No-Show', CURRENT_TIMESTAMP - INTERVAL '10 days', FALSE, 0, 0, 0, 0, 0);
