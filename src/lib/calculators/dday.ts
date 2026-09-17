import { DDayInput, DDayOutput, dDayInputSchema } from "./types";

/**
 * 8. D-Day 및 영업일 계산기 (Date Difference & Working Days Calculator)
 * UTC 00:00:00 기준으로 타임존 오차 방지
 */
export function calculateDDay(input: DDayInput): DDayOutput {
  const validated = dDayInputSchema.parse(input);
  const { startDate, endDate, excludeWeekends } = validated;

  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

  const startUtc = Date.UTC(startYear, startMonth - 1, startDay);
  const endUtc = Date.UTC(endYear, endMonth - 1, endDay);

  const diffMs = endUtc - startUtc;
  const dayDifference = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // 영업일 계산 (토요일: 6, 일요일: 0 제외)
  let businessDays = 0;
  const step = dayDifference >= 0 ? 1 : -1;
  const current = new Date(startUtc);

  // 날짜 순회
  const totalDaysToIterate = Math.abs(dayDifference);
  for (let i = 0; i <= totalDaysToIterate; i++) {
    const dayOfWeek = current.getUTCDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    if (!excludeWeekends || !isWeekend) {
      businessDays++;
    }
    current.setUTCDate(current.getUTCDate() + step);
  }

  const totalWeeks = Math.floor(Math.abs(dayDifference) / 7);

  let formattedDDayString = "";
  if (dayDifference === 0) {
    formattedDDayString = "D-Day";
  } else if (dayDifference > 0) {
    formattedDDayString = `D-${dayDifference}`;
  } else {
    formattedDDayString = `D+${Math.abs(dayDifference)}`;
  }

  return {
    dayDifference,
    businessDays,
    totalWeeks,
    formattedDDayString,
  };
}
