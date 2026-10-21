const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = 60 * MS_IN_SECOND;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;
const MS_IN_WEEK = 7 * MS_IN_DAY;
const MAX_DISPLAYED_HOURS = 23;

const relativeTimeFormatters = new Map<string, Intl.RelativeTimeFormat>();
const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>();
const shortMonthFormatters = new Map<string, Intl.DateTimeFormat>();
const dayShortMonthFormatters = new Map<string, Intl.DateTimeFormat>();

function getRelativeTimeFormatter(locale: string) {
  let relativeTimeFormatter = relativeTimeFormatters.get(locale);

  if (relativeTimeFormatter === undefined) {
    relativeTimeFormatter = new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto',
      style: 'short',
    });

    relativeTimeFormatters.set(locale, relativeTimeFormatter);
  }

  return relativeTimeFormatter;
}

function getDateTimeFormatter(locale: string) {
  let dateTimeFormatter = dateTimeFormatters.get(locale);

  if (dateTimeFormatter === undefined) {
    dateTimeFormatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    dateTimeFormatters.set(locale, dateTimeFormatter);
  }

  return dateTimeFormatter;
}

function getShortMonthFormatter(locale: string) {
  let shortMonthFormatter = shortMonthFormatters.get(locale);

  if (shortMonthFormatter === undefined) {
    shortMonthFormatter = new Intl.DateTimeFormat(locale, {
      month: 'short',
    });

    shortMonthFormatters.set(locale, shortMonthFormatter);
  }

  return shortMonthFormatter;
}

function getDayShortMonthFormatter(locale: string) {
  let dayShortMonthFormatter = dayShortMonthFormatters.get(locale);

  if (dayShortMonthFormatter === undefined) {
    dayShortMonthFormatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
    });

    dayShortMonthFormatters.set(locale, dayShortMonthFormatter);
  }

  return dayShortMonthFormatter;
}

/**
 * Returns the string representing how far in the past the activity occurred.
 * If the activity occurred in previous calendar days they are displayed as 'yesterday',
 * '2 days ago' - '7 days ago' regardless of the amount of time between calendar days change.
 * Future timestamps and time under 1 minute ago during the day returns 'now'.
 * Other timestamps are converted as 'hours' or 'minutes' ago rounded to the nearest whole unit
 * Exact half units rounds towards zero (5 min 30 seconds is '5 min. ago') like in Math.round rule.
 * If elapsed time is more than 7 days - the format changes to the full calendar date (e.g.: Oct 8, 2026)
 * Returns 'null' for invalid ISO string.
 * @param dateTimeString A date time string in the ECMAScript supported format (ISO string).
 * @param locale A language code in the format accepted by Intl locales argument.
 */
export function getRelativePastTimePresentationString(dateTimeString: string, locale: string) {
  const now = new Date();
  const nowTimestamp = now.getTime();
  const date = new Date(dateTimeString);
  const dateTimestamp = date.getTime();

  if (Number.isNaN(dateTimestamp)) {
    return null;
  }

  const timestampDifference = Math.min(dateTimestamp - nowTimestamp, 0);
  const elapsedTimeMs = Math.abs(timestampDifference);

  if (elapsedTimeMs > MS_IN_WEEK) {
    return getDateTimeFormatter(locale).format(date);
  }

  const relativeTimeFormatter = getRelativeTimeFormatter(locale);

  if (elapsedTimeMs === 0) {
    return relativeTimeFormatter.format(0, 'second');
  }

  const todayStartTimestamp = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const providedDateStartTimestamp = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const elapsedCalendarDays = (todayStartTimestamp - providedDateStartTimestamp) / MS_IN_DAY;

  if (elapsedCalendarDays > 0) {
    return relativeTimeFormatter.format(-elapsedCalendarDays, 'day');
  }

  if (elapsedTimeMs < MS_IN_MINUTE) {
    return relativeTimeFormatter.format(0, 'second');
  }

  if (elapsedTimeMs > MS_IN_HOUR - MS_IN_MINUTE / 2) {
    const roundedHours = Math.abs(Math.round(timestampDifference / MS_IN_HOUR));
    const displayedHours = Math.min(roundedHours, MAX_DISPLAYED_HOURS);

    return relativeTimeFormatter.format(-displayedHours, 'hour');
  }

  const roundedMinutes = Math.abs(Math.round(timestampDifference / MS_IN_MINUTE));
  return relativeTimeFormatter.format(-roundedMinutes, 'minute');
}

/**
 * Returns the month string in the short format e.g.: 'Jan', 'Aug'.
 * @param locale A language code in the format accepted by Intl locales argument.
 */
export function getShortMonthPresentationString(date: Date, locale: string) {
  return getShortMonthFormatter(locale).format(date);
}

/**
 * Returns the 'day short_month' date presentation string in day-first format.
 * Month forms come from locale-aware day-month formatter
 * E.g.: May 13th is '13 May' in English and '13 мая' in Russian.
 * @param locale A language code in the format accepted by Intl locales argument.
 */
export function getDayShortMonthPresentationString(date: Date, locale: string) {
  const dateParts = getDayShortMonthFormatter(locale).formatToParts(date);
  const day = dateParts.find(({ type }) => type === 'day');
  const month = dateParts.find(({ type }) => type === 'month');

  if (day === undefined || month === undefined) {
    throw new Error('Date formatter couldn\'t find date parts');
  }

  return `${day.value} ${month.value}`;
}
