"use client";

import React, { useState, useMemo } from "react";
import { calculateDutchPay, DutchParticipant } from "@/lib/calculators";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function DutchPayCalculatorView() {
  const [totalAmount, setTotalAmount] = useState("125000");
  const [extraAmount, setExtraAmount] = useState("35000");
  const [roundUnit, setRoundUnit] = useState("100");
  const [roundType, setRoundType] = useState<"FLOOR" | "CEIL" | "ROUND">("ROUND");
  const [participants, setParticipants] = useState<DutchParticipant[]>([
    { name: "참여자 A", isIncludedInExtra: true },
    { name: "참여자 B", isIncludedInExtra: true },
    { name: "참여자 C", isIncludedInExtra: false },
    { name: "참여자 D", isIncludedInExtra: false },
  ]);

  const result = useMemo(() => {
    return calculateDutchPay({
      totalAmount: Number(totalAmount) || 0,
      participants,
      extraAmount: Number(extraAmount) || 0,
      roundUnit: Number(roundUnit) || 100,
      roundType,
    });
  }, [totalAmount, participants, extraAmount, roundUnit, roundType]);

  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      { name: `참여자 ${String.fromCharCode(65 + participants.length)}`, isIncludedInExtra: false },
    ]);
  };

  const handleRemoveParticipant = (index: number) => {
    if (participants.length <= 1) return;
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleToggleExtra = (index: number) => {
    setParticipants(
      participants.map((p, i) => (i === index ? { ...p, isIncludedInExtra: !p.isIncludedInExtra } : p))
    );
  };

  const handleNameChange = (index: number, name: string) => {
    setParticipants(
      participants.map((p, i) => (i === index ? { ...p, name } : p))
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>정산 금액 및 인원 설정</CardTitle>
          <CardDescription>전체 금액과 주류 등 특정 차등 금액을 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="total">총 결제 금액 (원)</Label>
            <Input
              id="total"
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extra">차등 지출액 (예: 술값, 추가 메뉴 등, 원)</Label>
            <Input
              id="extra"
              type="number"
              value={extraAmount}
              onChange={(e) => setExtraAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">차등 금액 체크된 인원들끼리만 N빵 배분됩니다.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">끝전 절사 단위</Label>
              <select
                className="h-9 w-full border rounded-md px-2 text-xs bg-background"
                value={roundUnit}
                onChange={(e) => setRoundUnit(e.target.value)}
              >
                <option value="1">1원 단위 (정확히)</option>
                <option value="10">10원 단위</option>
                <option value="100">100원 단위</option>
                <option value="1000">1,000원 단위</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">끝전 처리 방식</Label>
              <select
                className="h-9 w-full border rounded-md px-2 text-xs bg-background"
                value={roundType}
                onChange={(e) => setRoundType(e.target.value as any)}
              >
                <option value="ROUND">반올림</option>
                <option value="FLOOR">내림(절사)</option>
                <option value="CEIL">올림</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold">정산 참여자 ({participants.length}명)</Label>
              <Button size="sm" variant="outline" onClick={handleAddParticipant} className="h-7 text-xs gap-1">
                <Plus className="w-3.5 h-3.5" /> 인원 추가
              </Button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {participants.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border">
                  <Input
                    className="h-8 text-xs flex-1"
                    value={p.name}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                  />
                  <label className="flex items-center gap-1 text-xs cursor-pointer select-none text-muted-foreground hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={p.isIncludedInExtra}
                      onChange={() => handleToggleExtra(idx)}
                      className="rounded border-border"
                    />
                    차등포함
                  </label>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={participants.length <= 1}
                    onClick={() => handleRemoveParticipant(idx)}
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20 flex flex-col">
        <CardHeader>
          <CardTitle>개인별 분담 금액 결과</CardTitle>
          <CardDescription>각 참여자별 최종 송금액 및 오차 내역입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            {result.splits.map((s, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border bg-card flex items-center justify-between shadow-xs"
              >
                <div className="font-semibold text-sm">{s.name}</div>
                <div className="text-lg font-extrabold text-primary">
                  {s.amount.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">원</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-muted/60 border text-xs space-y-1">
            <div className="flex justify-between font-medium">
              <span>참여자 걷은 금액 합계</span>
              <span>{result.splits.reduce((acc, cur) => acc + cur.amount, 0).toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>끝전 처리로 인한 오차 잔액</span>
              <span className={result.discrepancy !== 0 ? "text-amber-600 font-bold" : ""}>
                {result.discrepancy > 0
                  ? `총무가 ${result.discrepancy.toLocaleString()}원 더 냄 (덜 걷힘)`
                  : result.discrepancy < 0
                  ? `총무가 ${Math.abs(result.discrepancy).toLocaleString()}원 남음 (더 걷힘)`
                  : "0원 (정확히 일치)"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
