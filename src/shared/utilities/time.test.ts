import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { getRelativePastTimePresentationString, getShortMonthPresentationString } from './time';

describe('getRelativePastTimePresentationString', () => {
  const fixedTestTime = new Date('2026-06-13T09:00:00.000Z');

  const relativeTimeCases = [
    { elapsedTime: '0 seconds', dateTimeString: '2026-06-13T09:00:00.000Z', expected: 'now' },
    { elapsedTime: '59 seconds', dateTimeString: '2026-06-13T08:59:01.000Z', expected: 'now' },
    { elapsedTime: '1 minute', dateTimeString: '2026-06-13T08:59:00.000Z', expected: '1 min. ago' },
    { elapsedTime: '1 minute 1 second', dateTimeString: '2026-06-13T08:58:59.000Z', expected: '1 min. ago' },
    { elapsedTime: '5 minutes 20 seconds', dateTimeString: '2026-06-13T08:54:40.000Z', expected: '5 min. ago' },
    { elapsedTime: '5 minutes 30 seconds', dateTimeString: '2026-06-13T08:54:30.000Z', expected: '5 min. ago' },
    { elapsedTime: '5 minutes 40 seconds', dateTimeString: '2026-06-13T08:54:20.000Z', expected: '6 min. ago' },
    { elapsedTime: '59 minutes', dateTimeString: '2026-06-13T08:01:00.000Z', expected: '59 min. ago' },
    { elapsedTime: '1 hour', dateTimeString: '2026-06-13T08:00:00.000Z', expected: '1 hr. ago' },
    { elapsedTime: '1 hour 1 second', dateTimeString: '2026-06-13T07:59:59.000Z', expected: '1 hr. ago' },
    { elapsedTime: '23 hours', dateTimeString: '2026-06-12T10:00:00.000Z', expected: '23 hr. ago' },
    { elapsedTime: '1 day', dateTimeString: '2026-06-12T09:00:00.000Z', expected: 'yesterday' },
    { elapsedTime: '1 day 1 second', dateTimeString: '2026-06-12T08:59:59.000Z', expected: 'yesterday' },
    { elapsedTime: '2 days', dateTimeString: '2026-06-11T09:00:00.000Z', expected: '2 days ago' },
    { elapsedTime: '7 days - 1 ms', dateTimeString: '2026-06-06T09:00:00.001Z', expected: '7 days ago' },
    { elapsedTime: '7 days', dateTimeString: '2026-06-06T09:00:00.000Z', expected: '7 days ago' },
    { elapsedTime: '7 days + 1 ms', dateTimeString: '2026-06-06T08:59:59.999Z', expected: 'Jun 6, 2026' },
    { elapsedTime: '8 days', dateTimeString: '2026-06-05T09:00:00.000Z', expected: 'Jun 5, 2026' },
    { elapsedTime: '1 month', dateTimeString: '2026-05-13T09:00:00.000Z', expected: 'May 13, 2026' },
    { elapsedTime: '1 year', dateTimeString: '2025-06-13T09:00:00.000Z', expected: 'Jun 13, 2025' },
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
    const testDate = '2026-06-13T09:00:00.001Z';

    // Act
    const actualRelativeTimeString = getRelativePastTimePresentationString(testDate, 'en');

    // Assert
    expect(actualRelativeTimeString).toBeNull();
  });

  test('switches locales without stale cache', () => {
    // Arrange
    const testDate = '2026-06-11T09:00:00.000Z';

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
