"use client";

import React, { useState, useMemo } from "react";
import { calculateLoanRepayment } from "@/lib/calculators";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoanCalculatorView() {
  const [principal, setPrincipal] = useState("100000000");
  const [rate, setRate] = useState("4.5");
  const [termMonths, setTermMonths] = useState("120");
  const [repaymentType, setRepaymentType] = useState<"AMORTIZING" | "EQUAL_PRINCIPAL" | "BULLET">("AMORTIZING");

  const result = useMemo(() => {
    return calculateLoanRepayment({
      principal: Math.max(1, Number(principal) || 10000000),
      annualRate: Math.max(0.1, Number(rate) || 4.5),
      termMonths: Math.max(1, Number(termMonths) || 12),
      repaymentType,
    });
  }, [principal, rate, termMonths, repaymentType]);

  const firstMonthPayment = result.schedule[0]?.totalPayment || 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>대출 조건 입력</CardTitle>
          <CardDescription>원금, 이자율, 기간 및 상환 방식을 선택하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principal">대출 원금 (원)</Label>
            <Input
              id="principal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {Number(principal) > 0 && `${(Number(principal) / 10000).toLocaleString()} 만원`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">연이자율 (%)</Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="term">상환 기간 (개월)</Label>
            <Input
              id="term"
              type="number"
              value={termMonths}
              onChange={(e) => setTermMonths(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {Number(termMonths) > 0 && `${(Number(termMonths) / 12).toFixed(1)} 년`}
            </p>
          </div>

          <div className="space-y-2">
            <Label>상환 방식</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRepaymentType("AMORTIZING")}
                className={`py-2 px-1 text-xs sm:text-sm font-medium rounded-lg border transition-all ${
                  repaymentType === "AMORTIZING"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                원리금균등
              </button>
              <button
                type="button"
                onClick={() => setRepaymentType("EQUAL_PRINCIPAL")}
                className={`py-2 px-1 text-xs sm:text-sm font-medium rounded-lg border transition-all ${
                  repaymentType === "EQUAL_PRINCIPAL"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                원금균등
              </button>
              <button
                type="button"
                onClick={() => setRepaymentType("BULLET")}
                className={`py-2 px-1 text-xs sm:text-sm font-medium rounded-lg border transition-all ${
                  repaymentType === "BULLET"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                만기일시
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20 flex flex-col">
        <CardHeader>
          <CardTitle>상환 요약 및 스케줄</CardTitle>
          <CardDescription>총 이자비용과 월별 납입금 추산치입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20">
              <div className="text-xs text-muted-foreground font-medium mb-1">첫 달 상환액</div>
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {firstMonthPayment.toLocaleString()} <span className="text-xs font-normal">원</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-muted border border-border">
              <div className="text-xs text-muted-foreground font-medium mb-1">총 대출 이자</div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {result.totalInterest.toLocaleString()} <span className="text-xs font-normal">원</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-card border border-border text-xs flex justify-between">
            <span className="text-muted-foreground">총 상환금액 (원금+이자)</span>
            <span className="font-bold">{result.totalRepayment.toLocaleString()} 원</span>
          </div>

          <div className="flex-1 min-h-[220px] max-h-[260px] overflow-y-auto border border-border rounded-lg text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/70 sticky top-0">
                <tr>
                  <th className="p-2 border-b">회차</th>
                  <th className="p-2 border-b">월 상환액</th>
                  <th className="p-2 border-b">납입원금</th>
                  <th className="p-2 border-b">이자</th>
                  <th className="p-2 border-b">잔액</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.slice(0, 36).map((item) => (
                  <tr key={item.month} className="border-b border-border/40 hover:bg-muted/30">
                    <td className="p-2 font-medium">{item.month}회</td>
                    <td className="p-2">{item.totalPayment.toLocaleString()}</td>
                    <td className="p-2 text-muted-foreground">{item.principalPayment.toLocaleString()}</td>
                    <td className="p-2 text-muted-foreground">{item.interestPayment.toLocaleString()}</td>
                    <td className="p-2 font-mono">{item.remainingPrincipal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.schedule.length > 36 && (
            <p className="text-[11px] text-muted-foreground text-center">
              * 초기 36회차 스케줄이 미리보기로 표시됩니다.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
