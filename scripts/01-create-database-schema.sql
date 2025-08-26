-- EhdiLoan Database Schema
-- Create tables for loan management system

-- Users table for Boss Edwin and Boss Marc
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('lender', 'broker')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan requests table
CREATE TABLE IF NOT EXISTS loan_requests (
    id SERIAL PRIMARY KEY,
    broker_id INTEGER REFERENCES users(id),
    borrower_name VARCHAR(100) NOT NULL,
    borrower_contact VARCHAR(50),
    loan_amount DECIMAL(12, 2) NOT NULL,
    purpose TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id)
);

-- Approved loans table
CREATE TABLE IF NOT EXISTS loans (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES loan_requests(id),
    loan_amount DECIMAL(12, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) DEFAULT 10.00,
    penalty_rate DECIMAL(5, 2) DEFAULT 5.00,
    loan_term_months INTEGER DEFAULT 12,
    monthly_payment DECIMAL(12, 2) NOT NULL,
    start_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment schedule table
CREATE TABLE IF NOT EXISTS payment_schedule (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER REFERENCES loans(id),
    due_date DATE NOT NULL,
    amount_due DECIMAL(12, 2) NOT NULL,
    principal_amount DECIMAL(12, 2) NOT NULL,
    interest_amount DECIMAL(12, 2) NOT NULL,
    penalty_amount DECIMAL(12, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER REFERENCES loans(id),
    schedule_id INTEGER REFERENCES payment_schedule(id),
    amount_paid DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_proof_url TEXT,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected'))
);

-- Insert default users
INSERT INTO users (name, email, role) VALUES 
('Boss Edwin', 'edwin@ehdiloan.com', 'lender'),
('Boss Marc', 'marc@ehdiloan.com', 'broker')
ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_loan_requests_broker_id ON loan_requests(broker_id);
CREATE INDEX IF NOT EXISTS idx_loan_requests_status ON loan_requests(status);
CREATE INDEX IF NOT EXISTS idx_loans_request_id ON loans(request_id);
CREATE INDEX IF NOT EXISTS idx_payment_schedule_loan_id ON payment_schedule(loan_id);
CREATE INDEX IF NOT EXISTS idx_payments_loan_id ON payments(loan_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
