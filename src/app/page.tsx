"use client";

import React, { useState, useTransition } from "react";
import {
  SalaryCalculatorView,
  RentCalculatorView,
  LoanCalculatorView,
  UnitPriceCalculatorView,
  DutchPayCalculatorView,
  SavingsCalculatorView,
  CompoundCalculatorView,
  DDayCalculatorView,
  BrokerageCalculatorView,
  BmrCalculatorView,
} from "@/components/calculators";
import { ThemeToggle } from "@/components/theme-toggle";
import { CalculatorSkeleton } from "@/components/ui/skeleton";
import { FadeUpSection } from "@/components/fade-up-section";
import {
  Wallet,
  Home as HomeIcon,
  CreditCard,
  Scale,
  Users,
  PiggyBank,
  TrendingUp,
  Calendar,
  Building,
  Activity,
  Calculator,
  Search,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface CalculatorItem {
  id: string;
  name: string;
  category: "금융/자산" | "부동산/주거" | "일상/생활" | "건강/라이프";
  icon: React.ReactNode;
  tag: string;
  summary: string;
  badgeColor: string;
  component: React.ReactNode;
}

export default function Home() {
  const [expandedId, setExpandedId] = useState<string | null>("salary");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();

  const calculators: CalculatorItem[] = [
    {
      id: "salary",
      name: "실수령액(월급) 계산기",
      category: "금융/자산",
      icon: <Wallet className="w-5 h-5 text-indigo-500" />,
      tag: "급여/세금",
      summary: "연봉 및 월급 기준 4대 보험과 간이세액을 차감한 실제 입금액을 계산합니다.",
      badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      component: <SalaryCalculatorView />,
    },
    {
      id: "rent",
      name: "전월세 변환 계산기",
      category: "부동산/주거",
      icon: <HomeIcon className="w-5 h-5 text-blue-500" />,
      tag: "임대차/보증금",
      summary: "법정 전월세전환율을 반영해 전세 보증금과 월세 간 상호 환산 금액을 산출합니다.",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      component: <RentCalculatorView />,
    },
    {
      id: "loan",
      name: "대출 원리금 상환 계산기",
      category: "금융/자산",
      icon: <CreditCard className="w-5 h-5 text-violet-500" />,
      tag: "대출/상환",
      summary: "원리금균등, 원금균등, 만기일시 방식별 매월 상환액과 총 이자 스케줄을 확인합니다.",
      badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
      component: <LoanCalculatorView />,
    },
    {
      id: "unitPrice",
      name: "단위당 단가 비교 계산기",
      category: "일상/생활",
      icon: <Scale className="w-5 h-5 text-emerald-500" />,
      tag: "쇼핑/가성비",
      summary: "g, kg, ml, l, ea 등의 단위를 100g/100ml/개당 기준으로 환산하여 최저가 순위를 매깁니다.",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      component: <UnitPriceCalculatorView />,
    },
    {
      id: "dutchPay",
      name: "N빵·더치페이 정산기",
      category: "일상/생활",
      icon: <Users className="w-5 h-5 text-amber-500" />,
      tag: "모임/정산",
      summary: "주류 등 특정 참여자 차등 지출 분리 및 10원/100원 단위 절사와 총무 오차를 정산합니다.",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      component: <DutchPayCalculatorView />,
    },
    {
      id: "savings",
      name: "예적금 이자 및 과세 계산기",
      category: "금융/자산",
      icon: <PiggyBank className="w-5 h-5 text-teal-500" />,
      tag: "저축/만기",
      summary: "정기예금·적금 만기 이자 및 일반(15.4%), 우대(9.5%), 비과세 세후 수령액을 계산합니다.",
      badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
      component: <SavingsCalculatorView />,
    },
    {
      id: "compound",
      name: "복리 투자·CAGR 시뮬레이터",
      category: "금융/자산",
      icon: <TrendingUp className="w-5 h-5 text-cyan-500" />,
      tag: "재테크/복리",
      summary: "시드머니와 매월 적립금, 기대 수익률을 바탕으로 연차별 복리 자산 성장을 시뮬레이션합니다.",
      badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      component: <CompoundCalculatorView />,
    },
    {
      id: "dday",
      name: "D-Day 및 영업일 계산기",
      category: "일상/생활",
      icon: <Calendar className="w-5 h-5 text-rose-500" />,
      tag: "일정/근무일",
      summary: "UTC 기준 표준 날짜 차이, D-Day 카운트 및 주말을 제외한 순수 영업일 수를 산출합니다.",
      badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      component: <DDayCalculatorView />,
    },
    {
      id: "brokerage",
      name: "부동산 중개보수(복비) 계산기",
      category: "부동산/주거",
      icon: <Building className="w-5 h-5 text-orange-500" />,
      tag: "부동산/수수료",
      summary: "주택·오피스텔 매매 및 임대차 공인중개사법 법정 상한 요율과 한도액, 부가세를 계산합니다.",
      badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      component: <BrokerageCalculatorView />,
    },
    {
      id: "bmr",
      name: "BMR 및 TDEE 다이어트 계산기",
      category: "건강/라이프",
      icon: <Activity className="w-5 h-5 text-pink-500" />,
      tag: "건강/식단",
      summary: "Mifflin-St Jeor 기초대사량과 활동계수 TDEE, 목표별 하루 권장 칼로리 및 탄단지 분배를 도출합니다.",
      badgeColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
      component: <BmrCalculatorView />,
    },
  ];

  const categories = ["ALL", "금융/자산", "부동산/주거", "일상/생활", "건강/라이프"];

  const filteredCalculators = calculators.filter((calc) => {
    const matchesCat = selectedCategory === "ALL" || calc.category === selectedCategory;
    const matchesSearch =
      calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    startTransition(() => {
      setExpandedId((prev) => (prev === id ? null : id));
    });
  };

  return (
    <div className="min-h-screen grain-bg text-foreground flex flex-col selection:bg-indigo-500/20 relative">
      {/* Background Decorative Blur Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-80 sm:w-96 h-80 sm:h-96 bg-pink-500/10 dark:bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  INU 생활형 계산기
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                스마트하고 정확한 10종 생활밀착형 다목적 연산 플랫폼
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section with Fade-Up */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-8">
        <FadeUpSection className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>일상에 필요한 모든 공식과 계산을 한눈에</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-foreground">
            정확하고 투명한{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              스마트 라이프 계산기
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            원하는 계산기 카드를 클릭하면 상세 입력창과 정밀한 분석 결과가 확장됩니다.
          </p>
        </FadeUpSection>

        {/* Filter & Search Bar with Fade-Up */}
        <FadeUpSection delay={100} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between glass-card p-3 rounded-2xl">
            {/* Category Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {cat === "ALL" ? "전체 계산기" : cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="계산기 및 기능 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-background/50 border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
        </FadeUpSection>

        {/* Accordion Expandable Card Layout */}
        <div className="space-y-4">
          {filteredCalculators.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground space-y-2 animate-fade-up">
              <p className="text-base font-semibold">검색 조건과 일치하는 계산기가 없습니다.</p>
              <p className="text-xs">다른 검색어나 카테고리를 선택해 보세요.</p>
            </div>
          ) : (
            filteredCalculators.map((calc, index) => {
              const isExpanded = expandedId === calc.id;
              return (
                <FadeUpSection
                  key={calc.id}
                  delay={index * 60}
                  className="transition-transform duration-200"
                >
                  <div
                    className={`glass-card rounded-2xl transition-all duration-300 overflow-hidden ${
                      isExpanded
                        ? "ring-2 ring-indigo-500/50 shadow-xl shadow-indigo-500/5"
                        : "hover:shadow-md hover:border-white/60 dark:hover:border-white/20"
                    }`}
                  >
                    {/* Card Summary Header (Click to Toggle) */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(calc.id)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors hover:bg-white/30 dark:hover:bg-white/5 cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-white/70 dark:bg-white/10 flex items-center justify-center shadow-xs border border-white/40 dark:border-white/10 shrink-0">
                          {calc.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-heading font-bold text-sm sm:text-base text-foreground tracking-tight truncate">
                              {calc.name}
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${calc.badgeColor}`}
                            >
                              {calc.tag}
                            </span>
                            <span className="text-[11px] text-muted-foreground/80 hidden md:inline">
                              • {calc.category}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                            {calc.summary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-3 shrink-0">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hidden sm:flex items-center gap-1">
                          {isExpanded ? "접기" : "계산하기"}
                          {!isExpanded && <ArrowRight className="w-3.5 h-3.5" />}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center bg-muted/50 transition-transform duration-300 ${
                            isExpanded ? "rotate-180 bg-indigo-500/10 text-indigo-600" : "text-muted-foreground"
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </button>

                    {/* Expandable Body */}
                    {isExpanded && (
                      <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-border/40 animate-fade-up">
                        {isPending ? (
                          <CalculatorSkeleton />
                        ) : (
                          <div className="pt-2">{calc.component}</div>
                        )}
                      </div>
                    )}
                  </div>
                </FadeUpSection>
              );
            })
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-background/50 backdrop-blur-md mt-16 text-center text-xs text-muted-foreground space-y-2">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-medium text-foreground/80">
            Copyright INU 생활형 계산기 by Noh Seoyeon
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            생활밀착형 10종 표준 다목적 계산 엔진 (Pretendard & Montserrat Typography)
          </p>
        </div>
      </footer>
    </div>
  );
}
