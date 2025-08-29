-- Seed production data with current mock data
-- Insert users (Edwin and Marc)
INSERT INTO users (id, email, role, full_name, phone) VALUES
  ('edwin-uuid', 'ehdiwin@747ph.live', 'lender', 'Boss Edwin', '09123456789'),
  ('marc-uuid', 'bossmarc@747ph.live', 'broker', 'Boss Marc', '09987654321')
ON CONFLICT (email) DO NOTHING;

-- Insert pending loan request (updated to today's date)
INSERT INTO loan_requests (id, broker_id, borrower_name, borrower_contact, loan_amount, purpose, status, requested_at) VALUES
  (1, 'marc-uuid', 'Jericho', '09182156660', 50000, 'Business capital for small enterprise', 'pending', NOW())
ON CONFLICT (id) DO UPDATE SET
  requested_at = NOW(),
  status = 'pending';

-- Insert approved loans (running loans)
INSERT INTO loans (id, request_id, lender_id, broker_id, borrower_name, borrower_contact, principal_amount, interest_rate, status, approved_at, loan_term_months) VALUES
  (101, NULL, 'edwin-uuid', 'marc-uuid', 'Boyong', '09182156660', 100000, 10.0, 'active', '2025-08-15 10:00:00', 12),
  (102, NULL, 'edwin-uuid', 'marc-uuid', 'Boyong', '09182156660', 50000, 10.0, 'active', '2025-08-15 10:00:00', 12)
ON CONFLICT (id) DO NOTHING;

-- Insert payment schedules for the loans
INSERT INTO payment_schedules (loan_id, due_date, principal_due, interest_due, status) VALUES
  -- For loan 101 (100k)
  (101, '2025-09-15', 100000, 10000, 'pending'),
  -- For loan 102 (50k)  
  (102, '2025-09-15', 50000, 5000, 'pending')
ON CONFLICT (loan_id, due_date) DO NOTHING;

-- Insert payment proof records
INSERT INTO payments (loan_id, amount, payment_type, proof_image_url, status, payment_date) VALUES
  (101, 0, 'initial', '/images/payment-proof-sample.png', 'pending', '2025-08-15'),
  (102, 0, 'initial', '/images/payment-proof-sample.png', 'pending', '2025-08-15')
ON CONFLICT DO NOTHING;
