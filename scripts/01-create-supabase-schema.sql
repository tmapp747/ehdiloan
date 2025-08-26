-- Create users table for profiles
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('lender', 'broker')),
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loan_requests table
CREATE TABLE IF NOT EXISTS public.loan_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  borrower_name TEXT NOT NULL,
  borrower_phone TEXT NOT NULL,
  borrower_address TEXT,
  loan_amount DECIMAL(15,2) NOT NULL,
  purpose TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  broker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loans table (approved loan requests become loans)
CREATE TABLE IF NOT EXISTS public.loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_request_id UUID REFERENCES public.loan_requests(id) ON DELETE CASCADE,
  borrower_name TEXT NOT NULL,
  borrower_phone TEXT NOT NULL,
  principal_amount DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,2) DEFAULT 10.00,
  penalty_rate DECIMAL(5,2) DEFAULT 5.00,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted')),
  start_date DATE NOT NULL,
  broker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES public.loans(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('principal', 'interest', 'penalty')),
  payment_method TEXT CHECK (payment_method IN ('gcash', 'maya')),
  proof_image_url TEXT,
  payment_date DATE NOT NULL,
  due_date DATE,
  is_late BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for loan_requests table
CREATE POLICY "Brokers can view their own requests" ON public.loan_requests
  FOR SELECT USING (auth.uid() = broker_id);

CREATE POLICY "Lenders can view all requests" ON public.loan_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'lender'
    )
  );

CREATE POLICY "Brokers can create requests" ON public.loan_requests
  FOR INSERT WITH CHECK (auth.uid() = broker_id);

CREATE POLICY "Lenders can update request status" ON public.loan_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'lender'
    )
  );

-- RLS Policies for loans table
CREATE POLICY "Users can view loans they're involved in" ON public.loans
  FOR SELECT USING (auth.uid() = broker_id OR auth.uid() = lender_id);

CREATE POLICY "Lenders can create loans" ON public.loans
  FOR INSERT WITH CHECK (auth.uid() = lender_id);

CREATE POLICY "Lenders can update loans" ON public.loans
  FOR UPDATE USING (auth.uid() = lender_id);

-- RLS Policies for payments table
CREATE POLICY "Users can view payments for their loans" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.loans 
      WHERE loans.id = payments.loan_id 
      AND (loans.broker_id = auth.uid() OR loans.lender_id = auth.uid())
    )
  );

CREATE POLICY "Users can create payments for their loans" ON public.payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.loans 
      WHERE loans.id = payments.loan_id 
      AND (loans.broker_id = auth.uid() OR loans.lender_id = auth.uid())
    )
  );
