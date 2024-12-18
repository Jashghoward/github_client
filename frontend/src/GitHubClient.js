import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import TabBar from './components/TabBar';
import ActivityItem from './components/ActivityItem';
import Pagination from './components/Pagination';
import githubService from './services/githubService';
import { filterActivities } from './utils/filterUtils';

/**
 * Initial pagination state
 */
const INITIAL_PAGINATION = {
  currentPage: 1,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
  totalItems: 0,
  itemsPerPage: 15
};

/**
 * GitHubClient is the main component that orchestrates the GitHub activity viewer
 * It manages the state and data fetching for the entire application
 */
const GitHubClient = () => {
  // State management
  const [activities, setActivities] = useState([]);
  const [readLater, setReadLater] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('activities');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(INITIAL_PAGINATION);

  // Fetch initial saved items
  useEffect(() => {
    const loadSavedItems = async () => {
      try {
        const { readLater: readLaterData, favorites: favoritesData } = 
          await githubService.fetchSavedItems();
        setReadLater(readLaterData);
        setFavorites(favoritesData);
      } catch (err) {
        console.error('Error fetching saved items:', err);
      }
    };
    loadSavedItems();
  }, []);

  // Fetch activities when username or page changes
  useEffect(() => {
    const loadActivities = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await githubService.fetchUserActivities(username, page);
        setActivities(data.events || []);
        setPagination(data.pagination || INITIAL_PAGINATION);
      } catch (err) {
        setError('Failed to fetch activities');
        setActivities([]);
        setPagination(INITIAL_PAGINATION);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [username, page]);

  // Reset to first page when username changes
  useEffect(() => {
    if (username) {
      setPage(1);
      window.scrollTo(0, 0);
    }
  }, [username]);

  // Handler functions
  const handleReadLater = async (activity) => {
    try {
      const success = await githubService.addToReadLater(activity);
      if (success) {
        setReadLater(prev => [...prev, activity]);
      }
    } catch (err) {
      console.error('Error adding to read later:', err);
    }
  };

  const handleFavorite = async (activity) => {
    try {
      const success = await githubService.addToFavorites(activity);
      if (success) {
        setFavorites(prev => [...prev, activity]);
      }
    } catch (err) {
      console.error('Error adding to favorites:', err);
    }
  };

  const handleRemoveReadLater = async (activityId) => {
    try {
      const success = await githubService.removeFromReadLater(activityId);
      if (success) {
        setReadLater(prev => prev.filter(item => item.id !== activityId));
      }
    } catch (err) {
      console.error('Error removing from read later:', err);
    }
  };

  const handleRemoveFavorite = async (activityId) => {
    try {
      const success = await githubService.removeFromFavorites(activityId);
      if (success) {
        setFavorites(prev => prev.filter(item => item.id !== activityId));
      }
    } catch (err) {
      console.error('Error removing from favorites:', err);
    }
  };

  // Get currently displayed activities based on active tab and search term
  const displayedActivities = filterActivities(
    activeTab === 'activities' ? activities :
    activeTab === 'readLater' ? readLater :
    favorites,
    searchTerm
  );

  return (
    <div className="github-client">
      <h1>GitHub Activity Feed</h1>
      
      <SearchBar
        username={username}
        searchTerm={searchTerm}
        onUsernameChange={setUsername}
        onSearchChange={setSearchTerm}
      />

      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        readLaterCount={readLater.length}
        favoritesCount={favorites.length}
      />

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="activity-list">
            {displayedActivities.map(activity => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                activeTab={activeTab}
                readLater={readLater}
                favorites={favorites}
                onReadLater={handleReadLater}
                onFavorite={handleFavorite}
                onRemoveReadLater={handleRemoveReadLater}
                onRemoveFavorite={handleRemoveFavorite}
              />
            ))}
          </div>
          
          {activeTab === 'activities' && displayedActivities.length > 0 && (
            <Pagination
              pagination={pagination}
              onPreviousPage={() => setPage(prev => prev - 1)}
              onNextPage={() => setPage(prev => prev + 1)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GitHubClient; 







