import type { Activity } from '../types';
import type { StatsCardProps } from './index';

interface TrendLabels {
  noActivity: string;
  weekOverWeek: string;
}

/**
 * Returns a card view with the count of activities in the last 7 local calendar days including today.
 * Compares current count with the preceding week to calculate the trend.
 * When the preceding week doesn't have any data, uses the no-activity label;
 * otherwise shows the rounded percentage change with the week-over-week label ('+X%' | '-X%' | '0%').
 * @param title A title of the card
 * @param activities Raw activity stats which include creationDate
 * @param trendLabels A label describing the compared periods of data changing
 * @returns
 */
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
