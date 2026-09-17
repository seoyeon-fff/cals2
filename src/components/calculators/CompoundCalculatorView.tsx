"use client";

import React, { useState, useMemo } from "react";
import { calculateCompoundInterest } from "@/lib/calculators";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CompoundCalculatorView() {
  const [initialPrincipal, setInitialPrincipal] = useState("5000000");
  const [monthlyContribution, setMonthlyContribution] = useState("500000");
  const [annualReturn, setAnnualReturn] = useState("8.0");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    return calculateCompoundInterest({
      initialPrincipal: Number(initialPrincipal) || 0,
      monthlyContribution: Number(monthlyContribution) || 0,
      expectedAnnualReturn: Number(annualReturn) || 0,
      years: Math.max(1, Number(years) || 1),
    });
  }, [initialPrincipal, monthlyContribution, annualReturn, years]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>투자 플랜 설정</CardTitle>
          <CardDescription>초기 시드머니, 월 적립액, 기대 수익률을 설정하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cPrincipal">초기 투자 원금 (원)</Label>
            <Input
              id="cPrincipal"
              type="number"
              value={initialPrincipal}
              onChange={(e) => setInitialPrincipal(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {Number(initialPrincipal) > 0 && `${(Number(initialPrincipal) / 10000).toLocaleString()} 만원`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly">매월 추가 적립액 (원)</Label>
            <Input
              id="monthly"
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {Number(monthlyContribution) > 0 && `${(Number(monthlyContribution) / 10000).toLocaleString()} 만원`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cRate">연간 기대 수익률 (%)</Label>
            <Input
              id="cRate"
              type="number"
              step="0.1"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years">투자 기간 (년)</Label>
            <Input
              id="years"
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20 flex flex-col">
        <CardHeader>
          <CardTitle>복리 자산 시뮬레이션</CardTitle>
          <CardDescription>총 납입 원금 대비 복리 증식 효과입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20">
              <div className="text-xs text-muted-foreground font-medium mb-1">최종 예상 자산</div>
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {result.finalBalance.toLocaleString()} <span className="text-xs font-normal">원</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-xs text-muted-foreground font-medium mb-1">복리 총 수익금 ({result.profitRate}%)</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                +{result.totalProfit.toLocaleString()} <span className="text-xs font-normal">원</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-card border border-border text-xs flex justify-between">
            <span className="text-muted-foreground">내가 직접 넣은 총 원금</span>
            <span className="font-bold">{result.totalInvested.toLocaleString()} 원</span>
          </div>

          <div className="flex-1 min-h-[180px] max-h-[220px] overflow-y-auto border border-border rounded-lg text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/70 sticky top-0">
                <tr>
                  <th className="p-2 border-b">연차</th>
                  <th className="p-2 border-b">누적 투자원금</th>
                  <th className="p-2 border-b">평가 잔고</th>
                  <th className="p-2 border-b">누적 수익</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyProjections.map((item) => (
                  <tr key={item.year} className="border-b border-border/40 hover:bg-muted/30">
                    <td className="p-2 font-medium">{item.year}년차</td>
                    <td className="p-2 text-muted-foreground">{item.investedSum.toLocaleString()}</td>
                    <td className="p-2 font-bold">{item.projectedBalance.toLocaleString()}</td>
                    <td className="p-2 text-emerald-600 dark:text-emerald-400 font-medium">
                      +{item.accumulatedInterest.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
