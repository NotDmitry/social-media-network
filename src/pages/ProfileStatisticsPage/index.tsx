import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import StatsCard from '@/features/ProfileStatistics/StatsCard';
import { GET_PROFILE_STATISTICS } from '@/features/ProfileStatistics/api/getProfileStatistics';
import { toProfileStatisticsCardsView } from '@/features/ProfileStatistics/utilities';
import ToggleSwitch from '@/shared/ui/ToggleSwitch';
import { TABLE_DATA } from '@/shared/mocks/TableViewMocks';
import TableView from './TableView';
import './style.css';

function ProfileStatisticsPage() {
  const [isChartViewEnabled, setIsChartViewEnabled] = useState(false);

  const {
    data: statistics,
    loading: isStatisticsQueryPending,
    error: statisticsQueryError
  } = useQuery(GET_PROFILE_STATISTICS, { fetchPolicy: 'cache-and-network' });


  let statsCardsData;

  if (statistics) {
    statsCardsData = toProfileStatisticsCardsView(statistics);
  }

  let statisticsStatusMessage: string | null = null;

  if (isStatisticsQueryPending && statistics === undefined) {
    statisticsStatusMessage = 'Loading...';
  } else if (statisticsQueryError && statistics === undefined) {
    statisticsStatusMessage = 'Unable to load statistics';
  }

  function handleChartViewToggle(isToggled: boolean) {
    setIsChartViewEnabled(isToggled);
  }

  return (
    <div className='profile-statistics-page-container'>
      <h1 className='visually-hidden'>Profile statistics page</h1>
      <section className='profile-statistics-cards-wrapper'>
        <h2 className='visually-hidden'>Statistics cards view</h2>

        {statisticsStatusMessage &&
          <p className='stats-card-list-message'>{statisticsStatusMessage}</p>
        }

        {statsCardsData?.map((cardData) => (
          <StatsCard key={cardData.title} {...cardData} />
        ))}
      </section>
      <ToggleSwitch
        label='Enable Chart view'
        isToggled={isChartViewEnabled}
        onToggle={handleChartViewToggle}
      />
      <div className='data-views-wrapper'>
        <section className='data-view-container'>
          <h2 className='data-view-title'>Likes</h2>
          {isChartViewEnabled ? (
            <div style={{ width: '200px', height: '200px', backgroundColor: 'yellow' }}>Chart 1</div>
          ) : (
            <TableView
              caption={TABLE_DATA.caption}
              columnHeaders={TABLE_DATA.columnHeaders}
              data={TABLE_DATA.data}
            />
          )}
        </section>
        <section className='data-view-container'>
          <h2 className='data-view-title'>Comments</h2>
          {isChartViewEnabled ? (
            <div style={{ width: '200px', height: '200px', backgroundColor: 'yellow' }}>Chart 2</div>
          ) : (
            <TableView
              caption={TABLE_DATA.caption}
              columnHeaders={TABLE_DATA.columnHeaders}
              data={TABLE_DATA.data}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default ProfileStatisticsPage;
