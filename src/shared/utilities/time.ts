const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = 60 * MS_IN_SECOND;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;
const MS_IN_WEEK = 7 * MS_IN_DAY;

const displayedUnitsMsThresholds: Partial<Record<Intl.RelativeTimeFormatUnit, number>> = {
  day: MS_IN_DAY,
  hour: MS_IN_HOUR,
  minute: MS_IN_MINUTE,
};

const relativeTimeFormatters = new Map<string, Intl.RelativeTimeFormat>();
const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>();
const shortMonthFormatters = new Map<string, Intl.DateTimeFormat>();

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

/**
 * Returns the presentation string of elapsed time in the past relative to the current time (now).
 * The relative time thresholds are 'now', 'minutes', 'hours', 'days'.
 * For the elapsed time under 1 minute returns 'now'.
 * The amount is rounded to the nearest whole unit (like in Math.random rule).
 * Exact half units rounds towards zero (5 min 30 seconds is '5 min. ago').
 * If elapsed time is more than 7 days - the format changes to the full calendar date (e.g.: Oct 8, 2026)
 * Returns 'null' for time in the future or invalid ISO string.
 * @param dateTimeString A date time string in the ECMAScript supported format (ISO string).
 * @param locale A language code in the format accepted by Intl locales argument.
 */
export function getRelativePastTimePresentationString(dateTimeString: string, locale: string) {
  const nowTimestamp = Date.now();
  const date = new Date(dateTimeString);
  const dateTimestamp = date.getTime();

  if (Number.isNaN(dateTimestamp) || dateTimestamp > nowTimestamp) {
    return null;
  }

  const dateDiff = dateTimestamp - nowTimestamp;
  const absoluteDateDiff = Math.abs(dateDiff);

  if (absoluteDateDiff > MS_IN_WEEK) {
    return getDateTimeFormatter(locale).format(date);
  }

  const relativeTimeFormatter = getRelativeTimeFormatter(locale);

  for (const [unit, msThreshold] of Object.entries(displayedUnitsMsThresholds) as
    [Intl.RelativeTimeFormatUnit, number][]) {

    if (absoluteDateDiff >= msThreshold) {
      return relativeTimeFormatter.format(Math.round(dateDiff / msThreshold), unit);
    }
  }

  return relativeTimeFormatter.format(0, 'second');
}

/**
 * Returns the month string in the short format e.g.: 'Jan', 'Aug'.
 * @param locale A language code in the format accepted by Intl locales argument.
 */
export function getShortMonthPresentationString(date: Date, locale: string) {
  return getShortMonthFormatter(locale).format(date);
}
