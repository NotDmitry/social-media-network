import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import type { Activity } from '../types';
import { toWeeklyStatsCardDataView } from './utilities';
import type { StatsCardProps } from './index';

describe('toWeeklyStatsCardDataView', () => {
  // Arrange
  interface WeeklyStatsCase {
    testDescription: string;
    activities: Activity[];
    expected: StatsCardProps;
  }

  const fixedTestTime = new Date(2026, 5, 13, 23, 59, 59, 999);

  const title = 'Posts';
  const trendLabels = {
    noActivity: 'No activity',
    weekOverWeek: 'Week over week',
  };

  const activities = {
    beforePreviousWeekStart: { creationDate: new Date(2026, 4, 30, 23, 59, 59, 999).toISOString() },
    previousWeekStart: { creationDate: new Date(2026, 4, 31).toISOString() },
    previousWeek: { creationDate: new Date(2026, 5, 2).toISOString() },
    previousWeekEnd: { creationDate: new Date(2026, 5, 6, 23, 59, 59, 999).toISOString() },
    currentWeekStart: { creationDate: new Date(2026, 5, 7).toISOString() },
    currentWeekToday: { creationDate: new Date(2026, 5, 13, 9).toISOString() },
  } satisfies Record<string, Activity>;

  const weeklyStatsCases: WeeklyStatsCase[] = [
    {
      testDescription: `returns 0 count and '${trendLabels.noActivity}' for empty activities`,
      activities: [],
      expected: { title, data: '0', trendText: trendLabels.noActivity },
    },
    {
      testDescription: `returns '${trendLabels.noActivity}' when only the current week has activity`,
      activities: [activities.currentWeekToday],
      expected: { title, data: '1', trendText: trendLabels.noActivity },
    },
    {
      testDescription: 'returns \'-100%\' trend when only the previous week has activity',
      activities: [activities.previousWeek],
      expected: { title, data: '0', trendText: `-100% ${trendLabels.weekOverWeek}` },
    },
    {
      testDescription: 'returns \'0%\' trend for equal weeks activities count',
      activities: [activities.previousWeek, activities.currentWeekToday],
      expected: { title, data: '1', trendText: `0% ${trendLabels.weekOverWeek}` },
    },
    {
      testDescription: 'includes the start of the previous week',
      activities: [activities.previousWeekStart],
      expected: { title, data: '0', trendText: `-100% ${trendLabels.weekOverWeek}` },
    },
    {
      testDescription: 'includes the start of the current week',
      activities: [activities.currentWeekStart],
      expected: { title, data: '1', trendText: trendLabels.noActivity },
    },
    {
      testDescription: 'excludes the period before the previous week start',
      activities: [activities.beforePreviousWeekStart],
      expected: { title, data: '0', trendText: trendLabels.noActivity },
    },
    {
      testDescription: 'correctly handles the week change',
      activities: [activities.previousWeek, activities.previousWeekEnd, activities.currentWeekStart],
      expected: { title, data: '1', trendText: `-50% ${trendLabels.weekOverWeek}` },
    },
    {
      testDescription: 'returns a positive trend when current week has more activities',
      activities: [activities.previousWeek, activities.currentWeekStart, activities.currentWeekToday],
      expected: { title, data: '2', trendText: `+100% ${trendLabels.weekOverWeek}` },
    },
    {
      testDescription: 'returns a negative trend when previous week has more activities',
      activities: [activities.previousWeek, activities.previousWeekEnd, activities.currentWeekToday],
      expected: { title, data: '1', trendText: `-50% ${trendLabels.weekOverWeek}` },
    },
    {
      testDescription: 'rounds non-integer trend',
      activities: [
        activities.previousWeekStart,
        activities.previousWeek,
        activities.previousWeekEnd,
        activities.currentWeekToday,
        activities.currentWeekStart,
      ],
      expected: { title, data: '2', trendText: `-33% ${trendLabels.weekOverWeek}` },
    },
  ];

  beforeAll(() => {
    vi.setSystemTime(fixedTestTime);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test.for(weeklyStatsCases)('$testDescription', ({ activities, expected }) => {
    // Act
    const actualStatsCardDataView = toWeeklyStatsCardDataView(title, activities, trendLabels);

    // Assert
    expect(actualStatsCardDataView).toEqual(expected);
  });
});
