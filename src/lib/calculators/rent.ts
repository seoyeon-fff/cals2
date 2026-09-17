import { RentConversionInput, RentConversionOutput, rentConversionInputSchema } from "./types";

/**
 * 2. 전월세 변환 계산기 (Rent vs. Jeonse Conversion Calculator)
 */
export function calculateRentConversion(input: RentConversionInput): RentConversionOutput {
  const validated = rentConversionInputSchema.parse(input);
  const { currentDeposit, currentMonthlyRent, targetDeposit, conversionRate } = validated;

  const depositDelta = currentDeposit - targetDeposit;
  // 월세 변환: 목표 보증금 기준 예상 월세
  // TargetMonthlyRent = currentMonthlyRent + (depositDelta * (conversionRate / 100) / 12)
  const convertedMonthlyRent = Math.round(
    currentMonthlyRent + (depositDelta * (conversionRate / 100)) / 12
  );

  // 전세 변환: 현재 월세를 모두 보증금으로 바꿀 때 필요한 추가 보증금 계산
  // TargetDeposit = currentDeposit + (currentMonthlyRent * 12) / (conversionRate / 100)
  const convertedDeposit = Math.round(
    currentDeposit + (currentMonthlyRent * 12) / (conversionRate / 100)
  );

  return {
    convertedMonthlyRent: Math.max(0, convertedMonthlyRent),
    convertedDeposit: Math.max(0, convertedDeposit),
    appliedRate: conversionRate,
  };
}
