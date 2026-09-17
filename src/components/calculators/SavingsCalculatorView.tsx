"use client";

import React, { useState, useMemo } from "react";
import { calculateSavingsInterest } from "@/lib/calculators";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SavingsCalculatorView() {
  const [productType, setProductType] = useState<"DEPOSIT" | "SAVINGS">("DEPOSIT");
  const [amount, setAmount] = useState("10000000");
  const [annualRate, setAnnualRate] = useState("3.8");
  const [periodMonths, setPeriodMonths] = useState("12");
  const [taxType, setTaxType] = useState<"NORMAL" | "PREFERENTIAL" | "TAX_FREE">("NORMAL");

  const result = useMemo(() => {
    return calculateSavingsInterest({
      productType,
      amount: Math.max(1, Number(amount) || 0),
      annualRate: Math.max(0.1, Number(annualRate) || 0),
      periodMonths: Math.max(1, Number(periodMonths) || 1),
      taxType,
    });
  }, [productType, amount, annualRate, periodMonths, taxType]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>예적금 가입 조건</CardTitle>
          <CardDescription>상품 유형(예금 vs 적금)과 이자율, 과세 방식을 지정하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => setProductType("DEPOSIT")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                productType === "DEPOSIT" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              정기예금 (목돈 굴리기)
            </button>
            <button
              type="button"
              onClick={() => setProductType("SAVINGS")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                productType === "SAVINGS" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              정기적금 (매달 모으기)
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{productType === "DEPOSIT" ? "예치 금액 (원)" : "월 납입 금액 (원)"}</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {Number(amount) > 0 && `${(Number(amount) / 10000).toLocaleString()} 만원`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">연이자율 (%)</Label>
            <Input
              id="rate"
              type="number"
              step="0.1"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">가입 기간 (개월)</Label>
            <Input
              id="period"
              type="number"
              value={periodMonths}
              onChange={(e) => setPeriodMonths(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>과세 구분</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTaxType("NORMAL")}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  taxType === "NORMAL"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                일반과세 (15.4%)
              </button>
              <button
                type="button"
                onClick={() => setTaxType("PREFERENTIAL")}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  taxType === "PREFERENTIAL"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                세금우대 (9.5%)
              </button>
              <button
                type="button"
                onClick={() => setTaxType("TAX_FREE")}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  taxType === "TAX_FREE"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                비과세 (0%)
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle>만기 지급액 계산 결과</CardTitle>
          <CardDescription>원금과 세후 실수령 이자 합산 결과입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
            <div className="text-xs text-muted-foreground font-medium mb-1">만기 실수령액 (원금+세후이자)</div>
            <div className="text-3xl font-extrabold text-primary">
              {result.netPayout.toLocaleString()} <span className="text-lg font-normal">원</span>
            </div>
          </div>

          <div className="space-y-3 text-sm divide-y divide-border/50">
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">총 납입 원금</span>
              <span className="font-semibold">{result.totalPrincipal.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">세전 총 이자</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                +{result.grossInterest.toLocaleString()} 원
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">이자 소득세 차감</span>
              <span className="font-semibold text-rose-500">
                -{result.taxAmount.toLocaleString()} 원
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">세후 순수령 이자</span>
              <span className="font-bold text-foreground">
                {(result.grossInterest - result.taxAmount).toLocaleString()} 원
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
