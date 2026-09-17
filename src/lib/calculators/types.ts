import { z } from "zod";

// 1. 실수령액(월급) 계산기
export const salaryInputSchema = z.object({
  grossSalary: z.number().nonnegative(),
  isAnnual: z.boolean(),
  nonTaxableAmount: z.number().nonnegative().default(200000),
  dependentsCount: z.number().int().positive().default(1),
});
export type SalaryInput = z.infer<typeof salaryInputSchema>;

export interface SalaryOutput {
  grossMonthly: number;
  totalDeductions: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  incomeTax: number;
  localIncomeTax: number;
  netPay: number;
}

// 2. 전월세 변환 계산기
export const rentConversionInputSchema = z.object({
  currentDeposit: z.number().nonnegative(),
  currentMonthlyRent: z.number().nonnegative(),
  targetDeposit: z.number().nonnegative(),
  conversionRate: z.number().positive(),
});
export type RentConversionInput = z.infer<typeof rentConversionInputSchema>;

export interface RentConversionOutput {
  convertedMonthlyRent: number;
  convertedDeposit: number;
  appliedRate: number;
}

// 3. 대출 원리금 상환 계산기
export const loanRepaymentInputSchema = z.object({
  principal: z.number().positive(),
  annualRate: z.number().positive(),
  termMonths: z.number().int().positive(),
  repaymentType: z.enum(["AMORTIZING", "EQUAL_PRINCIPAL", "BULLET"]),
});
export type LoanRepaymentInput = z.infer<typeof loanRepaymentInputSchema>;

export interface LoanScheduleItem {
  month: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingPrincipal: number;
}

export interface LoanRepaymentOutput {
  totalInterest: number;
  totalRepayment: number;
  schedule: LoanScheduleItem[];
}

// 4. 단위당 단가 비교 계산기
export const unitPriceItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().positive(),
  unit: z.enum(["g", "kg", "ml", "l", "ea"]),
});
export type UnitPriceItem = z.infer<typeof unitPriceItemSchema>;

export const unitPriceInputSchema = z.object({
  items: z.array(unitPriceItemSchema).min(1),
});
export type UnitPriceInput = z.infer<typeof unitPriceInputSchema>;

export interface RankedUnitPriceItem {
  id: string;
  name: string;
  normalizedUnit: string;
  pricePerStandardUnit: number;
  savingsPercentageVsWorst: number;
}

export interface UnitPriceOutput {
  rankedItems: RankedUnitPriceItem[];
}

// 5. N빵(더치페이) 및 잔돈 정산 계산기
export const dutchParticipantSchema = z.object({
  name: z.string().min(1),
  isIncludedInExtra: z.boolean(),
});
export type DutchParticipant = z.infer<typeof dutchParticipantSchema>;

export const dutchPayInputSchema = z.object({
  totalAmount: z.number().nonnegative(),
  participants: z.array(dutchParticipantSchema).min(1),
  extraAmount: z.number().nonnegative().default(0),
  roundUnit: z.number().int().positive().default(100),
  roundType: z.enum(["FLOOR", "CEIL", "ROUND"]).default("ROUND"),
});
export type DutchPayInput = z.infer<typeof dutchPayInputSchema>;

export interface DutchSplitItem {
  name: string;
  amount: number;
}

export interface DutchPayOutput {
  splits: DutchSplitItem[];
  discrepancy: number;
}

// 6. 예적금 이자 및 과세 계산기
export const savingsInterestInputSchema = z.object({
  productType: z.enum(["DEPOSIT", "SAVINGS"]),
  amount: z.number().positive(),
  annualRate: z.number().positive(),
  periodMonths: z.number().int().positive(),
  taxType: z.enum(["NORMAL", "PREFERENTIAL", "TAX_FREE"]),
});
export type SavingsInterestInput = z.infer<typeof savingsInterestInputSchema>;

export interface SavingsInterestOutput {
  totalPrincipal: number;
  grossInterest: number;
  taxAmount: number;
  netPayout: number;
}

// 7. 복리 투자 수익률(CAGR) 계산기
export const compoundInterestInputSchema = z.object({
  initialPrincipal: z.number().nonnegative(),
  monthlyContribution: z.number().nonnegative(),
  expectedAnnualReturn: z.number(),
  years: z.number().positive(),
});
export type CompoundInterestInput = z.infer<typeof compoundInterestInputSchema>;

export interface CompoundProjectionItem {
  year: number;
  investedSum: number;
  projectedBalance: number;
  accumulatedInterest: number;
}

export interface CompoundInterestOutput {
  totalInvested: number;
  finalBalance: number;
  totalProfit: number;
  profitRate: number;
  yearlyProjections: CompoundProjectionItem[];
}

// 8. D-Day 및 영업일 계산기
export const dDayInputSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  excludeWeekends: z.boolean().default(false),
});
export type DDayInput = z.infer<typeof dDayInputSchema>;

export interface DDayOutput {
  dayDifference: number;
  businessDays: number;
  totalWeeks: number;
  formattedDDayString: string;
}

// 9. 부동산 중개보수(복비) 계산기
export const brokerageFeeInputSchema = z.object({
  propertyType: z.enum(["HOUSING", "OFFICETEL", "NON_HOUSING"]),
  transactionType: z.enum(["TRADE", "RENT"]),
  tradeAmount: z.number().positive(),
  isVatIncluded: z.boolean().default(false),
});
export type BrokerageFeeInput = z.infer<typeof brokerageFeeInputSchema>;

export interface BrokerageFeeOutput {
  transactionAmount: number;
  appliedRate: number;
  limitAmount: number | null;
  maxBrokerageFee: number;
  vat: number;
  totalFeeWithVat: number;
}

// 10. 기초대사량(BMR) 및 TDEE 다이어트 계산기
export const bmrCalculatorInputSchema = z.object({
  gender: z.enum(["MALE", "FEMALE"]),
  weightKg: z.number().positive(),
  heightCm: z.number().positive(),
  age: z.number().int().positive(),
  activityLevel: z.union([
    z.literal(1.2),
    z.literal(1.375),
    z.literal(1.55),
    z.literal(1.725),
    z.literal(1.9),
  ]),
  goal: z.enum(["MAINTAIN", "LOSE", "GAIN"]),
});
export type BmrCalculatorInput = z.infer<typeof bmrCalculatorInputSchema>;

export interface BmrCalculatorOutput {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macroNutrients: {
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
  };
}
