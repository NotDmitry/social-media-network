import { useState } from 'react';
import ToggleSwitch from '@shared/ui/ToggleSwitch';
import './style.css';

function ProfileStatisticsPage() {
  const [isChartViewEnabled, setIsChartViewEnabled] = useState(false);

  function toggleChartView(isToggled: boolean) {
    setIsChartViewEnabled(isToggled);
  }

  return (
    <div className='profile-statistics-page-container'>
      <div className='profile-statistics-cards-wrapper'>
        <div>Card 1</div>
        <div>Card 2</div>
        <div>Card 3</div>
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
        </section>
        <section className='data-view-container'>
          <h2 className='data-view-title'>Comments</h2>
        </section>
      </div>
    </div>
  );
}

export default ProfileStatisticsPage;
