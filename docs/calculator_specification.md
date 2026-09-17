# 생활밀착형 다목적 계산기 엔진 기능 명세서 (Functional Specification)

AI 코딩 에이전트(Cursor, Claude Code, Windsurf, v0 등)가 즉시 로직 구현 및 단위 테스트를 수행할 수 있도록 입·출력 인터페이스, 도메인 공식, 예외 처리 규칙 및 사용 방법을 표준화한 명세서입니다.

---

## 1. 기능별 세부 구현 명세

### 1.1. 실수령액(월급) 계산기 (Salary Net Pay Calculator)

- **설명**: 계약 연봉(또는 월 기본급)과 비과세액, 부양가족 수를 기반으로 4대 보험 및 근로소득세(간이세액표 기준)를 차감한 실지급액을 산출합니다.
- **입력 파라미터 (Input Specs)**:
  - `grossSalary` (number): 월 급여액 또는 연봉 (KRW)
  - `isAnnual` (boolean): 연봉 여부 (`true`: 연봉, `false`: 월급)
  - `nonTaxableAmount` (number, default: `200000`): 비과세 식대 등 (KRW)
  - `dependentsCount` (number, default: `1`): 본인 포함 부양가족 수
- **계산 공식 및 도메인 로직 (Logic & Formula)**:
  1. 과세 표준액($S_{taxable}$) 산출:
     $$S_{monthly} = \text{isAnnual} ? \lfloor \frac{\text{grossSalary}}{12} \rfloor : \text{grossSalary}$$
     $$S_{taxable} = \max(0, S_{monthly} - \text{nonTaxableAmount})$$
  2. 4대 보험 공제액(근로자 부담분 기준):
     - 국민연금: $\min(S_{taxable} \times 0.045, 271,350)$ *(상한액 적용)*
     - 건강보험: $S_{taxable} \times 0.03545$
     - 장기요양보험: $\text{건강보험료} \times 0.1295$
     - 고용보험: $S_{taxable} \times 0.009$
  3. 근로소득세 및 지방소득세:
     - 간이세액 산출액(근사 모델 또는 구간별 누진세율 적용)
     - 지방소득세: $\text{소득세} \times 0.1$
  4. 실수령액:
     $$\text{NetPay} = S_{monthly} - (\sum \text{4대보험료} + \text{소득세} + \text{지방소득세})$$
- **출력 데이터 (Output Schema)**:
  ```typescript
  {
    grossMonthly: number;
    totalDeductions: number;
    nationalPension: number;
    healthInsurance: number;
    longTermCare: number;
    employmentInsurance: number;
    incomeTax: number;
    localIncomeTax: number;
    netPay: number;
  }
  ```

---

### 1.2. 전월세 변환 계산기 (Rent vs. Jeonse Conversion Calculator)

- **설명**: 전세 보증금을 월세로 전환하거나(전월세전환율), 월세를 전세 보증금으로 환산합니다.
- **입력 파라미터 (Input Specs)**:
  - `currentDeposit` (number): 현재 보증금 (KRW)
  - `currentMonthlyRent` (number): 현재 월세 (KRW)
  - `targetDeposit` (number): 조정 목표 보증금 (KRW)
  - `conversionRate` (number): 전월세전환율 (%, 예: `5.5`)
- **계산 공식 및 도메인 로직 (Logic & Formula)**:
  - **전세 $\rightarrow$ 월세 전환**:
    $$\Delta \text{Deposit} = \text{currentDeposit} - \text{targetDeposit}$$
    $$\text{TargetMonthlyRent} = \text{currentMonthlyRent} + \left( \frac{\Delta \text{Deposit} \times (\text{conversionRate} / 100)}{12} \right)$$
  - **월세 $\rightarrow$ 전세 전환**:
    $$\Delta \text{Rent} = \text{currentMonthlyRent} - \text{targetMonthlyRent}$$
    $$\text{TargetDeposit} = \text{currentDeposit} + \left( \frac{\Delta \text{Rent} \times 12}{\text{conversionRate} / 100} \right)$$
- **출력 데이터 (Output Schema)**:
  ```typescript
  {
    convertedMonthlyRent: number;
    convertedDeposit: number;
    appliedRate: number;
  }
  ```

---

### 1.3. 대출 원리금 상환 계산기 (Loan Repayment Calculator)

- **설명**: 원리금균등상환, 원금균등상환, 만기일시상환 방식에 따른 월별 상환 스케줄과 총 이자 비용을 계산합니다.
- **입력 파라미터 (Input Specs)**:
  - `principal` (number): 대출 원금 (KRW)
  - `annualRate` (number): 연이자율 (%, 예: `4.5`)
  - `termMonths` (number): 상환 개월 수 (예: `360`)
  - `repaymentType` (`"AMORTIZING"` | `"EQUAL_PRINCIPAL"` | `"BULLET"`): 상환 방식
- **계산 공식 및 도메인 로직 (Logic & Formula)**:
  - 월 이자율: $r = \frac{\text{annualRate}}{100 \times 12}$
  - **원리금균등분할상환(AMORTIZING)**:
    $$\text{MonthlyPayment} = P \times \frac{r(1+r)^n}{(1+r)^n - 1}$$
  - **원금균등분할상환(EQUAL_PRINCIPAL)**:
    $$\text{MonthlyPrincipal} = \frac{P}{n}, \quad \text{Interest}_k = (P - (k-1) \times \text{MonthlyPrincipal}) \times r$$
  - **만기일시상환(BULLET)**:
    $$\text{MonthlyPayment}_k = P \times r \quad (k < n), \quad \text{Payment}_n = P + (P \times r)$$
- **출력 데이터 (Output Schema)**:
  ```typescript
  {
    totalInterest: number;
    totalRepayment: number;
    schedule: Array<{
      month: number;
      principalPayment: number;
      interestPayment: number;
      totalPayment: number;
      remainingPrincipal: number;
    }>;
  }
  ```

---

### 1.4. 단위당 단가 비교 계산기 (Unit Price & Cost Comparison Calculator)

- **설명**: 용량, 개수, 가격이 다른 다중 상품군의 단위를 표준화하여 가성비를 비교 정렬합니다.
- **입력 파라미터 (Input Specs)**:
  - `items`: Array<{
      `id`: string;
      `name`: string;
      `price`: number;
      `quantity`: number; // 총 개수 또는 중량/용량
      `unit`: `"g"` | `"kg"` | `"ml"` | `"l"` | `"ea"`;
    }>
- **계산 공식 및 도메인 로직 (Logic & Formula)**:
  1. 단위를 기본 단위(g, ml, ea)로 정규화:
     - `kg` $\rightarrow \times 1000\text{g}$, `l` $\rightarrow \times 1000\text{ml}$
  2. 기준 단위당 단가 산출:
     $$\text{NormalizedUnitPrice} = \frac{\text{price}}{\text{normalizedQuantity}}$$
  3. 기준 단위(예: 100g, 100ml, 1개당) 가격으로 스케일링 후 오름차순 정렬.
- **출력 데이터 (Output Schema)**:
  ```typescript
  {
    rankedItems: Array<{
      id: string;
      name: string;
      normalizedUnit: string;
      pricePerStandardUnit: number;
      savingsPercentageVsWorst: number;
    }>;
  }
  ```

---

### 1.5. N빵(더치페이) 및 잔돈 정산 계산기 (Dutch Pay & Splitter)

- **설명**: 총액 분할, 차등 지불자(특정 항목 제외자, 주류 미참여자) 처리 및 10원/100원/1000원 단위 절사·올림을 처리합니다.
- **입력 파라미터 (Input Specs)**:
  - `totalAmount` (number): 총 지출액
  - `participants`: Array<{ `name`: string; `isIncludedInExtra`: boolean }>
  - `extraAmount` (number): 특정 그룹만 지출한 금액 (예: 주류 비용)
  - `roundUnit` (number, default: `100`): 절사/올림 단위 (10, 100, 1000)
  - `roundType` (`"FLOOR"` | `"CEIL"` | `"ROUND"`): 끝전 처리 방식
- **계산 공식 및 도메인 로직 (Logic & Formula)**:
  1. 공통 비용과 차등 비용 분리:
     $$\text{CommonBase} = \text{totalAmount} - \text{extraAmount}$$
     $$\text{CostPerMember}_{common} = \frac{\text{CommonBase}}{N_{total}}, \quad \text{CostPerMember}_{extra} = \frac{\text{extraAmount}}{N_{extra}}$$
  2. 단위 절사/올림 함수 적용:
     $$\text{applyRound}(val, u) = \begin{cases} \lfloor val / u \rfloor \times u & \text{if FLOOR} \\ \lceil val / u \rceil \times u & \text{if CEIL} \end{cases}$$
  3. 끝전 차액(Remainder Difference) 총액 합산 후 결제자 오차 정산.
- **출력 데이터 (Output Schema)**:
  ```typescript
  {
    splits: Array<{
      name: string;
      amount: number;
    }>;
    discrepancy: number;
  }
  ```

---

### 1.6. 예적금 이자 및 과세 계산기 (Savings & Deposit Interest Calculator)

- **설명**: 정기예금(단리) 및 정기적금의 만기 이자, 과세(일반 15.4%, 세금우대, 비과세)를 반영한 실수령 이자를 계산합니다.
- **입력 파라미터 (Input Specs)**:
  - `productType` (`"DEPOSIT"` | `"SAVINGS"`): 예금(거치) vs 적금(적립)
  - `amount` (number): 예치금 또는 월 적립액 (KRW)
  - `annualRate` (number): 연이율 (%)
  - `periodMonths` (number): 가입 기간 (월)
  - `taxType` (`"NORMAL"` | `"PREFERENTIAL"` | `"TAX_FREE"`)
- **계산 공식 및 도메인 로직 (Logic & Formula)**:
  - **정기예금(단리)**:
    $$\text{GrossInterest} = P \times \left( \frac{\text{annualRate}}{100} \right) \times \left( \frac{n}{12} \right)$$
  - **정기적금(단리, 월초 납입 기준)**:
    $$\text{GrossInterest} = P \times \frac{\text{annualRate}}{100} \times \frac{n(n+1)}{24}$$
  - **세금 계산**:
    $$\text{TaxRate} = \begin{cases} 0.154 & (\text{NORMAL: 소득세 14\% + 지방세 1.4\%}) \\ 0.095 & (\text{PREFERENTIAL}) \\ 0 & (\text{TAX\_FREE}) \end{cases}$$
    $$\text{TaxAmount} = \lfloor \text{GrossInterest} \times \text{TaxRate} \rfloor$$
- **출력 데이터 (Output Schema)**:
  ```typescript
  {
    totalPrincipal: number;
    grossInterest: number;
    taxAmount: number;
    netPayout: number;
  }
  ```

---

### 1.7. 복리 투자 수익률(CAGR) 계산기 (Compound Interest & CAGR Calculator)

- **설명**: 초기 자본, 월 추가 적립금, 기대 수익률을 기반으로 장기 자산 증식 곡선 및 연평균 복리 성장률(CAGR)을 시뮬레이션합니다.
- **입력 파라미터 (Input Specs)**:
  - `initialPrincipal` (number): 초기 투자금
  - `monthlyContribution` (number): 매월 추가 납입액
  - `expectedAnnualReturn` (number): 연간 기대 수익률 (%)
  - `years` (number): 투자 연수
- **계산 공식 및 도메인 로직 (Logic & Formula)**:
  - 월 수익률: $r = \frac{\text{expectedAnnualReturn}}{100 \times 12}$
  - 점화식: $A_0 = \text{initialPrincipal}$, $A_t = A_{t-1} \times (1 + r) + \text{monthlyContribution}$
  - CAGR 역산:
    $$\text{CAGR} = \left( \frac{\text{FinalValue}}{\text{TotalInvested}} \right)^{\frac{1}{\text{years}}} - 1$$
- **출력 데이터 (Output Schema)**:
  ```typescript
  {
    totalInvested: number;
    finalBalance: number;
    totalProfit: number;
    profitRate: number;
    yearlyProjections: Array<{
      year: number;
      investedSum: number;
      projectedBalance: number;
      accumulatedInterest: number;
    }>;
  }
  ```

---

### 1.8. D-Day 및 영업일 계산기 (Date Difference & Working Days Calculator)

- **설명**: 두 날짜 사이의 D-Day, 만 나이, 영업일 수(주말 제외)를 도출합니다.
- **입력 파라미터 (Input Specs)**:
  - `startDate` (string: `YYYY-MM-DD`)
  - `endDate` (string: `YYYY-MM-DD`)
  - `excludeWeekends` (boolean, default: `false`): 주말(토/일) 제외 여부
- **계산 공식 및 도메인 로직 (Logic & Formula)**:
  - 타임존 오차 방지를 위해 UTC `00:00:00` 기준으로 파싱.
  - 단순 일수 차이: $\Delta \text{Days} = \frac{\text{Timestamp}_{end} - \text{Timestamp}_{start}}{86400000}$
  - 영업일: 날짜 순회 시 `getUTCDay()`가 0(일), 6(토)인 경우 제외.
- **출력 데이터 (Output Schema)**:
  ```typescript
  {
    dayDifference: number;
    businessDays: number;
    totalWeeks: number;
    formattedDDayString: string;
  }
  ```

---

### 1.9. 부동산 중개보수(복비) 계산기 (Real Estate Brokerage Fee Calculator)

- **설명**: 공인중개사법 시행규칙에 따른 주택 매매/교환 및 임대차(전월세) 중개보수 상한 요율과 한도액을 계산합니다.
- **입력 파라미터 (Input Specs)**:
  - `propertyType` (`"HOUSING"` | `"OFFICETEL"` | `"NON_HOUSING"`)
  - `transactionType` (`"TRADE"` | `"RENT"`)
  - `tradeAmount` (number): 거래금액
  - `isVatIncluded` (boolean, default: `false`): 부가세(10%) 포함 여부
- **계산 공식 및 도메인 로직 (Logic & Formula)**:
  1. 임대차 환산 거래금액:
     $$\text{환산보증금} = \text{보증금} + (\text{월세} \times 100)$$
     *(5,000만 원 미만일 경우: $\text{보증금} + (\text{월세} \times 70)$ 재산출)*
  2. 상한 요율 적용 및 한도액 비교:
     $$\text{MaxFee} = \min(\text{거래금액} \times \text{요율}, \text{한도액})$$
- **출력 데이터 (Output Schema)**:
  ```typescript
  {
    transactionAmount: number;
    appliedRate: number;
    limitAmount: number | null;
    maxBrokerageFee: number;
    vat: number;
    totalFeeWithVat: number;
  }
  ```

---

### 1.10. 기초대사량(BMR) 및 TDEE 다이어트 계산기 (BMR & Calorie Calculator)

- **설명**: 신체 데이터와 활동 계수를 활용하여 Mifflin-St Jeor 공식을 통해 유지 칼로리와 체중 조절 권장 칼로리를 도출합니다.
- **입력 파라미터 (Input Specs)**:
  - `gender` (`"MALE"` | `"FEMALE"`)
  - `weightKg` (number)
  - `heightCm` (number)
  - `age` (number)
  - `activityLevel` (1.2: 좌식, 1.375: 가벼운 활동, 1.55: 보통, 1.725: 강한 활동, 1.9: 운동선수)
  - `goal` (`"MAINTAIN"` | `"LOSE"` | `"GAIN"`)
- **계산 공식 및 도메인 로직 (Logic & Formula)**:
  - **Mifflin-St Jeor BMR**:
    $$\text{BMR} = 10 \times \text{weightKg} + 6.25 \times \text{heightCm} - 5 \times \text{age} + S$$
    *(남성 $S = +5$, 여성 $S = -161$)*
  - **TDEE**: $\text{BMR} \times \text{activityLevel}$
  - **목표 권장 칼로리**: $\text{TargetCalories} = \text{TDEE} + \Delta_{\text{goal}}$
- **출력 데이터 (Output Schema)**:
  ```typescript
  {
    bmr: number;
    tdee: number;
    targetCalories: number;
    macroNutrients: {
      carbsGrams: number;
      proteinGrams: number;
      fatGrams: number;
    };
  }
  ```

---

## 2. AI 코딩 에이전트 작업 지침서 (Prompt / Directive Template)

```markdown
# Role & Architecture Instructions

당신은 정확하고 최적화된 연산 엔진을 구축하는 Senior Frontend/Fullstack Engineer입니다.
상기 기술된 10종의 생활형 계산기 명세서를 바탕으로 모듈식 웹 서비스를 구현하세요.

## 1. 아키텍처 및 디렉토리 구조 원칙
- UI 프레임워크와 도메인 계산 로직은 완벽히 분리(Decoupled)되어야 합니다.
- 모든 계산 로직은 `/lib/calculators/[calculatorName].ts`에 순수 함수(Pure Function) 형태로 작성하세요.
- 비즈니스 로직 단위 테스트(`/tests/calculators/*.test.ts`)를 Vitest 또는 Jest로 먼저 작성(TDD 지향)하세요.

## 2. 기술적 제약 조건 및 엣지 케이스 처리
- **부동소수점 오차 방지**: 금융/정산/이자 계산 시 자바스크립트 부동소수점 오차를 방지하도록 작성하세요.
- **날짜 계산**: 타임존 문제를 방지하기 위해 UTC 기준으로 파싱 및 연산하세요.
- **유효성 검증**: 0 또는 음수 입력에 대한 Zod 스키마 검증을 구현하세요.
```
