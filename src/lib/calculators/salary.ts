import { SalaryInput, SalaryOutput, salaryInputSchema } from "./types";

/**
 * 1. 실수령액(월급) 계산기 (Salary Net Pay Calculator)
 * 2024~2025 기준 간이세액 추정 공식 적용
 */
export function calculateSalary(input: SalaryInput): SalaryOutput {
  const validated = salaryInputSchema.parse(input);
  const { grossSalary, isAnnual, nonTaxableAmount, dependentsCount } = validated;

  const grossMonthly = isAnnual ? Math.floor(grossSalary / 12) : Math.floor(grossSalary);
  const taxableAmount = Math.max(0, grossMonthly - nonTaxableAmount);

  // 국민연금: 4.5%, 상한액 271,350원 (기준소득월액 상한선 적용)
  const nationalPension = Math.floor(Math.min(taxableAmount * 0.045, 271350));

  // 건강보험: 3.545%
  const healthInsurance = Math.floor(taxableAmount * 0.03545);

  // 장기요양보험: 건강보험료의 12.95%
  const longTermCare = Math.floor(healthInsurance * 0.1295);

  // 고용보험: 0.9%
  const employmentInsurance = Math.floor(taxableAmount * 0.009);

  // 간이세액 근사 모델: 과세표준 구간 누진세율 및 부양가족 공제
  let approxIncomeTax = 0;
  if (taxableAmount > 1060000) {
    if (taxableAmount <= 3000000) {
      approxIncomeTax = (taxableAmount - 1060000) * 0.04;
    } else if (taxableAmount <= 5000000) {
      approxIncomeTax = 77600 + (taxableAmount - 3000000) * 0.12;
    } else if (taxableAmount <= 10000000) {
      approxIncomeTax = 317600 + (taxableAmount - 5000000) * 0.20;
    } else {
      approxIncomeTax = 1317600 + (taxableAmount - 10000000) * 0.30;
    }
    // 부양가족 공제 감면 추정치 (부양가족당 약 15,000원 감면)
    if (dependentsCount > 1) {
      approxIncomeTax = Math.max(0, approxIncomeTax - (dependentsCount - 1) * 15000);
    }
  }
  const incomeTax = Math.floor(Math.max(0, approxIncomeTax));
  const localIncomeTax = Math.floor(incomeTax * 0.1);

  const totalDeductions =
    nationalPension +
    healthInsurance +
    longTermCare +
    employmentInsurance +
    incomeTax +
    localIncomeTax;

  const netPay = grossMonthly - totalDeductions;

  return {
    grossMonthly,
    totalDeductions,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localIncomeTax,
    netPay,
  };
}
