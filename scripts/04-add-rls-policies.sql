-- Adding Row Level Security policies for all tables
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

-- Loan requests policies - brokers can create, lenders can view all
CREATE POLICY "loan_requests_select_all" ON loan_requests FOR SELECT USING (true);
CREATE POLICY "loan_requests_insert_broker" ON loan_requests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'broker')
);
CREATE POLICY "loan_requests_update_lender" ON loan_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'lender')
);

-- Loans policies - lenders can manage, brokers can view their own
CREATE POLICY "loans_select_related" ON loans FOR SELECT USING (
  auth.uid() = lender_id OR auth.uid() = broker_id
);
CREATE POLICY "loans_insert_lender" ON loans FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'lender')
);
CREATE POLICY "loans_update_lender" ON loans FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'lender')
);

-- Payments policies - related to loan participants
CREATE POLICY "payments_select_related" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM loans WHERE id = loan_id AND (lender_id = auth.uid() OR broker_id = auth.uid()))
);
CREATE POLICY "payments_insert_related" ON payments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM loans WHERE id = loan_id AND (lender_id = auth.uid() OR broker_id = auth.uid()))
);
CREATE POLICY "payments_update_lender" ON payments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM loans WHERE id = loan_id AND lender_id = auth.uid())
);
