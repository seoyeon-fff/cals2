import { BrokerageFeeInput, BrokerageFeeOutput, brokerageFeeInputSchema } from "./types";

/**
 * 9. 부동산 중개보수(복비) 계산기 (Real Estate Brokerage Fee Calculator)
 * 공인중개사법 시행규칙 기준 요율 및 한도액
 */
export function calculateBrokerageFee(input: BrokerageFeeInput): BrokerageFeeOutput {
  const validated = brokerageFeeInputSchema.parse(input);
  const { propertyType, transactionType, tradeAmount, isVatIncluded } = validated;

  let appliedRate = 0;
  let limitAmount: number | null = null;

  if (propertyType === "HOUSING") {
    if (transactionType === "TRADE") {
      // 주택 매매/교환
      if (tradeAmount < 50000000) {
        appliedRate = 0.006;
        limitAmount = 250000;
      } else if (tradeAmount < 200000000) {
        appliedRate = 0.005;
        limitAmount = 800000;
      } else if (tradeAmount < 900000000) {
        appliedRate = 0.004;
        limitAmount = null;
      } else if (tradeAmount < 1200000000) {
        appliedRate = 0.005;
        limitAmount = null;
      } else if (tradeAmount < 1500000000) {
        appliedRate = 0.006;
        limitAmount = null;
      } else {
        appliedRate = 0.007;
        limitAmount = null;
      }
    } else {
      // 주택 임대차 등 (전월세)
      if (tradeAmount < 50000000) {
        appliedRate = 0.005;
        limitAmount = 200000;
      } else if (tradeAmount < 100000000) {
        appliedRate = 0.004;
        limitAmount = 300000;
      } else if (tradeAmount < 600000000) {
        appliedRate = 0.003;
        limitAmount = null;
      } else if (tradeAmount < 1200000000) {
        appliedRate = 0.004;
        limitAmount = null;
      } else if (tradeAmount < 1500000000) {
        appliedRate = 0.005;
        limitAmount = null;
      } else {
        appliedRate = 0.006;
        limitAmount = null;
      }
    }
  } else if (propertyType === "OFFICETEL") {
    // 주거용 오피스텔 기준 (전용면적 85m2 이하 등 일반적인 기준)
    if (transactionType === "TRADE") {
      appliedRate = 0.005;
    } else {
      appliedRate = 0.004;
    }
  } else {
    // 그 외 토지, 상가 등 일반 부동산 (0.9% 이내 협의)
    appliedRate = 0.009;
  }

  let calculatedFee = Math.floor(tradeAmount * appliedRate);
  if (limitAmount !== null && calculatedFee > limitAmount) {
    calculatedFee = limitAmount;
  }

  const vat = isVatIncluded ? Math.floor(calculatedFee * 0.1) : 0;
  const totalFeeWithVat = calculatedFee + vat;

  return {
    transactionAmount: tradeAmount,
    appliedRate: appliedRate * 100, // 백분율(%)로 반환
    limitAmount,
    maxBrokerageFee: calculatedFee,
    vat,
    totalFeeWithVat,
  };
}
