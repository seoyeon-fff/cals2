"use client";

import React, { useState, useMemo } from "react";
import { calculateDDay } from "@/lib/calculators";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DDayCalculatorView() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const nextMonthStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(nextMonthStr);
  const [excludeWeekends, setExcludeWeekends] = useState(true);

  const result = useMemo(() => {
    return calculateDDay({
      startDate,
      endDate,
      excludeWeekends,
    });
  }, [startDate, endDate, excludeWeekends]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>날짜 및 영업일 설정</CardTitle>
          <CardDescription>기준일과 목표일, 주말 제외 여부를 선택하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sDate">시작 기준일</Label>
            <Input
              id="sDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eDate">종료 목표일</Label>
            <Input
              id="eDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={excludeWeekends}
                onChange={(e) => setExcludeWeekends(e.target.checked)}
                className="rounded border-border w-4 h-4 text-primary"
              />
              <span>주말(토/일요일) 제외하고 영업일(Workdays)만 계산</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle>D-Day 및 기간 산출</CardTitle>
          <CardDescription>UTC 기준 표준 날짜 차이 계산 결과입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
            <div className="text-xs text-muted-foreground font-medium mb-1">D-Day 카운트</div>
            <div className="text-4xl font-black text-primary tracking-tight">
              {result.formattedDDayString}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              총 {Math.abs(result.dayDifference)}일 차이 ({result.totalWeeks}주일 + {Math.abs(result.dayDifference) % 7}일)
            </div>
          </div>

          <div className="space-y-3 text-sm divide-y divide-border/50">
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">캘린더 단순 일수 차이</span>
              <span className="font-semibold">{Math.abs(result.dayDifference)} 일</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">순수 영업일 (주말 제외)</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {result.businessDays} 일
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">소요 주차 (Weeks)</span>
              <span className="font-semibold">{result.totalWeeks} 주</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
