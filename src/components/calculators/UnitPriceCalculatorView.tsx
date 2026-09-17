"use client";

import React, { useState, useMemo } from "react";
import { calculateUnitPrice, UnitPriceItem } from "@/lib/calculators";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

export function UnitPriceCalculatorView() {
  const [items, setItems] = useState<UnitPriceItem[]>([
    { id: "1", name: "상품 A (소용량)", price: 6500, quantity: 200, unit: "g" },
    { id: "2", name: "상품 B (대용량 벌크)", price: 24000, quantity: 1, unit: "kg" },
    { id: "3", name: "상품 C (묶음팩)", price: 12000, quantity: 500, unit: "g" },
  ]);

  const result = useMemo(() => {
    return calculateUnitPrice({ items });
  }, [items]);

  const handleAddItem = () => {
    const nextId = (items.length + 1).toString();
    setItems([
      ...items,
      { id: nextId, name: `상품 ${String.fromCharCode(65 + items.length)}`, price: 10000, quantity: 500, unit: "g" },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof UnitPriceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>비교 대상 상품군 등록</CardTitle>
            <CardDescription>가격과 용량(g, kg, ml, l, ea)을 입력하세요.</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={handleAddItem} className="gap-1">
            <Plus className="w-4 h-4" /> 추가
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.id} className="p-3 border rounded-xl space-y-2 bg-card/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">#{idx + 1}</span>
                <Input
                  className="h-8 text-sm font-semibold max-w-[200px]"
                  value={item.name}
                  onChange={(e) => handleUpdateItem(item.id, "name", e.target.value)}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={items.length <= 1}
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-destructive h-8 w-8 hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-muted-foreground">가격(원)</label>
                  <Input
                    className="h-8 text-xs"
                    type="number"
                    value={item.price}
                    onChange={(e) => handleUpdateItem(item.id, "price", Number(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground">용량/수량</label>
                  <Input
                    className="h-8 text-xs"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, "quantity", Number(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground">단위</label>
                  <select
                    className="h-8 w-full border rounded-md px-2 text-xs bg-background"
                    value={item.unit}
                    onChange={(e) => handleUpdateItem(item.id, "unit", e.target.value)}
                  >
                    <option value="g">g (그램)</option>
                    <option value="kg">kg (킬로그램)</option>
                    <option value="ml">ml (밀리리터)</option>
                    <option value="l">l (리터)</option>
                    <option value="ea">ea (개)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle>가성비 랭킹 결과</CardTitle>
          <CardDescription>동일 기준 단위(100g/100ml/1개)로 환산된 최저가 순위입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.rankedItems.map((item, idx) => {
            const isBest = idx === 0;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  isBest
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-card border-border/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        isBest ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-bold text-base">{item.name}</span>
                    {isBest && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                        가성비 최고
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-foreground">
                      {item.pricePerStandardUnit.toLocaleString()}원
                      <span className="text-xs font-normal text-muted-foreground"> / {item.normalizedUnit}</span>
                    </div>
                  </div>
                </div>

                {item.savingsPercentageVsWorst > 0 && (
                  <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    가장 비싼 옵션 대비 약 {item.savingsPercentageVsWorst}% 저렴!
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
