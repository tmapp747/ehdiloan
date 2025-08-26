-- Added production user credentials and comprehensive seed data
-- Production Users Setup Instructions:
-- 1. Run this script to create the database structure and sample data
-- 2. Manually create these users in Supabase Auth Dashboard or through the app:
--    - ehdiwin@747ph.live (password: Loan@2025) - Role: lender
--    - bossmarc@747ph.live (password: Loan@2025) - Role: broker

-- Insert sample loan requests
INSERT INTO public.loan_requests (
  borrower_name, 
  borrower_phone, 
  borrower_address, 
  loan_amount, 
  purpose, 
  status,
  created_at
) VALUES 
(
  'Jericho Santos', 
  '09182156660', 
  '123 Main St, Manila', 
  50000.00, 
  'Business Capital', 
  'pending',
  '2025-08-26 10:00:00+08'
);

-- Insert sample running loans (will be linked to users after auth setup)
-- These represent the loans for Boyong with amounts 100k and 50k
INSERT INTO public.loans (
  borrower_name,
  borrower_phone,
  borrower_address,
  principal_amount,
  interest_rate,
  penalty_rate,
  loan_term_months,
  status,
  disbursement_date,
  created_at
) VALUES 
(
  'Boyong Cruz',
  '09182156660',
  '456 Business Ave, Quezon City',
  100000.00,
  10.00,
  5.00,
  12,
  'active',
  '2025-08-15 09:00:00+08',
  '2025-08-15 09:00:00+08'
),
(
  'Boyong Cruz',
  '09182156660',
  '456 Business Ave, Quezon City',
  50000.00,
  10.00,
  5.00,
  12,
  'active',
  '2025-08-15 09:00:00+08',
  '2025-08-15 09:00:00+08'
);

-- Insert payment schedules for the running loans
-- Note: loan_id will need to be updated after loans are created
-- Payment due dates start from September 15, 2025 (30 days after disbursement)
INSERT INTO public.payment_schedules (
  loan_id,
  due_date,
  principal_amount,
  interest_amount,
  total_amount,
  status
) VALUES 
-- For 100k loan (assuming loan_id = 1)
(1, '2025-09-15', 8333.33, 10000.00, 18333.33, 'pending'),
(1, '2025-10-15', 8333.33, 10000.00, 18333.33, 'pending'),
(1, '2025-11-15', 8333.33, 10000.00, 18333.33, 'pending'),
(1, '2025-12-15', 8333.33, 10000.00, 18333.33, 'pending'),
(1, '2026-01-15', 8333.33, 10000.00, 18333.33, 'pending'),
(1, '2026-02-15', 8333.33, 10000.00, 18333.33, 'pending'),
(1, '2026-03-15', 8333.33, 10000.00, 18333.33, 'pending'),
(1, '2026-04-15', 8333.33, 10000.00, 18333.33, 'pending'),
(1, '2026-05-15', 8333.33, 10000.00, 18333.33, 'pending'),
(1, '2026-06-15', 8333.33, 10000.00, 18333.33, 'pending'),
(1, '2026-07-15', 8333.33, 10000.00, 18333.33, 'pending'),
(1, '2026-08-15', 8333.37, 10000.00, 18333.37, 'pending'),

-- For 50k loan (assuming loan_id = 2)
(2, '2025-09-15', 4166.67, 5000.00, 9166.67, 'pending'),
(2, '2025-10-15', 4166.67, 5000.00, 9166.67, 'pending'),
(2, '2025-11-15', 4166.67, 5000.00, 9166.67, 'pending'),
(2, '2025-12-15', 4166.67, 5000.00, 9166.67, 'pending'),
(2, '2026-01-15', 4166.67, 5000.00, 9166.67, 'pending'),
(2, '2026-02-15', 4166.67, 5000.00, 9166.67, 'pending'),
(2, '2026-03-15', 4166.67, 5000.00, 9166.67, 'pending'),
(2, '2026-04-15', 4166.67, 5000.00, 9166.67, 'pending'),
(2, '2026-05-15', 4166.67, 5000.00, 9166.67, 'pending'),
(2, '2026-06-15', 4166.67, 5000.00, 9166.67, 'pending'),
(2, '2026-07-15', 4166.67, 5000.00, 9166.67, 'pending'),
(2, '2026-08-15', 4166.63, 5000.00, 9166.63, 'pending');

-- Insert sample payment proof records
INSERT INTO public.payments (
  loan_id,
  schedule_id,
  amount_paid,
  payment_method,
  proof_image_url,
  status,
  payment_date,
  created_at
) VALUES 
(1, 1, 18333.33, 'gcash', '/images/payment-proof-sample.png', 'verified', '2025-09-15 14:30:00+08', '2025-09-15 14:30:00+08'),
(2, 13, 9166.67, 'maya', '/images/payment-proof-sample.png', 'verified', '2025-09-15 15:00:00+08', '2025-09-15 15:00:00+08');

-- Update payment schedules to reflect paid status
UPDATE public.payment_schedules SET status = 'paid' WHERE id IN (1, 13);
