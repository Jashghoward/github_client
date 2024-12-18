/**
 * Base URL for the backend API
 */
const API_BASE_URL = 'http://localhost:5001';

/**
 * Service for handling all GitHub-related API calls
 */
const githubService = {
  /**
   * Fetch both read later and favorites items
   * @returns {Promise<{readLater: Array, favorites: Array}>}
   */
  async fetchSavedItems() {
    const [readLaterRes, favoritesRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/read-later`),
      fetch(`${API_BASE_URL}/api/favorites`)
    ]);
    
    const readLater = await readLaterRes.json();
    const favorites = await favoritesRes.json();
    
    return { readLater, favorites };
  },

  /**
   * Fetch GitHub activities for a specific user
   * @param {string} username - GitHub username
   * @param {number} page - Page number for pagination
   * @returns {Promise<{events: Array, pagination: Object}>}
   */
  async fetchUserActivities(username, page) {
    const response = await fetch(`${API_BASE_URL}/api/changes?username=${username}&page=${page}`);
    return await response.json();
  },

  /**
   * Add an item to read later
   * @param {Object} activity - Activity to add
   * @returns {Promise<Object>}
   */
  async addToReadLater(activity) {
    const response = await fetch(`${API_BASE_URL}/api/read-later`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    return response.ok;
  },

  /**
   * Add an item to favorites
   * @param {Object} activity - Activity to add
   * @returns {Promise<Object>}
   */
  async addToFavorites(activity) {
    const response = await fetch(`${API_BASE_URL}/api/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    return response.ok;
  },

  /**
   * Remove an item from read later
   * @param {string} activityId - ID of activity to remove
   * @returns {Promise<boolean>}
   */
  async removeFromReadLater(activityId) {
    const response = await fetch(`${API_BASE_URL}/api/read-later/${activityId}`, {
      method: 'DELETE',
    });
    return response.ok;
  },

  /**
   * Remove an item from favorites
   * @param {string} activityId - ID of activity to remove
   * @returns {Promise<boolean>}
   */
  async removeFromFavorites(activityId) {
    const response = await fetch(`${API_BASE_URL}/api/favorites/${activityId}`, {
      method: 'DELETE',
    });
    return response.ok;
  }
};

export default githubService; 