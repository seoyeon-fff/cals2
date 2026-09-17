"use client";

import React, { useState, useMemo } from "react";
import { calculateRentConversion } from "@/lib/calculators";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RentCalculatorView() {
  const [currentDeposit, setCurrentDeposit] = useState("200000000");
  const [currentRent, setCurrentRent] = useState("0");
  const [targetDeposit, setTargetDeposit] = useState("50000000");
  const [rate, setRate] = useState("5.5");

  const result = useMemo(() => {
    return calculateRentConversion({
      currentDeposit: Number(currentDeposit) || 0,
      currentMonthlyRent: Number(currentRent) || 0,
      targetDeposit: Number(targetDeposit) || 0,
      conversionRate: Math.max(0.1, Number(rate) || 5.5),
    });
  }, [currentDeposit, currentRent, targetDeposit, rate]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>전월세 조건 입력</CardTitle>
          <CardDescription>현재 조건과 희망하는 목표 보증금을 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cDeposit">현재 보증금 (원)</Label>
            <Input
              id="cDeposit"
              type="number"
              value={currentDeposit}
              onChange={(e) => setCurrentDeposit(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {Number(currentDeposit) > 0 && `${(Number(currentDeposit) / 10000).toLocaleString()} 만원`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cRent">현재 월세 (원, 전세인 경우 0)</Label>
            <Input
              id="cRent"
              type="number"
              value={currentRent}
              onChange={(e) => setCurrentRent(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tDeposit">변경 목표 보증금 (원)</Label>
            <Input
              id="tDeposit"
              type="number"
              value={targetDeposit}
              onChange={(e) => setTargetDeposit(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {Number(targetDeposit) > 0 && `${(Number(targetDeposit) / 10000).toLocaleString()} 만원`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">전월세전환율 (%)</Label>
            <Input
              id="rate"
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">한국은행 기준금리 + 주택임대차보호법 권고 요율</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle>전환 계산 결과</CardTitle>
          <CardDescription>전월세전환율 {result.appliedRate}% 적용 결과입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <div className="text-xs text-muted-foreground font-medium mb-1">
              목표 보증금({(Number(targetDeposit) / 10000).toLocaleString()}만원) 변경 시 월세
            </div>
            <div className="text-3xl font-extrabold text-primary">
              {result.convertedMonthlyRent.toLocaleString()} <span className="text-lg font-normal">원 / 월</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              보증금 변동: {((Number(targetDeposit) - Number(currentDeposit)) / 10000).toLocaleString()} 만원
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="text-xs text-muted-foreground font-medium mb-1">
              현재 월세를 전세로 완전 전환 시 필요 보증금
            </div>
            <div className="text-2xl font-bold text-foreground">
              {result.convertedDeposit.toLocaleString()} <span className="text-base font-normal">원</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              월세 {Number(currentRent).toLocaleString()}원을 0원으로 낮추기 위한 순수 전세 환산가
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
