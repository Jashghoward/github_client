import React from 'react';

/**
 * Map of event types to their rendering functions
 * Each function takes an activity object and returns JSX
 */
const EVENT_RENDERERS = {
  PushEvent: (activity) => (
    <div className="event-details">
      <p>Branch: {activity.details.branch}</p>
      <p>Commits: {activity.details.commitCount}</p>
      {activity.details.commits?.map((commit, i) => (
        <div key={i} className="commit-info">
          <code>{commit.sha}</code>: {commit.message}
        </div>
      ))}
    </div>
  ),

  CreateEvent: (activity) => (
    <div className="event-details">
      <p>Created {activity.details.refType}: {activity.details.ref}</p>
      {activity.details.description && (
        <p>Description: {activity.details.description}</p>
      )}
    </div>
  ),

  PullRequestEvent: (activity) => (
    <div className="event-details">
      <p>
        PR #{activity.details.number}: {activity.details.title}
        <span className="event-status">{activity.details.state}</span>
      </p>
    </div>
  ),

  IssuesEvent: (activity) => (
    <div className="event-details">
      <p>
        Issue #{activity.details.number}: {activity.details.title}
        <span className="event-status">{activity.details.state}</span>
      </p>
    </div>
  ),

  IssueCommentEvent: (activity) => (
    <div className="event-details">
      <p>Commented on issue #{activity.details.issueNumber}</p>
      <p className="comment-body">{activity.details.commentBody}</p>
    </div>
  ),

  WatchEvent: () => (
    <div className="event-details">
      <p>Starred the repository</p>
    </div>
  ),

  ForkEvent: (activity) => (
    <div className="event-details">
      <p>Forked to: {activity.details.forkee}</p>
    </div>
  ),

  DeleteEvent: (activity) => (
    <div className="event-details">
      <p>Deleted {activity.details.refType}: {activity.details.ref}</p>
    </div>
  ),

  PublicEvent: () => (
    <div className="event-details">
      <p>Made repository public</p>
    </div>
  ),

  ReleaseEvent: (activity) => (
    <div className="event-details">
      <p>{activity.details.action} release: {activity.details.releaseName || activity.details.tagName}</p>
    </div>
  )
};

/**
 * EventDetails component renders specific details for different types of GitHub events
 * Uses a mapping of event types to render functions for better maintainability
 * @param {Object} props
 * @param {Object} props.activity - The activity data containing event details
 */
const EventDetails = ({ activity }) => {
  const renderEvent = EVENT_RENDERERS[activity.type];
  return renderEvent ? renderEvent(activity) : null;
};

export default EventDetails; 