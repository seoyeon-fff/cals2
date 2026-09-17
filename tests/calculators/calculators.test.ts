import { describe, it, expect } from "vitest";
import {
  calculateSalary,
  calculateRentConversion,
  calculateLoanRepayment,
  calculateUnitPrice,
  calculateDutchPay,
  calculateSavingsInterest,
  calculateCompoundInterest,
  calculateDDay,
  calculateBrokerageFee,
  calculateBmr,
} from "../../src/lib/calculators";

describe("10 Calculator Engines Unit Tests", () => {
  // 1. 실수령액(월급) 계산기
  describe("1. Salary Net Pay Calculator", () => {
    it("연봉 5,000만원 기준 실수령액 및 4대보험 공제 정상 계산", () => {
      const res = calculateSalary({
        grossSalary: 50000000,
        isAnnual: true,
        nonTaxableAmount: 200000,
        dependentsCount: 1,
      });
      expect(res.grossMonthly).toBe(4166666);
      expect(res.nationalPension).toBeLessThanOrEqual(271350);
      expect(res.healthInsurance).toBeGreaterThan(0);
      expect(res.totalDeductions).toBeGreaterThan(0);
      expect(res.netPay).toBe(res.grossMonthly - res.totalDeductions);
    });
  });

  // 2. 전월세 변환 계산기
  describe("2. Rent vs. Jeonse Conversion Calculator", () => {
    it("전세 2억에서 보증금 5천만원으로 낮출 시 월세 전환 계산", () => {
      const res = calculateRentConversion({
        currentDeposit: 200000000,
        currentMonthlyRent: 0,
        targetDeposit: 50000000,
        conversionRate: 5.5,
      });
      // 1억 5천만원 * 0.055 / 12 = 687,500원
      expect(res.convertedMonthlyRent).toBe(687500);
      expect(res.appliedRate).toBe(5.5);
    });
  });

  // 3. 대출 원리금 상환 계산기
  describe("3. Loan Repayment Calculator", () => {
    it("원리금균등분할상환 스케줄 생성 및 총 상환액 검증", () => {
      const res = calculateLoanRepayment({
        principal: 10000000,
        annualRate: 5,
        termMonths: 12,
        repaymentType: "AMORTIZING",
      });
      expect(res.schedule.length).toBe(12);
      expect(res.totalRepayment).toBeGreaterThan(10000000);
      expect(res.totalRepayment).toBe(10000000 + res.totalInterest);
      expect(res.schedule[11].remainingPrincipal).toBe(0);
    });
  });

  // 4. 단위당 단가 비교 계산기
  describe("4. Unit Price Comparison Calculator", () => {
    it("용량/단위가 다른 품목의 100g/100ml 환산 후 가성비 랭킹 산출", () => {
      const res = calculateUnitPrice({
        items: [
          { id: "1", name: "대용량 고기", price: 30000, quantity: 1, unit: "kg" }, // 100g당 3000원
          { id: "2", name: "소용량 고기", price: 8000, quantity: 200, unit: "g" },  // 100g당 4000원
        ],
      });
      expect(res.rankedItems[0].id).toBe("1");
      expect(res.rankedItems[0].pricePerStandardUnit).toBe(3000);
      expect(res.rankedItems[1].pricePerStandardUnit).toBe(4000);
      expect(res.rankedItems[0].savingsPercentageVsWorst).toBe(25);
    });
  });

  // 5. N빵 및 잔돈 정산 계산기
  describe("5. Dutch Pay & Splitter", () => {
    it("공통 비용 및 주류 추가 지출자 차등 분할 및 100원 단위 절사", () => {
      const res = calculateDutchPay({
        totalAmount: 100000,
        participants: [
          { name: "철수", isIncludedInExtra: true },
          { name: "영희", isIncludedInExtra: true },
          { name: "민수", isIncludedInExtra: false },
          { name: "지수", isIncludedInExtra: false },
        ],
        extraAmount: 20000,
        roundUnit: 100,
        roundType: "ROUND",
      });
      expect(res.splits.length).toBe(4);
      const cheolsu = res.splits.find((s) => s.name === "철수");
      const minsu = res.splits.find((s) => s.name === "민수");
      expect(cheolsu!.amount).toBeGreaterThan(minsu!.amount);
    });
  });

  // 6. 예적금 이자 및 과세 계산기
  describe("6. Savings Interest Calculator", () => {
    it("정기예금 단리 1년 만기 일반과세(15.4%) 이자 계산", () => {
      const res = calculateSavingsInterest({
        productType: "DEPOSIT",
        amount: 10000000,
        annualRate: 4,
        periodMonths: 12,
        taxType: "NORMAL",
      });
      expect(res.totalPrincipal).toBe(10000000);
      expect(res.grossInterest).toBe(400000);
      expect(res.taxAmount).toBe(Math.floor(400000 * 0.154));
      expect(res.netPayout).toBe(10000000 + 400000 - res.taxAmount);
    });
  });

  // 7. 복리 투자 수익률 계산기
  describe("7. Compound Interest & CAGR Calculator", () => {
    it("초기 투자금 및 월 적립금 복리 수익 및 연차별 시뮬레이션", () => {
      const res = calculateCompoundInterest({
        initialPrincipal: 1000000,
        monthlyContribution: 100000,
        expectedAnnualReturn: 10,
        years: 3,
      });
      expect(res.yearlyProjections.length).toBe(3);
      expect(res.finalBalance).toBeGreaterThan(res.totalInvested);
      expect(res.totalProfit).toBe(res.finalBalance - res.totalInvested);
    });
  });

  // 8. D-Day 및 영업일 계산기
  describe("8. D-Day & Working Days Calculator", () => {
    it("두 날짜 간격 및 D-Day 문자열 포맷팅 검증", () => {
      const res = calculateDDay({
        startDate: "2026-09-01",
        endDate: "2026-09-11",
        excludeWeekends: true,
      });
      expect(res.dayDifference).toBe(10);
      expect(res.formattedDDayString).toBe("D-10");
      expect(res.businessDays).toBeLessThanOrEqual(11);
    });
  });

  // 9. 부동산 중개보수(복비) 계산기
  describe("9. Brokerage Fee Calculator", () => {
    it("주택 매매 5억원 거래 시 요율(0.4%) 적용 및 부가세 계산", () => {
      const res = calculateBrokerageFee({
        propertyType: "HOUSING",
        transactionType: "TRADE",
        tradeAmount: 500000000,
        isVatIncluded: true,
      });
      expect(res.appliedRate).toBe(0.4);
      expect(res.maxBrokerageFee).toBe(2000000);
      expect(res.vat).toBe(200000);
      expect(res.totalFeeWithVat).toBe(2200000);
    });
  });

  // 10. 기초대사량(BMR) 및 TDEE 계산기
  describe("10. BMR & Calorie Calculator", () => {
    it("Mifflin-St Jeor 공식 기초대사량 및 다이어트 칼로리 도출", () => {
      const res = calculateBmr({
        gender: "MALE",
        weightKg: 70,
        heightCm: 175,
        age: 30,
        activityLevel: 1.55,
        goal: "LOSE",
      });
      // BMR = 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75 -> 1649
      expect(res.bmr).toBe(1649);
      expect(res.tdee).toBe(Math.round(1649 * 1.55));
      expect(res.targetCalories).toBe(res.tdee - 500);
      expect(res.macroNutrients.proteinGrams).toBeGreaterThan(0);
    });
  });
});
