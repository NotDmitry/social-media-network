import { useState } from 'react';
import ToggleSwitch from '@shared/ui/ToggleSwitch';
import StatsCard from './StatsCard';
import TableView from './TableView';
import { TABLE_DATA } from './TableView/mocks';
import { CARDS_DATA } from './StatsCard/mocks';
import './style.css';

function ProfileStatisticsPage() {
  const [isChartViewEnabled, setIsChartViewEnabled] = useState(false);

  function toggleChartView(isToggled: boolean) {
    setIsChartViewEnabled(isToggled);
  }

  return (
    <div className='profile-statistics-page-container'>
      <div className='profile-statistics-cards-wrapper'>
        {CARDS_DATA.map((cardData) => (
          <StatsCard
            key={cardData.title}
            title={cardData.title}
            data={cardData.data}
            trendText={cardData.trendText}
          />
        ))}
      </div>
      {/* TODO: Switch label */}
      <div className='chart-view-switch-container'>
        <ToggleSwitch
          ariaLabel='Toggle chart view'
          isToggled={isChartViewEnabled}
          onToggle={toggleChartView}
        />
        <span className='chart-view-switch-label'>Enable Chart view</span>
      </div>
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
