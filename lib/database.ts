// Database utility functions for EhdiLoan
export interface User {
  id: number
  name: string
  email: string
  role: "lender" | "broker"
  created_at: string
  updated_at: string
}

export interface LoanRequest {
  id: number
  broker_id: number
  borrower_name: string
  borrower_contact?: string
  loan_amount: number
  purpose?: string
  status: "pending" | "approved" | "rejected"
  requested_at: string
  reviewed_at?: string
  reviewed_by?: number
  broker_name?: string
}

export interface Loan {
  id: number
  request_id: number
  loan_amount: number
  interest_rate: number
  penalty_rate: number
  loan_term_months: number
  monthly_payment: number
  start_date: string
  status: "active" | "completed" | "defaulted"
  created_at: string
  borrower_name?: string
}

export interface PaymentSchedule {
  id: number
  loan_id: number
  due_date: string
  amount_due: number
  principal_amount: number
  interest_amount: number
  penalty_amount: number
  status: "pending" | "paid" | "overdue"
  created_at: string
}

export interface Payment {
  id: number
  loan_id: number
  schedule_id?: number
  amount_paid: number
  payment_method: string
  payment_proof_url?: string
  payment_date: string
  verified_by?: number
  verified_at?: string
  status: "pending" | "verified" | "rejected"
}

// Utility function to calculate monthly payment
export function calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  const monthlyRate = annualRate / 100 / 12
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
  return Math.round(payment * 100) / 100
}

// Utility function to calculate penalty
export function calculatePenalty(originalAmount: number, penaltyRate: number): number {
  return Math.round(originalAmount * (penaltyRate / 100) * 100) / 100
}

// Calculate monthly interest amount (10% monthly as per requirements)
export function calculateMonthlyInterest(principal: number, interestRate = 10): number {
  return Math.round(principal * (interestRate / 100) * 100) / 100
}

// Calculate penalty for late payment (5% of overdue amount)
export function calculateLatePenalty(overdueAmount: number, penaltyRate = 5): number {
  return Math.round(overdueAmount * (penaltyRate / 100) * 100) / 100
}

// Calculate accumulated penalty for multiple late payments
export function calculateAccumulatedPenalty(originalAmount: number, daysLate: number, penaltyRate = 5): number {
  // Penalty accumulates monthly (every 30 days)
  const monthsLate = Math.ceil(daysLate / 30)
  let totalPenalty = 0
  let currentAmount = originalAmount

  for (let i = 0; i < monthsLate; i++) {
    const penalty = calculateLatePenalty(currentAmount, penaltyRate)
    totalPenalty += penalty
    currentAmount += penalty // Penalty compounds on next calculation
  }

  return Math.round(totalPenalty * 100) / 100
}

// Generate payment schedule for a loan
export function generatePaymentSchedule(
  loanAmount: number,
  interestRate: number,
  termMonths: number,
  startDate: Date,
): PaymentScheduleItem[] {
  const schedule: PaymentScheduleItem[] = []
  let remainingBalance = loanAmount
  const monthlyInterest = interestRate / 100
  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate * 12, termMonths)

  for (let month = 1; month <= termMonths; month++) {
    const interestAmount = Math.round(remainingBalance * monthlyInterest * 100) / 100
    const principalAmount = Math.round((monthlyPayment - interestAmount) * 100) / 100

    // Adjust last payment to handle rounding differences
    const adjustedPrincipal = month === termMonths ? remainingBalance : principalAmount
    const adjustedPayment = interestAmount + adjustedPrincipal

    const dueDate = new Date(startDate)
    dueDate.setMonth(dueDate.getMonth() + month)

    schedule.push({
      month,
      dueDate: dueDate.toISOString().split("T")[0],
      totalPayment: Math.round(adjustedPayment * 100) / 100,
      principalAmount: Math.round(adjustedPrincipal * 100) / 100,
      interestAmount,
      remainingBalance: Math.round((remainingBalance - adjustedPrincipal) * 100) / 100,
      status: "pending",
    })

    remainingBalance -= adjustedPrincipal
  }

  return schedule
}

// Calculate total amount due including penalties for overdue payments
export function calculateTotalAmountDue(
  originalPayment: number,
  dueDate: string,
  interestRate = 10,
  penaltyRate = 5,
): PaymentCalculation {
  const today = new Date()
  const paymentDueDate = new Date(dueDate)
  const daysLate = Math.max(0, Math.floor((today.getTime() - paymentDueDate.getTime()) / (1000 * 60 * 60 * 24)))

  let totalDue = originalPayment
  let penaltyAmount = 0
  const isOverdue = daysLate > 0

  if (isOverdue) {
    penaltyAmount = calculateAccumulatedPenalty(originalPayment, daysLate, penaltyRate)
    totalDue = originalPayment + penaltyAmount
  }

  return {
    originalAmount: originalPayment,
    penaltyAmount,
    totalAmountDue: totalDue,
    daysLate,
    isOverdue,
    penaltyRate,
    interestRate,
  }
}

// Calculate loan summary with all financial details
export function calculateLoanSummary(
  loanAmount: number,
  interestRate: number,
  termMonths: number,
  paymentsMade: PaymentRecord[] = [],
): LoanSummary {
  const totalInterestAmount = calculateMonthlyInterest(loanAmount, interestRate) * termMonths
  const totalLoanAmount = loanAmount + totalInterestAmount
  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate * 12, termMonths)

  const totalPaid = paymentsMade.reduce((sum, payment) => sum + payment.amount, 0)
  const totalPenaltiesPaid = paymentsMade.reduce((sum, payment) => sum + (payment.penaltyAmount || 0), 0)
  const remainingBalance = Math.max(0, totalLoanAmount - totalPaid)

  return {
    originalLoanAmount: loanAmount,
    totalInterestAmount,
    totalLoanAmount,
    monthlyPayment,
    totalPaid,
    totalPenaltiesPaid,
    remainingBalance,
    paymentsMade: paymentsMade.length,
    paymentsRemaining: Math.max(0, termMonths - paymentsMade.length),
    interestRate,
    termMonths,
  }
}

// Calculate next payment details with any accumulated penalties
export function calculateNextPayment(
  monthlyPayment: number,
  lastPaymentDate: string,
  interestRate = 10,
  penaltyRate = 5,
): NextPaymentDetails {
  const lastPayment = new Date(lastPaymentDate)
  const nextDueDate = new Date(lastPayment)
  nextDueDate.setMonth(nextDueDate.getMonth() + 1)

  const paymentCalculation = calculateTotalAmountDue(
    monthlyPayment,
    nextDueDate.toISOString().split("T")[0],
    interestRate,
    penaltyRate,
  )

  return {
    dueDate: nextDueDate.toISOString().split("T")[0],
    baseAmount: monthlyPayment,
    penaltyAmount: paymentCalculation.penaltyAmount,
    totalAmountDue: paymentCalculation.totalAmountDue,
    daysUntilDue: Math.ceil((nextDueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    isOverdue: paymentCalculation.isOverdue,
  }
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount)
}

// Format date for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Format datetime for display
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export interface PaymentScheduleItem {
  month: number
  dueDate: string
  totalPayment: number
  principalAmount: number
  interestAmount: number
  remainingBalance: number
  status: "pending" | "paid" | "overdue"
}

export interface PaymentCalculation {
  originalAmount: number
  penaltyAmount: number
  totalAmountDue: number
  daysLate: number
  isOverdue: boolean
  penaltyRate: number
  interestRate: number
}

export interface LoanSummary {
  originalLoanAmount: number
  totalInterestAmount: number
  totalLoanAmount: number
  monthlyPayment: number
  totalPaid: number
  totalPenaltiesPaid: number
  remainingBalance: number
  paymentsMade: number
  paymentsRemaining: number
  interestRate: number
  termMonths: number
}

export interface NextPaymentDetails {
  dueDate: string
  baseAmount: number
  penaltyAmount: number
  totalAmountDue: number
  daysUntilDue: number
  isOverdue: boolean
}

export interface PaymentRecord {
  amount: number
  paymentDate: string
  penaltyAmount?: number
}
