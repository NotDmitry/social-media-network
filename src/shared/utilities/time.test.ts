import { describe, expect, test } from 'vitest';
import { getShortMonthPresentationString } from './time';

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
