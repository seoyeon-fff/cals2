import { UnitPriceInput, UnitPriceOutput, RankedUnitPriceItem, unitPriceInputSchema } from "./types";

/**
 * 4. 단위당 단가 비교 계산기 (Unit Price & Cost Comparison Calculator)
 */
export function calculateUnitPrice(input: UnitPriceInput): UnitPriceOutput {
  const validated = unitPriceInputSchema.parse(input);
  const { items } = validated;

  // 1. 단위를 기본 단위(g, ml, ea)로 정규화 및 기준 단위(100g, 100ml, 1ea) 가격 계산
  const processed = items.map((item) => {
    let baseQty = item.quantity;
    let standardQty = 1;
    let standardLabel = "";

    if (item.unit === "kg") {
      baseQty = item.quantity * 1000;
      standardQty = 100;
      standardLabel = "100g";
    } else if (item.unit === "g") {
      baseQty = item.quantity;
      standardQty = 100;
      standardLabel = "100g";
    } else if (item.unit === "l") {
      baseQty = item.quantity * 1000;
      standardQty = 100;
      standardLabel = "100ml";
    } else if (item.unit === "ml") {
      baseQty = item.quantity;
      standardQty = 100;
      standardLabel = "100ml";
    } else {
      // ea
      baseQty = item.quantity;
      standardQty = 1;
      standardLabel = "1개";
    }

    const pricePerBase = item.price / baseQty;
    const pricePerStandardUnit = Math.round(pricePerBase * standardQty * 100) / 100;

    return {
      id: item.id,
      name: item.name,
      normalizedUnit: standardLabel,
      pricePerStandardUnit,
    };
  });

  // 2. 가격 오름차순 정렬 (가장 저렴한 상품이 1위)
  processed.sort((a, b) => a.pricePerStandardUnit - b.pricePerStandardUnit);

  const worstPrice = processed[processed.length - 1]?.pricePerStandardUnit || 1;

  const rankedItems: RankedUnitPriceItem[] = processed.map((item) => {
    // 가장 비싼 것 대비 절약률 (%)
    const savingsPercentageVsWorst =
      worstPrice === 0
        ? 0
        : Math.round(((worstPrice - item.pricePerStandardUnit) / worstPrice) * 1000) / 10;

    return {
      ...item,
      savingsPercentageVsWorst: Math.max(0, savingsPercentageVsWorst),
    };
  });

  return {
    rankedItems,
  };
}
