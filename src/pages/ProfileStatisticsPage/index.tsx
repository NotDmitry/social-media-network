import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client/react';
import ChartView from '@/features/ProfileStatistics/ChartView';
import StatsCard from '@/features/ProfileStatistics/StatsCard';
import TableView from '@/features/ProfileStatistics/TableView';
import { GET_PROFILE_STATISTICS } from '@/features/ProfileStatistics/api/getProfileStatistics';
import { toActivityTableView } from '@/features/ProfileStatistics/TableView/utilities';
import { toWeeklyStatsCardDataView } from '@/features/ProfileStatistics/StatsCard/utilities';
import Spinner from '@/shared/ui/Spinner';
import ToggleSwitch from '@/shared/ui/ToggleSwitch';
import './style.css';

function ProfileStatisticsPage() {
  const { t, i18n } = useTranslation('profile');
  const [isChartViewEnabled, setIsChartViewEnabled] = useState(false);
  const locale = i18n.resolvedLanguage ?? i18n.language;

  const statsCardsTitles = {
    posts: t(($) => $.statistics.cards.posts),
    likes: t(($) => $.statistics.cards.likes),
    comments: t(($) => $.statistics.cards.comments),
  }

  const statsCardsTrendLabels = {
    noActivity: t(($) => $.statistics.cards.trend.noActivity),
    weekOverWeek: t(($) => $.statistics.cards.trend.weekOverWeek),
  };

  const statsTablesLabels = {
    likes: {
      caption: t(($) => $.statistics.tables.likes.caption),
      columnHeaders: [
        t(($) => $.statistics.tables.likes.columns.date),
        t(($) => $.statistics.tables.likes.columns.likes)
      ],
    },
    comments: {
      caption: t(($) => $.statistics.tables.comments.caption),
      columnHeaders: [
        t(($) => $.statistics.tables.comments.columns.month),
        t(($) => $.statistics.tables.comments.columns.comments),
      ],
    },
  }

  const {
    data: statistics,
    loading: isStatisticsQueryPending,
    error: statisticsQueryError
  } = useQuery(GET_PROFILE_STATISTICS, { fetchPolicy: 'cache-and-network' });

  let statsCardsData;
  let statsTablesData;

  if (statistics) {
    statsCardsData = [
      toWeeklyStatsCardDataView(statsCardsTitles.posts, statistics.mePosts, statsCardsTrendLabels),
      toWeeklyStatsCardDataView(statsCardsTitles.likes, statistics.meLikes, statsCardsTrendLabels),
      toWeeklyStatsCardDataView(statsCardsTitles.comments, statistics.meComments, statsCardsTrendLabels),
    ];

    statsTablesData = {
      likes: toActivityTableView(
        statistics.meLikes,
        {
          caption: statsTablesLabels.likes.caption,
          columnHeaders: statsTablesLabels.likes.columnHeaders,
          dataPeriod: 'day',
          periodsCount: 10,
          locale,
        }
      ),
      comments: toActivityTableView(
        statistics.meComments,
        {
          caption: statsTablesLabels.comments.caption,
          columnHeaders: statsTablesLabels.comments.columnHeaders,
          dataPeriod: 'month',
          periodsCount: 12,
          locale,
        }
      ),
    };
  }

  let statisticsStatusMessage: string | null = null;

  const isInitialStatisticsQueryPending = isStatisticsQueryPending && statistics === undefined;

  if (statisticsQueryError && statistics === undefined) {
    statisticsStatusMessage = t(($) => $.statistics.error);
  }

  function handleChartViewToggle(isToggled: boolean) {
    setIsChartViewEnabled(isToggled);
  }

  return (
    <div className='profile-statistics-page-container'>
      <h1 className='visually-hidden'>{t(($) => $.statistics.title)}</h1>
      <section className='profile-statistics-cards-wrapper'>
        <h2 className='visually-hidden'>{t(($) => $.statistics.cards.title)}</h2>

        {isInitialStatisticsQueryPending ? (
          <Spinner label={t(($) => $.statistics.loading)} />
        ) : (statisticsStatusMessage &&
          <p className='stats-card-list-message'>{statisticsStatusMessage}</p>
        )}

        {statsCardsData?.map((cardData) => (
          <StatsCard key={cardData.title} {...cardData} />
        ))}
      </section>
      <ToggleSwitch
        label={t(($) => $.statistics.chartToggle)}
        isToggled={isChartViewEnabled}
        onToggle={handleChartViewToggle}
      />
      <div className='data-views-wrapper'>
        <section className='data-view-container'>
          <h2 className='data-view-title'>{t(($) => $.statistics.likes)}</h2>
          {statsTablesData &&
            <div className={`data-view-card ${isChartViewEnabled ? 'data-view-card_chart' : ''}`}>
              {isChartViewEnabled ? (
                <ChartView
                  type='line'
                  data={statsTablesData.likes.data}
                  isCompactDateLabels={true}
                />
              ) : (
                <TableView {...statsTablesData.likes} />
              )}
            </div>
          }
        </section>
        <section className='data-view-container'>
          <h2 className='data-view-title'>{t(($) => $.statistics.comments)}</h2>
          {statsTablesData &&
            <div className={`data-view-card ${isChartViewEnabled ? 'data-view-card_chart' : ''}`}>
              {isChartViewEnabled ? (
                <ChartView
                  type='bar'
                  data={statsTablesData.comments.data}
                />
              ) : (
                <TableView {...statsTablesData.comments} />
              )}
            </div>
          }
        </section>
      </div>
    </div>
  );
}

export default ProfileStatisticsPage;
