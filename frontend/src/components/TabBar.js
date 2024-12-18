import React from 'react';

/**
 * TabBar component provides navigation between different views
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.onTabChange - Handler for tab changes
 * @param {number} props.readLaterCount - Number of items in read later
 * @param {number} props.favoritesCount - Number of items in favorites
 */
const TabBar = ({
  activeTab,
  onTabChange,
  readLaterCount,
  favoritesCount
}) => {
  return (
    <div className="tabs">
      <button
        className={`tab-button ${activeTab === 'activities' ? 'active' : ''}`}
        onClick={() => onTabChange('activities')}
      >
        Activities
      </button>
      <button
        className={`tab-button ${activeTab === 'readLater' ? 'active' : ''}`}
        onClick={() => onTabChange('readLater')}
      >
        Read Later ({readLaterCount})
      </button>
      <button
        className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
        onClick={() => onTabChange('favorites')}
      >
        Favorites ({favoritesCount})
      </button>
    </div>
  );
};

export default TabBar; 