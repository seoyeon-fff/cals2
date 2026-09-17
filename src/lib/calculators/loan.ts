import { LoanRepaymentInput, LoanRepaymentOutput, LoanScheduleItem, loanRepaymentInputSchema } from "./types";

/**
 * 3. 대출 원리금 상환 계산기 (Loan Repayment Calculator)
 */
export function calculateLoanRepayment(input: LoanRepaymentInput): LoanRepaymentOutput {
  const validated = loanRepaymentInputSchema.parse(input);
  const { principal, annualRate, termMonths, repaymentType } = validated;

  const monthlyRate = annualRate / 100 / 12;
  const schedule: LoanScheduleItem[] = [];
  let remainingPrincipal = principal;
  let totalInterest = 0;

  if (repaymentType === "AMORTIZING") {
    // 원리금균등분할상환
    const monthlyPayment =
      monthlyRate === 0
        ? principal / termMonths
        : (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
          (Math.pow(1 + monthlyRate, termMonths) - 1);

    for (let month = 1; month <= termMonths; month++) {
      const interest = Math.round(remainingPrincipal * monthlyRate);
      let principalPay = Math.round(monthlyPayment - interest);
      if (month === termMonths || remainingPrincipal - principalPay < 0) {
        principalPay = remainingPrincipal;
      }
      const actualPayment = principalPay + interest;
      remainingPrincipal = Math.max(0, remainingPrincipal - principalPay);
      totalInterest += interest;

      schedule.push({
        month,
        principalPayment: principalPay,
        interestPayment: interest,
        totalPayment: actualPayment,
        remainingPrincipal,
      });
    }
  } else if (repaymentType === "EQUAL_PRINCIPAL") {
    // 원금균등분할상환
    const basePrincipalPay = Math.floor(principal / termMonths);
    for (let month = 1; month <= termMonths; month++) {
      const interest = Math.round(remainingPrincipal * monthlyRate);
      const principalPay = month === termMonths ? remainingPrincipal : basePrincipalPay;
      const actualPayment = principalPay + interest;
      remainingPrincipal = Math.max(0, remainingPrincipal - principalPay);
      totalInterest += interest;

      schedule.push({
        month,
        principalPayment: principalPay,
        interestPayment: interest,
        totalPayment: actualPayment,
        remainingPrincipal,
      });
    }
  } else {
    // 만기일시상환 (BULLET)
    const monthlyInterest = Math.round(principal * monthlyRate);
    for (let month = 1; month <= termMonths; month++) {
      const isLast = month === termMonths;
      const principalPay = isLast ? principal : 0;
      const interest = monthlyInterest;
      const actualPayment = principalPay + interest;
      remainingPrincipal = isLast ? 0 : principal;
      totalInterest += interest;

      schedule.push({
        month,
        principalPayment: principalPay,
        interestPayment: interest,
        totalPayment: actualPayment,
        remainingPrincipal,
      });
    }
  }

  const totalRepayment = principal + totalInterest;

  return {
    totalInterest,
    totalRepayment,
    schedule,
  };
}
