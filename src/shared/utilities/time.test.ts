import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  getDayShortMonthPresentationString,
  getRelativePastTimePresentationString,
  getShortMonthPresentationString,
} from './time';

describe('getRelativePastTimePresentationString', () => {
  // Arrange
  interface RelativeTimeCase {
    elapsedTime: string;
    dateTimeString: string;
    expected: string;
  };

  const fixedTestTime = new Date(2026, 5, 13, 9);

  const relativeTimeCases: RelativeTimeCase[] = [
    {
      elapsedTime: '0 seconds',
      dateTimeString: fixedTestTime.toISOString(),
      expected: 'now'
    },
    {
      elapsedTime: '59 seconds',
      dateTimeString: new Date(2026, 5, 13, 8, 59, 1).toISOString(),
      expected: 'now'
    },
    {
      elapsedTime: '1 minute',
      dateTimeString: new Date(2026, 5, 13, 8, 59).toISOString(),
      expected: '1 min. ago'
    },
    {
      elapsedTime: '1 minute 1 second',
      dateTimeString: new Date(2026, 5, 13, 8, 58, 59).toISOString(),
      expected: '1 min. ago'
    },
    {
      elapsedTime: '5 minutes 20 seconds',
      dateTimeString: new Date(2026, 5, 13, 8, 54, 40).toISOString(),
      expected: '5 min. ago'
    },
    {
      elapsedTime: '5 minutes 30 seconds',
      dateTimeString: new Date(2026, 5, 13, 8, 54, 30).toISOString(),
      expected: '5 min. ago'
    },
    {
      elapsedTime: '5 minutes 40 seconds',
      dateTimeString: new Date(2026, 5, 13, 8, 54, 20).toISOString(),
      expected: '6 min. ago'
    },
    {
      elapsedTime: '59 minutes',
      dateTimeString: new Date(2026, 5, 13, 8, 1).toISOString(),
      expected: '59 min. ago'
    },
    {
      elapsedTime: '59 minutes 30 seconds',
      dateTimeString: new Date(2026, 5, 13, 8, 0, 30).toISOString(),
      expected: '59 min. ago'
    },
    {
      elapsedTime: '59 minutes 31 seconds',
      dateTimeString: new Date(2026, 5, 13, 8, 0, 29).toISOString(),
      expected: '1 hr. ago'
    },
    {
      elapsedTime: '1 hour',
      dateTimeString: new Date(2026, 5, 13, 8).toISOString(),
      expected: '1 hr. ago'
    },
    {
      elapsedTime: '1 hour 1 second',
      dateTimeString: new Date(2026, 5, 13, 7, 59, 59).toISOString(),
      expected: '1 hr. ago'
    },
    {
      elapsedTime: '23 hours through other day',
      dateTimeString: new Date(2026, 5, 12, 10).toISOString(),
      expected: 'yesterday'
    },
    {
      elapsedTime: '23 hours 30 minutes through other day',
      dateTimeString: new Date(2026, 5, 12, 9, 30).toISOString(),
      expected: 'yesterday'
    },
    {
      elapsedTime: '23 hours 31 minutes through other day',
      dateTimeString: new Date(2026, 5, 12, 9, 29).toISOString(),
      expected: 'yesterday'
    },
    {
      elapsedTime: '1 day',
      dateTimeString: new Date(2026, 5, 12, 9).toISOString(),
      expected: 'yesterday'
    },
    {
      elapsedTime: '1 day 1 second',
      dateTimeString: new Date(2026, 5, 12, 8, 59, 59).toISOString(),
      expected: 'yesterday'
    },
    {
      elapsedTime: '2 days',
      dateTimeString: new Date(2026, 5, 11, 9).toISOString(),
      expected: '2 days ago'
    },
    {
      elapsedTime: '7 days - 1 ms',
      dateTimeString: new Date(2026, 5, 6, 9, 0, 0, 1).toISOString(),
      expected: '7 days ago'
    },
    {
      elapsedTime: '7 days',
      dateTimeString: new Date(2026, 5, 6, 9).toISOString(),
      expected: '7 days ago'
    },
    {
      elapsedTime: '7 days + 1 ms',
      dateTimeString: new Date(2026, 5, 6, 8, 59, 59, 999).toISOString(),
      expected: 'Jun 6, 2026'
    },
    {
      elapsedTime: '8 days',
      dateTimeString: new Date(2026, 5, 5, 9).toISOString(),
      expected: 'Jun 5, 2026'
    },
    {
      elapsedTime: '1 month',
      dateTimeString: new Date(2026, 4, 13, 9).toISOString(),
      expected: 'May 13, 2026'
    },
    {
      elapsedTime: '1 year',
      dateTimeString: new Date(2025, 5, 13, 9).toISOString(),
      expected: 'Jun 13, 2025'
    },
  ];

  beforeEach(() => {
    vi.setSystemTime(fixedTestTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test.for(relativeTimeCases)('returns \'$expected\' for the elapsed time of \'$elapsedTime\' from 9am Jun 13, 2026',
    ({ dateTimeString, expected }) => {
      // Act
      const actualRelativeTimeString = getRelativePastTimePresentationString(dateTimeString, 'en');

      // Assert
      expect(actualRelativeTimeString).toBe(expected);
    }
  );

  test('returns \'23 hr. ago\' for the 23 hr. elapsed time during the day', () => {
    // Arrange
    vi.setSystemTime(new Date(2026, 5, 13, 23, 59));
    const activityTimeString = new Date(2026, 5, 13, 0, 28).toISOString();
    const expected = '23 hr. ago';

    // Act
    const actualRelativeTimeString = getRelativePastTimePresentationString(activityTimeString, 'en');

    // Assert
    expect(actualRelativeTimeString).toBe(expected);
  });

  test('returns \'2 days ago\' for the day before yesterday', () => {
    // Arrange
    vi.setSystemTime(new Date(2026, 5, 13, 10));
    const activityTimeString = new Date(2026, 5, 11, 22).toISOString();
    const expected = '2 days ago';

    // Act
    const actualRelativeTimeString = getRelativePastTimePresentationString(activityTimeString, 'en');

    // Assert
    expect(actualRelativeTimeString).toBe(expected);
  });

  test('returns \'yesterday\' for the midnight calendar days transition', () => {
    // Arrange
    vi.setSystemTime(new Date(2026, 5, 13));
    const activityTimeString = new Date(2026, 5, 12, 23, 59).toISOString();
    const expected = 'yesterday';

    // Act
    const actualRelativeTimeString = getRelativePastTimePresentationString(activityTimeString, 'en');

    // Assert
    expect(actualRelativeTimeString).toBe(expected);
  });

  test('returns null for the invalid date time string', () => {
    // Arrange
    const invalidDate = 'invalid date';

    // Act
    const actualRelativeTimeString = getRelativePastTimePresentationString(invalidDate, 'en');

    // Assert
    expect(actualRelativeTimeString).toBeNull();
  });

  test('returns \'now\' for a timestamp 10 days in the future', () => {
    // Arrange
    const testDate = new Date(2026, 5, 23, 9).toISOString();

    // Act
    const actualRelativeTimeString = getRelativePastTimePresentationString(testDate, 'en');

    // Assert
    expect(actualRelativeTimeString).toBe('now');
  });

  test('switches locales without stale cache', () => {
    // Arrange
    const testDate = new Date(2026, 5, 11, 9).toISOString();

    // Act
    const initialEnglishRelativeTimeString = getRelativePastTimePresentationString(testDate, 'en');
    const russianRelativeTimeString = getRelativePastTimePresentationString(testDate, 'ru');
    const repeatedEnglishRelativeTimeString = getRelativePastTimePresentationString(testDate, 'en');

    // Assert
    expect(russianRelativeTimeString).not.toBe(initialEnglishRelativeTimeString);
    expect(repeatedEnglishRelativeTimeString).not.toBe(russianRelativeTimeString);
    expect(repeatedEnglishRelativeTimeString).toBe(initialEnglishRelativeTimeString);
  });
});

describe('getShortMonthPresentationString', () => {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const shortMonthCases = shortMonths.map((expectedMonth, monthIndex) => ({ expectedMonth, monthIndex }));
  const russianShortMonthFormatter = new Intl.DateTimeFormat('ru', {
    month: 'short',
  });

  test.for(shortMonthCases)('returns \'$expectedMonth\' for month number %$ in English',
    ({ expectedMonth, monthIndex }) => {
      // Arrange
      const testDate = new Date(2026, monthIndex);

      // Act
      const actualShortMonth = getShortMonthPresentationString(testDate, 'en');

      // Assert
      expect(actualShortMonth).toBe(expectedMonth);
    }
  );

  test('uses non-english (Russian) locale when provided', () => {
    // Arrange
    const testDate = new Date(2026, 1);
    const expectedShortMonth = russianShortMonthFormatter.format(testDate);

    // Act
    const actualShortMonth = getShortMonthPresentationString(testDate, 'ru');

    // Assert
    expect(actualShortMonth).toBe(expectedShortMonth);
  });

  test('switches locales without stale cache', () => {
    // Arrange
    const testDate = new Date(2024, 5, 21, 12, 23);

    // Act
    const initialEnglishShortMonth = getShortMonthPresentationString(testDate, 'en');
    const russianShortMonth = getShortMonthPresentationString(testDate, 'ru');
    const repeatedEnglishShortMonth = getShortMonthPresentationString(testDate, 'en');

    // Assert
    expect(russianShortMonth).not.toBe(initialEnglishShortMonth);
    expect(repeatedEnglishShortMonth).not.toBe(russianShortMonth);
    expect(repeatedEnglishShortMonth).toBe(initialEnglishShortMonth);
  });

  test('throws on invalid locale', () => {
    // Arrange
    const testDate = new Date(2026, 0);
    const invalidLocale = 'en_GB';

    // Assert
    expect(() => getShortMonthPresentationString(testDate, invalidLocale)).toThrow();
  });
});

describe('getDayShortMonthPresentationString', () => {
  const testDate = new Date(2026, 4, 13);

  test('returns day-first English locale-aware presentation', () => {
    // Arrange
    const expectedDayMonth = '13 May';

    // Act
    const actualDayMonth = getDayShortMonthPresentationString(testDate, 'en');

    // Assert
    expect(actualDayMonth).toBe(expectedDayMonth);
  });

  test('returns day-first Russian locale-aware presentation', () => {
    // Arrange
    const expectedDayMonth = '13 мая';

    // Act
    const actualDayMonth = getDayShortMonthPresentationString(testDate, 'ru');

    // Assert
    expect(actualDayMonth).toBe(expectedDayMonth);
  });
});
