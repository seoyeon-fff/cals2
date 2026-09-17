"use client";

import React, { useState, useMemo } from "react";
import { calculateSalary } from "@/lib/calculators";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SalaryCalculatorView() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [salaryInput, setSalaryInput] = useState("50000000");
  const [nonTaxable, setNonTaxable] = useState("200000");
  const [dependents, setDependents] = useState("1");

  const result = useMemo(() => {
    const grossSalary = Number(salaryInput) || 0;
    const nonTaxableAmount = Number(nonTaxable) || 0;
    const dependentsCount = Math.max(1, Number(dependents) || 1);

    return calculateSalary({
      grossSalary,
      isAnnual,
      nonTaxableAmount,
      dependentsCount,
    });
  }, [salaryInput, isAnnual, nonTaxable, dependents]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>급여 및 공제 조건 입력</CardTitle>
          <CardDescription>계약 연봉 또는 월급과 비과세액을 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                isAnnual ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              연봉 기준
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                !isAnnual ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              월급 기준
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">{isAnnual ? "연봉 (원)" : "월 기본급 (원)"}</Label>
            <Input
              id="salary"
              type="number"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              placeholder="예: 50000000"
            />
            <p className="text-xs text-muted-foreground">
              {Number(salaryInput) > 0 && `${(Number(salaryInput) / 10000).toLocaleString()} 만원`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nonTaxable">비과세액 (식대 등, 원)</Label>
            <Input
              id="nonTaxable"
              type="number"
              value={nonTaxable}
              onChange={(e) => setNonTaxable(e.target.value)}
              placeholder="예: 200000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependents">부양가족 수 (본인 포함)</Label>
            <Input
              id="dependents"
              type="number"
              min="1"
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle>예상 실수령액 결과</CardTitle>
          <CardDescription>월 기준 예상 수령액 및 세부 공제 내역입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
            <div className="text-xs text-muted-foreground font-medium mb-1">월 예상 실수령액</div>
            <div className="text-3xl font-extrabold text-primary">
              {result.netPay.toLocaleString()} <span className="text-lg font-normal">원</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              월 환산 급여 {result.grossMonthly.toLocaleString()}원 - 총 공제액 {result.totalDeductions.toLocaleString()}원
            </div>
          </div>

          <div className="space-y-2 text-sm divide-y divide-border/50">
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">국민연금 (4.5%, 상한반영)</span>
              <span className="font-semibold">{result.nationalPension.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">건강보험 (3.545%)</span>
              <span className="font-semibold">{result.healthInsurance.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">장기요양보험 (건보의 12.95%)</span>
              <span className="font-semibold">{result.longTermCare.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">고용보험 (0.9%)</span>
              <span className="font-semibold">{result.employmentInsurance.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">근로소득세 (간이세액 추정)</span>
              <span className="font-semibold">{result.incomeTax.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">지방소득세 (소득세의 10%)</span>
              <span className="font-semibold">{result.localIncomeTax.toLocaleString()} 원</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
