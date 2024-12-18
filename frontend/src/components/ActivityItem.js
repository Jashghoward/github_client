import React from 'react';
import { BsBookmark, BsBookmarkFill, BsStar, BsStarFill, BsTrash } from 'react-icons/bs';
import EventDetails from './EventDetails';

/**
 * ActivityItem component displays a single GitHub activity with its details and action buttons
 * @param {Object} props
 * @param {Object} props.activity - The activity data to display
 * @param {string} props.activeTab - Current active tab ('activities', 'readLater', 'favorites')
 * @param {Array} props.readLater - List of read later items
 * @param {Array} props.favorites - List of favorite items
 * @param {Function} props.onReadLater - Handler for read later action
 * @param {Function} props.onFavorite - Handler for favorite action
 * @param {Function} props.onRemoveReadLater - Handler for removing from read later
 * @param {Function} props.onRemoveFavorite - Handler for removing from favorites
 */
const ActivityItem = ({
  activity,
  activeTab,
  readLater,
  favorites,
  onReadLater,
  onFavorite,
  onRemoveReadLater,
  onRemoveFavorite
}) => {
  const isReadLater = readLater.some(item => item.id === activity.id);
  const isFavorite = favorites.some(item => item.id === activity.id);

  return (
    <div className="activity-item">
      <div className="activity-header">
        <h3>{activity.type}</h3>
        <span className="activity-date">
          {new Date(activity.created_at).toLocaleDateString()}
        </span>
      </div>
      <div className="repo-name">{activity.repo.name}</div>
      <EventDetails activity={activity} />
      <div className="action-buttons">
        {activeTab === 'activities' ? (
          <>
            <button
              className={`action-button ${isReadLater ? 'active' : ''}`}
              onClick={() => isReadLater ? onRemoveReadLater(activity.id) : onReadLater(activity)}
              title={isReadLater ? "Remove from Read Later" : "Add to Read Later"}
            >
              {isReadLater ? <BsBookmarkFill /> : <BsBookmark />}
            </button>
            <button
              className={`action-button favorite ${isFavorite ? 'active' : ''}`}
              onClick={() => isFavorite ? onRemoveFavorite(activity.id) : onFavorite(activity)}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {isFavorite ? <BsStarFill /> : <BsStar />}
            </button>
          </>
        ) : (
          <button
            className="action-button remove"
            onClick={() => 
              activeTab === 'readLater' 
                ? onRemoveReadLater(activity.id) 
                : onRemoveFavorite(activity.id)
            }
            title={`Remove from ${activeTab === 'readLater' ? 'Read Later' : 'Favorites'}`}
          >
            <BsTrash />
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityItem; 