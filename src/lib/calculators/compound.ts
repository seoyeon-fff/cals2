import { CompoundInterestInput, CompoundInterestOutput, CompoundProjectionItem, compoundInterestInputSchema } from "./types";

/**
 * 7. 복리 투자 수익률(CAGR) 계산기 (Compound Interest & CAGR Calculator)
 */
export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestOutput {
  const validated = compoundInterestInputSchema.parse(input);
  const { initialPrincipal, monthlyContribution, expectedAnnualReturn, years } = validated;

  const monthlyRate = expectedAnnualReturn / 100 / 12;
  const totalMonths = Math.round(years * 12);

  let currentBalance = initialPrincipal;
  let totalInvested = initialPrincipal;
  const yearlyProjections: CompoundProjectionItem[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    currentBalance = currentBalance * (1 + monthlyRate) + monthlyContribution;
    totalInvested += monthlyContribution;

    if (m % 12 === 0 || m === totalMonths) {
      const year = Math.ceil(m / 12);
      const projectedBalance = Math.round(currentBalance);
      const investedSum = Math.round(totalInvested);
      const accumulatedInterest = projectedBalance - investedSum;

      // 같은 연도가 중복 추가되지 않도록 방지
      if (!yearlyProjections.find((p) => p.year === year)) {
        yearlyProjections.push({
          year,
          investedSum,
          projectedBalance,
          accumulatedInterest,
        });
      }
    }
  }

  const finalBalance = Math.round(currentBalance);
  const totalProfit = finalBalance - totalInvested;
  const profitRate =
    totalInvested > 0 ? Math.round((totalProfit / totalInvested) * 10000) / 100 : 0;

  return {
    totalInvested: Math.round(totalInvested),
    finalBalance,
    totalProfit,
    profitRate,
    yearlyProjections,
  };
}
