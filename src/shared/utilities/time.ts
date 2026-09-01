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

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
  style: 'short',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function getRelativeTimePresentationString(dateTimeString: string) {
  const nowTimestamp = Date.now();
  const date = new Date(dateTimeString)
  const dateTimestamp = date.getTime();

  if (Number.isNaN(dateTimestamp)) {
    return 'TIME_ERROR';
  }

  const dateDiff = dateTimestamp - nowTimestamp;
  const absoluteDateDiff = Math.abs(dateDiff);

  if (absoluteDateDiff > MS_IN_WEEK) {
    return dateTimeFormatter.format(date);
  }

  for (const [unit, msThreshold] of Object.entries(displayedUnitsMsThresholds) as
    [Intl.RelativeTimeFormatUnit, number][]) {

    if (absoluteDateDiff >= msThreshold) {
      return relativeTimeFormatter.format(Math.round(dateDiff / msThreshold), unit);
    }
  }

  return 'now';
}
