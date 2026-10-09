import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { getRelativePastTimePresentationString, getShortMonthPresentationString } from './time';

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
      elapsedTime: '23 hours',
      dateTimeString: new Date(2026, 5, 12, 10).toISOString(),
      expected: '23 hr. ago'
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

  beforeAll(() => {
    vi.setSystemTime(fixedTestTime);
  });

  afterAll(() => {
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

  test('returns null for the invalid date time string', () => {
    // Arrange
    const invalidDate = 'invalid date';

    // Act
    const actualRelativeTimeString = getRelativePastTimePresentationString(invalidDate, 'en');

    // Assert
    expect(actualRelativeTimeString).toBeNull();
  });

  test('returns null for the timestamp in the future', () => {
    // Arrange
    const testDate = new Date(2026, 5, 13, 9, 0, 0, 1).toISOString();

    // Act
    const actualRelativeTimeString = getRelativePastTimePresentationString(testDate, 'en');

    // Assert
    expect(actualRelativeTimeString).toBeNull();
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
