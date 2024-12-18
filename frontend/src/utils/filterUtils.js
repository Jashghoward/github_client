/**
 * Filter activities based on search term
 * @param {Array} activities - List of activities to filter
 * @param {string} searchTerm - Term to filter by
 * @returns {Array} Filtered activities
 */
export const filterActivities = (activities, searchTerm) => {
  if (!searchTerm) return activities;
  
  const term = searchTerm.toLowerCase();
  return activities.filter(activity => 
    activity.type.toLowerCase().includes(term) ||
    activity.repo.name.toLowerCase().includes(term)
  );
}; 