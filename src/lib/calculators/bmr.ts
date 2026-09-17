import { BmrCalculatorInput, BmrCalculatorOutput, bmrCalculatorInputSchema } from "./types";

/**
 * 10. 기초대사량(BMR) 및 TDEE 다이어트 계산기 (BMR & Calorie Calculator)
 * Mifflin-St Jeor Formula
 */
export function calculateBmr(input: BmrCalculatorInput): BmrCalculatorOutput {
  const validated = bmrCalculatorInputSchema.parse(input);
  const { gender, weightKg, heightCm, age, activityLevel, goal } = validated;

  // BMR = 10 * weight + 6.25 * height - 5 * age + S (남성: +5, 여성: -161)
  const s = gender === "MALE" ? 5 : -161;
  const rawBmr = 10 * weightKg + 6.25 * heightCm - 5 * age + s;
  const bmr = Math.round(rawBmr);

  // TDEE = BMR * activityLevel
  const tdee = Math.round(bmr * activityLevel);

  // 목표 권장 칼로리 (감량: -500kcal, 증량: +500kcal, 유지: 그대로)
  let deltaGoal = 0;
  if (goal === "LOSE") {
    deltaGoal = -500;
  } else if (goal === "GAIN") {
    deltaGoal = 500;
  }
  const targetCalories = Math.max(1000, tdee + deltaGoal);

  // 탄단지 5:2:3 또는 4:3:3 표준 권장 비율 기반 g수 환산
  // 탄수화물 50% (4kcal/g), 단백질 25% (4kcal/g), 지방 25% (9kcal/g)
  const carbsGrams = Math.round((targetCalories * 0.5) / 4);
  const proteinGrams = Math.round((targetCalories * 0.25) / 4);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);

  return {
    bmr,
    tdee,
    targetCalories,
    macroNutrients: {
      carbsGrams,
      proteinGrams,
      fatGrams,
    },
  };
}
