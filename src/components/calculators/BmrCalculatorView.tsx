"use client";

import React, { useState, useMemo } from "react";
import { calculateBmr } from "@/lib/calculators";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BmrCalculatorView() {
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [weightKg, setWeightKg] = useState("72");
  const [heightCm, setHeightCm] = useState("176");
  const [age, setAge] = useState("29");
  const [activityLevel, setActivityLevel] = useState<number>(1.55);
  const [goal, setGoal] = useState<"MAINTAIN" | "LOSE" | "GAIN">("LOSE");

  const result = useMemo(() => {
    return calculateBmr({
      gender,
      weightKg: Math.max(10, Number(weightKg) || 70),
      heightCm: Math.max(50, Number(heightCm) || 170),
      age: Math.max(10, Number(age) || 25),
      activityLevel: activityLevel as any,
      goal,
    });
  }, [gender, weightKg, heightCm, age, activityLevel, goal]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>신체 스펙 및 활동량 설정</CardTitle>
          <CardDescription>Mifflin-St Jeor 기반 대사량 산출 공식이 적용됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>성별</Label>
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => setGender("MALE")}
                className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  gender === "MALE" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                남성 (+5 S수치)
              </button>
              <button
                type="button"
                onClick={() => setGender("FEMALE")}
                className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  gender === "FEMALE" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                여성 (-161 S수치)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs" htmlFor="weight">체중 (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs" htmlFor="height">신장 (cm)</Label>
              <Input
                id="height"
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs" htmlFor="age">나이 (만)</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>평소 활동량 수준</Label>
            <select
              className="h-9 w-full border rounded-md px-2 text-xs bg-background"
              value={activityLevel}
              onChange={(e) => setActivityLevel(Number(e.target.value))}
            >
              <option value="1.2">거의 운동하지 않음 (좌식 생활, 계수 1.2)</option>
              <option value="1.375">가벼운 활동 (주 1~3회 가벼운 운동, 계수 1.375)</option>
              <option value="1.55">보통 활동 (주 3~5회 중강도 운동, 계수 1.55)</option>
              <option value="1.725">강한 활동 (주 6~7회 고강도 운동, 계수 1.725)</option>
              <option value="1.9">선수급 활동 (매일 극고강도 훈련, 계수 1.9)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>체중 조절 목표</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGoal("LOSE")}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  goal === "LOSE"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                체중 감량 (-500kcal)
              </button>
              <button
                type="button"
                onClick={() => setGoal("MAINTAIN")}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  goal === "MAINTAIN"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                현재 유지 (유지칼로리)
              </button>
              <button
                type="button"
                onClick={() => setGoal("GAIN")}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  goal === "GAIN"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                체중 증량 (+500kcal)
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle>대사량 및 식단 가이드</CardTitle>
          <CardDescription>목표 달성을 위한 권장 일일 칼로리 및 탄단지 분배입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
            <div className="text-xs text-muted-foreground font-medium mb-1">하루 권장 섭취 칼로리</div>
            <div className="text-3xl font-extrabold text-primary">
              {result.targetCalories.toLocaleString()} <span className="text-lg font-normal">kcal</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              기초대사량(BMR) {result.bmr.toLocaleString()} kcal | 유지에너지(TDEE) {result.tdee.toLocaleString()} kcal
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border space-y-3">
            <div className="text-xs font-bold text-muted-foreground">권장 탄/단/지 일일 영양성분 분배</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">탄수화물 (50%)</div>
                <div className="text-lg font-bold text-foreground mt-1">{result.macroNutrients.carbsGrams}g</div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">단백질 (25%)</div>
                <div className="text-lg font-bold text-foreground mt-1">{result.macroNutrients.proteinGrams}g</div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">지방 (25%)</div>
                <div className="text-lg font-bold text-foreground mt-1">{result.macroNutrients.fatGrams}g</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
