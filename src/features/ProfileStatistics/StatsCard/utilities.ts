import type { Activity } from '../types';
import type { StatsCardProps } from './index';

interface TrendLabels {
  noActivity: string;
  weekOverWeek: string;
}

export function toWeeklyStatsCardDataView(
  title: string,
  activities: Activity[],
  trendLabels: TrendLabels
): StatsCardProps {
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

  let trendText = trendLabels.noActivity;

  if (previousWeekActivitiesCount > 0) {
    const weekPercentageDifference = Math.round(
      ((currentWeekActivitiesCount - previousWeekActivitiesCount) / previousWeekActivitiesCount) * 100
    );

    const percentageText = `${weekPercentageDifference > 0 ? '+' : ''}${String(weekPercentageDifference)}%`;
    trendText = `${percentageText} ${trendLabels.weekOverWeek}`;
  }

  return {
    title,
    data: String(currentWeekActivitiesCount),
    trendText,
  };
}
