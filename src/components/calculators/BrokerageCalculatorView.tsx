"use client";

import React, { useState, useMemo } from "react";
import { calculateBrokerageFee } from "@/lib/calculators";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BrokerageCalculatorView() {
  const [propertyType, setPropertyType] = useState<"HOUSING" | "OFFICETEL" | "NON_HOUSING">("HOUSING");
  const [transactionType, setTransactionType] = useState<"TRADE" | "RENT">("TRADE");
  const [amount, setAmount] = useState("500000000");
  const [isVatIncluded, setIsVatIncluded] = useState(true);

  const result = useMemo(() => {
    return calculateBrokerageFee({
      propertyType,
      transactionType,
      tradeAmount: Math.max(1, Number(amount) || 0),
      isVatIncluded,
    });
  }, [propertyType, transactionType, amount, isVatIncluded]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>부동산 거래 정보</CardTitle>
          <CardDescription>매물 유형과 거래 종류, 금액을 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>매물 유형</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPropertyType("HOUSING")}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  propertyType === "HOUSING"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                주택/아파트
              </button>
              <button
                type="button"
                onClick={() => setPropertyType("OFFICETEL")}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  propertyType === "OFFICETEL"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                오피스텔
              </button>
              <button
                type="button"
                onClick={() => setPropertyType("NON_HOUSING")}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  propertyType === "NON_HOUSING"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                토지/상가 등
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>거래 종류</Label>
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => setTransactionType("TRADE")}
                className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  transactionType === "TRADE" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                매매 / 교환
              </button>
              <button
                type="button"
                onClick={() => setTransactionType("RENT")}
                className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  transactionType === "RENT" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                전세 / 월세 임대차
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bAmount">거래 금액 (원, 월세는 환산보증금)</Label>
            <Input
              id="bAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {Number(amount) > 0 && `${(Number(amount) / 10000).toLocaleString()} 만원`}
            </p>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isVatIncluded}
                onChange={(e) => setIsVatIncluded(e.target.checked)}
                className="rounded border-border w-4 h-4 text-primary"
              />
              <span>일반과세자 부가세(10%) 포함 산출</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle>법정 중개보수 상한 요율</CardTitle>
          <CardDescription>공인중개사법 시행규칙 기준 법정 상한액입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
            <div className="text-xs text-muted-foreground font-medium mb-1">최대 중개보수(복비) 합계</div>
            <div className="text-3xl font-extrabold text-primary">
              {result.totalFeeWithVat.toLocaleString()} <span className="text-lg font-normal">원</span>
            </div>
            {isVatIncluded && (
              <div className="text-xs text-muted-foreground mt-1">
                (순수 중개수수료 {result.maxBrokerageFee.toLocaleString()}원 + VAT {result.vat.toLocaleString()}원)
              </div>
            )}
          </div>

          <div className="space-y-3 text-sm divide-y divide-border/50">
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">적용 상한 요율</span>
              <span className="font-semibold">{result.appliedRate}%</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">법정 한도액 제한</span>
              <span className="font-semibold">
                {result.limitAmount ? `${result.limitAmount.toLocaleString()} 원` : "한도액 없음"}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">중개보수(VAT 제외)</span>
              <span className="font-bold">{result.maxBrokerageFee.toLocaleString()} 원</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
