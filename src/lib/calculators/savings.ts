import { SavingsInterestInput, SavingsInterestOutput, savingsInterestInputSchema } from "./types";

/**
 * 6. 예적금 이자 및 과세 계산기 (Savings & Deposit Interest Calculator)
 */
export function calculateSavingsInterest(input: SavingsInterestInput): SavingsInterestOutput {
  const validated = savingsInterestInputSchema.parse(input);
  const { productType, amount, annualRate, periodMonths, taxType } = validated;

  let grossInterest = 0;
  let totalPrincipal = 0;

  if (productType === "DEPOSIT") {
    // 정기예금 (단리): P * (annualRate/100) * (n/12)
    totalPrincipal = amount;
    grossInterest = amount * (annualRate / 100) * (periodMonths / 12);
  } else {
    // 정기적금 (단리, 월초납입): P * (annualRate/100) * (n*(n+1)/24)
    totalPrincipal = amount * periodMonths;
    grossInterest = amount * (annualRate / 100) * ((periodMonths * (periodMonths + 1)) / 24);
  }

  grossInterest = Math.round(grossInterest);

  let taxRate = 0.154; // NORMAL
  if (taxType === "PREFERENTIAL") {
    taxRate = 0.095;
  } else if (taxType === "TAX_FREE") {
    taxRate = 0;
  }

  const taxAmount = Math.floor(grossInterest * taxRate);
  const netPayout = totalPrincipal + grossInterest - taxAmount;

  return {
    totalPrincipal,
    grossInterest,
    taxAmount,
    netPayout,
  };
}
