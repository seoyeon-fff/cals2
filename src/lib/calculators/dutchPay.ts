import { DutchPayInput, DutchPayOutput, dutchPayInputSchema } from "./types";

/**
 * 5. N빵(더치페이) 및 잔돈 정산 계산기 (Dutch Pay & Splitter)
 */
export function calculateDutchPay(input: DutchPayInput): DutchPayOutput {
  const validated = dutchPayInputSchema.parse(input);
  const { totalAmount, participants, extraAmount, roundUnit, roundType } = validated;

  const totalMembers = participants.length;
  if (totalMembers === 0) {
    return { splits: [], discrepancy: 0 };
  }

  const extraMembers = participants.filter((p) => p.isIncludedInExtra).length;
  const commonBase = Math.max(0, totalAmount - extraAmount);

  const commonPerMember = commonBase / totalMembers;
  const extraPerMember = extraMembers > 0 ? extraAmount / extraMembers : 0;

  const roundFn = (val: number, unit: number, type: "FLOOR" | "CEIL" | "ROUND") => {
    if (unit <= 1) return Math.round(val);
    if (type === "FLOOR") return Math.floor(val / unit) * unit;
    if (type === "CEIL") return Math.ceil(val / unit) * unit;
    return Math.round(val / unit) * unit;
  };

  let sumCalculated = 0;
  const splits = participants.map((p) => {
    const rawTotal = commonPerMember + (p.isIncludedInExtra ? extraPerMember : 0);
    const rounded = roundFn(rawTotal, roundUnit, roundType);
    sumCalculated += rounded;
    return {
      name: p.name,
      amount: rounded,
    };
  });

  // 오차(총 지출액 - 실제 정산 합계)
  // discrepancy > 0이면 덜 걷힌 금액, < 0이면 더 걷힌 금액
  const discrepancy = totalAmount - sumCalculated;

  return {
    splits,
    discrepancy,
  };
}
