import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import type { Activity } from '../types';
import { toActivityTableView } from './utilities';
import type { ActivityTableOptions } from './utilities';
import type { TableViewProps } from './index';

describe('toActivityTableView', () => {
  // Arrange
  interface ActivityTableCase {
    testDescription: string;
    activities: Activity[];
    options: ActivityTableOptions;
    expected: TableViewProps;
  }

  const caption = 'Likes';
  const columnHeaders = ['Date', 'Count'];
  const locale = 'en';
  const juneInRussian = new Intl.DateTimeFormat('ru', { month: 'short' }).format(new Date(2026, 5));

  const fixedTestTime = new Date(2026, 5, 13, 23, 59, 59, 999);
  const fixedTestOptions = { caption, columnHeaders, locale };

  const activities = {
    april13: { creationDate: new Date(2026, 3, 13, 9).toISOString() },
    april21: { creationDate: new Date(2026, 3, 21, 1).toISOString() },
    may1: { creationDate: new Date(2026, 4, 1, 12).toISOString() },
    june5: { creationDate: new Date(2026, 5, 5, 9).toISOString() },
    june6: { creationDate: new Date(2026, 5, 6, 12).toISOString() },
    june7Start: { creationDate: new Date(2026, 5, 7).toISOString() },
    june9: { creationDate: new Date(2026, 5, 9, 9).toISOString() },
    june10: { creationDate: new Date(2026, 5, 10).toISOString() },
    june13TodayMorning: { creationDate: new Date(2026, 5, 13, 9).toISOString() },
    june13TodayAfternoon: { creationDate: new Date(2026, 5, 13, 15).toISOString() },
  } satisfies Record<string, Activity>;

  const activityTableCases: ActivityTableCase[] = [
    {
      testDescription: 'returns zeroed values for empty activity list',
      activities: [],
      options: { ...fixedTestOptions, dataPeriod: 'day', periodsCount: 5 },
      expected: {
        caption,
        columnHeaders,
        data: [
          { rowHeading: '9 Jun', dataSlots: [0] },
          { rowHeading: '10 Jun', dataSlots: [0] },
          { rowHeading: '11 Jun', dataSlots: [0] },
          { rowHeading: '12 Jun', dataSlots: [0] },
          { rowHeading: '13 Jun', dataSlots: [0] },
        ]
      },
    },
    {
      testDescription: 'excludes out-of-bounds dates',
      activities: [
        activities.june10,
        activities.june13TodayAfternoon,
      ],
      options: { ...fixedTestOptions, dataPeriod: 'day', periodsCount: 3 },
      expected: {
        caption,
        columnHeaders,
        data: [
          { rowHeading: '11 Jun', dataSlots: [0] },
          { rowHeading: '12 Jun', dataSlots: [0] },
          { rowHeading: '13 Jun', dataSlots: [1] },
        ]
      },
    },
    {
      testDescription: 'counts daily statistics (5 days)',
      activities: [
        activities.june9,
        activities.june10,
        activities.june13TodayMorning,
        activities.june13TodayAfternoon,
      ],
      options: { ...fixedTestOptions, dataPeriod: 'day', periodsCount: 5 },
      expected: {
        caption,
        columnHeaders,
        data: [
          { rowHeading: '9 Jun', dataSlots: [1] },
          { rowHeading: '10 Jun', dataSlots: [1] },
          { rowHeading: '11 Jun', dataSlots: [0] },
          { rowHeading: '12 Jun', dataSlots: [0] },
          { rowHeading: '13 Jun', dataSlots: [2] },
        ]
      },
    },
    {
      testDescription: 'counts weekly statistics (2 weeks)',
      activities: [
        activities.june5,
        activities.june6,
        activities.june7Start,
        activities.june10,
        activities.june13TodayMorning,
        activities.june13TodayAfternoon,
      ],
      options: { ...fixedTestOptions, dataPeriod: 'week', periodsCount: 2 },
      expected: {
        caption,
        columnHeaders,
        data: [
          { rowHeading: '31 May – 6 Jun', dataSlots: [2] },
          { rowHeading: '7 Jun – 13 Jun', dataSlots: [4] },
        ]
      },
    },
    {
      testDescription: 'counts monthly statistics (3 months)',
      activities: [
        activities.april13,
        activities.april21,
        activities.may1,
        activities.june13TodayMorning,
        activities.june13TodayAfternoon,
      ],
      options: { ...fixedTestOptions, dataPeriod: 'month', periodsCount: 3 },
      expected: {
        caption,
        columnHeaders,
        data: [
          { rowHeading: 'Apr', dataSlots: [2] },
          { rowHeading: 'May', dataSlots: [1] },
          { rowHeading: 'Jun', dataSlots: [2] },
        ]
      },
    },
    {
      testDescription: 'utilizes provided non-english locale',
      activities: [
        activities.june13TodayMorning,
      ],
      options: { ...fixedTestOptions, dataPeriod: 'month', periodsCount: 1, locale: 'ru' },
      expected: {
        caption,
        columnHeaders,
        data: [
          { rowHeading: juneInRussian, dataSlots: [1] },
        ]
      },
    },
    {
      testDescription: 'counts daily statistics in Russian (5 days)',
      activities: [
        activities.june9,
        activities.june10,
        activities.june13TodayMorning,
        activities.june13TodayAfternoon,
      ],
      options: { ...fixedTestOptions, dataPeriod: 'day', periodsCount: 5, locale: 'ru' },
      expected: {
        caption,
        columnHeaders,
        data: [
          { rowHeading: '9 июн.', dataSlots: [1] },
          { rowHeading: '10 июн.', dataSlots: [1] },
          { rowHeading: '11 июн.', dataSlots: [0] },
          { rowHeading: '12 июн.', dataSlots: [0] },
          { rowHeading: '13 июн.', dataSlots: [2] },
        ]
      },
    },
    {
      testDescription: 'counts weekly statistics in Russian (2 weeks)',
      activities: [
        activities.june5,
        activities.june6,
        activities.june7Start,
        activities.june10,
        activities.june13TodayMorning,
        activities.june13TodayAfternoon,
      ],
      options: { ...fixedTestOptions, dataPeriod: 'week', periodsCount: 2, locale: 'ru' },
      expected: {
        caption,
        columnHeaders,
        data: [
          { rowHeading: '31 мая – 6 июн.', dataSlots: [2] },
          { rowHeading: '7 июн. – 13 июн.', dataSlots: [4] },
        ]
      },
    },
  ];

  beforeAll(() => {
    vi.setSystemTime(fixedTestTime);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test.for(activityTableCases)('$testDescription', ({ activities, options, expected }) => {
    // Act
    const actualTableView = toActivityTableView(activities, options);

    // Assert
    expect(actualTableView).toEqual(expected);
  });
});
