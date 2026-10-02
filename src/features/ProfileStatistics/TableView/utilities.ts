import { getShortMonthPresentationString } from '@/shared/utilities/time';
import type { Activity } from '../types';
import type { TableRow, TableViewProps } from './index';

const DAYS_IN_WEEK = 7;

type DataPeriod = 'day' | 'week' | 'month';

interface ActivityPeriod {
  start: Date;
  endExclusive: Date;
}

interface ActivityTableOptions extends Pick<TableViewProps, 'caption' | 'columnHeaders'> {
  dataPeriod: DataPeriod;
  periodsCount: number;
  locale: string;
}

function getActivityPeriods(dataPeriod: DataPeriod, periodsCount: number): ActivityPeriod[] {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const firstPeriodStart = new Date(currentDate);

  if (dataPeriod === 'day') {
    firstPeriodStart.setDate(firstPeriodStart.getDate() - periodsCount + 1);
  } else if (dataPeriod === 'week') {
    firstPeriodStart.setDate(firstPeriodStart.getDate() - periodsCount * DAYS_IN_WEEK + 1);
  } else {
    firstPeriodStart.setDate(1);
    firstPeriodStart.setMonth(firstPeriodStart.getMonth() - periodsCount + 1);
  }

  const activityPeriods: ActivityPeriod[] = [];
  let periodStart = firstPeriodStart;

  for (let i = 0; i < periodsCount; i++) {
    const nextPeriodStart = new Date(periodStart);

    if (dataPeriod === 'day') {
      nextPeriodStart.setDate(nextPeriodStart.getDate() + 1);
    } else if (dataPeriod === 'week') {
      nextPeriodStart.setDate(nextPeriodStart.getDate() + DAYS_IN_WEEK);
    } else {
      nextPeriodStart.setMonth(nextPeriodStart.getMonth() + 1);
    }

    activityPeriods.push({
      start: periodStart,
      endExclusive: nextPeriodStart,
    });

    periodStart = nextPeriodStart;
  }

  return activityPeriods;
}

function formatDayAndMonth(date: Date, locale: string) {
  return `${String(date.getDate())} ${getShortMonthPresentationString(date, locale)}`;
}

function getActivityPeriodTableHeading(activityPeriod: ActivityPeriod, dataPeriod: DataPeriod, locale: string) {
  if (dataPeriod === 'day') {
    return formatDayAndMonth(activityPeriod.start, locale);
  }

  if (dataPeriod === 'week') {
    const weekEndInclusive = new Date(activityPeriod.endExclusive);
    weekEndInclusive.setDate(weekEndInclusive.getDate() - 1);

    return `${formatDayAndMonth(activityPeriod.start, locale)} – ${formatDayAndMonth(weekEndInclusive, locale)}`;
  }

  return getShortMonthPresentationString(activityPeriod.start, locale);
}

export function toActivityTableView(
  activities: Activity[],
  { caption, columnHeaders, dataPeriod, periodsCount, locale }: ActivityTableOptions
): TableViewProps {
  const activityPeriods = getActivityPeriods(dataPeriod, periodsCount);
  const activityPerPeriodCounts = new Array<number>(periodsCount).fill(0);

  activities.forEach((activity) => {
    const activityCreationDate = new Date(activity.creationDate);

    const periodIndex = activityPeriods.findIndex((period) => (
      activityCreationDate >= period.start && activityCreationDate < period.endExclusive
    ));

    if (periodIndex !== -1) {
      activityPerPeriodCounts[periodIndex]++;
    }
  });

  const data: TableRow[] = activityPeriods.map((activityPeriod, index) => ({
    rowHeading: getActivityPeriodTableHeading(activityPeriod, dataPeriod, locale),
    dataSlots: [activityPerPeriodCounts[index]],
  }));

  return {
    caption,
    columnHeaders,
    data,
  };
}

