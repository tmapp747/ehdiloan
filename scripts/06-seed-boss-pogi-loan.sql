-- Seed Boss Pogi loan data with payment receipts
-- Loan: ₱150,000 dated Aug 15, 2025, due Sept 15, 2025

-- Insert loan request (approved)
INSERT INTO loan_requests (
  id,
  borrower_name,
  borrower_phone,
  loan_amount,
  purpose,
  status,
  requested_by,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Boss Pogi',
  '09182156660',
  150000.00,
  'Business Capital',
  'approved',
  (SELECT id FROM users WHERE email = 'bossmarc@747ph.live'),
  '2025-08-15 08:43:00+00',
  '2025-08-15 08:43:00+00'
);

-- Insert the approved loan
INSERT INTO loans (
  id,
  request_id,
  borrower_name,
  borrower_phone,
  principal_amount,
  interest_rate,
  total_amount,
  loan_date,
  due_date,
  status,
  approved_by,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM loan_requests WHERE borrower_name = 'Boss Pogi' AND borrower_phone = '09182156660'),
  'Boss Pogi',
  '09182156660',
  150000.00,
  0.10,
  165000.00, -- Principal + 10% interest
  '2025-08-15',
  '2025-09-15',
  'active',
  (SELECT id FROM users WHERE email = 'ehdiwin@747ph.live'),
  '2025-08-15 08:43:00+00',
  '2025-08-15 08:43:00+00'
);

-- Insert payment schedule
INSERT INTO payment_schedules (
  id,
  loan_id,
  due_date,
  amount_due,
  principal_amount,
  interest_amount,
  penalty_amount,
  status,
  created_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM loans WHERE borrower_name = 'Boss Pogi' AND borrower_phone = '09182156660'),
  '2025-09-15',
  165000.00,
  150000.00,
  15000.00,
  0.00,
  'pending',
  '2025-08-15 08:43:00+00'
);

-- Insert payment proofs (disbursement receipts)
INSERT INTO payments (
  id,
  loan_id,
  amount,
  payment_date,
  payment_method,
  reference_number,
  proof_image_url,
  status,
  payment_type,
  created_at
) VALUES 
(
  gen_random_uuid(),
  (SELECT id FROM loans WHERE borrower_name = 'Boss Pogi' AND borrower_phone = '09182156660'),
  100000.00,
  '2025-08-15 20:43:00+00',
  'GCash',
  '8031 706 727516',
  '/images/payment-proof-100k.png',
  'verified',
  'disbursement',
  '2025-08-15 20:43:00+00'
),
(
  gen_random_uuid(),
  (SELECT id FROM loans WHERE borrower_name = 'Boss Pogi' AND borrower_phone = '09182156660'),
  50000.00,
  '2025-08-20 13:05:00+00',
  'GCash',
  '2031 846 438032',
  '/images/payment-proof-50k.png',
  'verified',
  'disbursement',
  '2025-08-20 13:05:00+00'
);
