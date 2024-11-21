import React, { useState } from 'react';
import Rendimiento from './Rendimiento';
import Rentabilidad from './Rentabilidad';
import TabContent from './TabContent';

const GeneralInfoCard = () => {
  const [activeTab, setActiveTab] = useState('rendimiento');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'rendimiento':
        return <Rendimiento />;
      case 'rentabilidad':
        return <Rentabilidad />;
      case 'tab':
        return <TabContent />;
      default:
        return <Rendimiento />;
    }
  };

  return (
    <div className="general-info-card">
      <div className="tabs">
        <button onClick={() => setActiveTab('rendimiento')} className={activeTab === 'rendimiento' ? 'active' : ''}>
          Rendimiento
        </button>
        <button onClick={() => setActiveTab('rentabilidad')} className={activeTab === 'rentabilidad' ? 'active' : ''}>
          Rentabilidad
        </button>
        <button onClick={() => setActiveTab('tab')} className={activeTab === 'tab' ? 'active' : ''}>
          Tab
        </button>
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default GeneralInfoCard;
