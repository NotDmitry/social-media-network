import type { StatsCardProps } from './StatsCard';
import type { ProfileStatisticsQueryData } from './types';

interface Activity {
  creationDate: string;
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

export function toProfileStatisticsCardsView(activityStats: ProfileStatisticsQueryData) {
  return [
    getWeekStatsCardDataView('My Posts', activityStats.mePosts),
    getWeekStatsCardDataView('My Likes', activityStats.meLikes),
    getWeekStatsCardDataView('My Comments', activityStats.meComments),
  ];
}
