import React from 'react';

/**
 * SearchBar component provides inputs for username and activity search
 * @param {Object} props
 * @param {string} props.username - Current username value
 * @param {string} props.searchTerm - Current search term value
 * @param {Function} props.onUsernameChange - Handler for username changes
 * @param {Function} props.onSearchChange - Handler for search term changes
 */
const SearchBar = ({
  username,
  searchTerm,
  onUsernameChange,
  onSearchChange
}) => {
  return (
    <div className="search-container">
      <input
        type="text"
        className="username-input"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
      />
      <input
        type="text"
        className="search-input"
        placeholder="Search activities..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar; 