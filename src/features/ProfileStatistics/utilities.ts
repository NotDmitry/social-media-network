import type { StatsCardProps } from './StatsCard';
import type { TableRow, TableViewProps } from './TableView';
import type { ProfileStatisticsQueryData } from './types';

const DAYS_IN_WEEK = 7;

const monthFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
});

interface Activity {
  creationDate: string;
}

type DataPeriod = 'day' | 'week' | 'month';

interface ActivityPeriod {
  start: Date;
  endExclusive: Date;
}

interface ActivityTableOptions extends Pick<TableViewProps, 'caption' | 'columnHeaders'> {
  dataPeriod: DataPeriod;
  periodsCount: number;
}

function getWeekStatsCardDataView(title: string, activities: Activity[]): StatsCardProps {
  const currentDate = new Date();
  const currentWeekStart = new Date(currentDate);
  currentWeekStart.setHours(0, 0, 0, 0);
  currentWeekStart.setDate(currentWeekStart.getDate() - 6);

  const currentWeekEnd = new Date(currentDate);
  currentWeekEnd.setHours(24, 0, 0, 0);

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const { currentWeekActivitiesCount, previousWeekActivitiesCount } = activities.reduce((stats, activity) => {
    const activityCreationDate = new Date(activity.creationDate);

    if (activityCreationDate >= currentWeekStart && activityCreationDate < currentWeekEnd) {
      stats.currentWeekActivitiesCount++;
    } else if (activityCreationDate >= previousWeekStart && activityCreationDate < currentWeekStart) {
      stats.previousWeekActivitiesCount++;
    }

    return stats;
  }, {
    previousWeekActivitiesCount: 0,
    currentWeekActivitiesCount: 0,
  });

  let trendText = 'No activity in the previous week';

  if (previousWeekActivitiesCount > 0) {
    const weekPercentageDifference = Math.round(
      ((currentWeekActivitiesCount - previousWeekActivitiesCount) / previousWeekActivitiesCount) * 100
    );

    trendText = `${weekPercentageDifference > 0 ? '+' : ''}${String(weekPercentageDifference)}% week over week`;
  }

  return {
    title,
    data: String(currentWeekActivitiesCount),
    trendText,
  };
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

function formatDayAndMonth(date: Date) {
  return `${String(date.getDate())} ${monthFormatter.format(date)}`;
}

function getActivityPeriodTableHeading(activityPeriod: ActivityPeriod, dataPeriod: DataPeriod) {
  if (dataPeriod === 'day') {
    return formatDayAndMonth(activityPeriod.start);
  }

  if (dataPeriod === 'week') {
    const weekEndInclusive = new Date(activityPeriod.endExclusive);
    weekEndInclusive.setDate(weekEndInclusive.getDate() - 1);

    return `${formatDayAndMonth(activityPeriod.start)} – ${formatDayAndMonth(weekEndInclusive)}`;
  }

  return monthFormatter.format(activityPeriod.start);
}


function getActivityTableView(
  activities: Activity[],
  { caption, columnHeaders, dataPeriod, periodsCount }: ActivityTableOptions
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
    rowHeading: getActivityPeriodTableHeading(activityPeriod, dataPeriod),
    dataSlots: [activityPerPeriodCounts[index]],
  }));

  return {
    caption,
    columnHeaders,
    data,
  };
}

export function toProfileStatisticsCardsView(activityStats: ProfileStatisticsQueryData) {
  return [
    getWeekStatsCardDataView('My Posts', activityStats.mePosts),
    getWeekStatsCardDataView('My Likes', activityStats.meLikes),
    getWeekStatsCardDataView('My Comments', activityStats.meComments),
  ];
}

export function toProfileStatisticsTablesView(activityStats: ProfileStatisticsQueryData) {
  return {
    likes: getActivityTableView(
      activityStats.meLikes,
      {
        caption: 'Likes for the last 10 days',
        columnHeaders: ['Date', 'Likes'],
        dataPeriod: 'day',
        periodsCount: 10,
      }
    ),
    comments: getActivityTableView(
      activityStats.meComments,
      {
        caption: 'Comments for the last year',
        columnHeaders: ['Month', 'Comments'],
        dataPeriod: 'month',
        periodsCount: 12,
      }
    ),
  };
}
