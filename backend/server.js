const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for read later and favorites
const readLater = new Map();
const favorites = new Map();

// GitHub API endpoint
const GITHUB_API = 'https://api.github.com';

// Event formatters for different event types
const EVENT_FORMATTERS = {
  PushEvent: (event) => ({
    commits: event.payload.commits?.map(commit => ({
      message: commit.message,
      sha: commit.sha.substring(0, 7)
    })) || [],
    branch: event.payload.ref?.replace('refs/heads/', ''),
    commitCount: event.payload.size || 0
  }),

  CreateEvent: (event) => ({
    refType: event.payload.ref_type,
    ref: event.payload.ref,
    description: event.payload.description
  }),

  PullRequestEvent: (event) => ({
    action: event.payload.action,
    title: event.payload.pull_request?.title,
    number: event.payload.pull_request?.number,
    state: event.payload.pull_request?.state
  }),

  IssuesEvent: (event) => ({
    action: event.payload.action,
    title: event.payload.issue?.title,
    number: event.payload.issue?.number,
    state: event.payload.issue?.state
  }),

  IssueCommentEvent: (event) => ({
    action: event.payload.action,
    issueTitle: event.payload.issue?.title,
    issueNumber: event.payload.issue?.number,
    commentBody: event.payload.comment?.body?.substring(0, 100) + '...'
  }),

  WatchEvent: (event) => ({
    action: event.payload.action
  }),

  ForkEvent: (event) => ({
    forkee: event.payload.forkee?.full_name
  }),

  DeleteEvent: (event) => ({
    refType: event.payload.ref_type,
    ref: event.payload.ref
  }),

  PublicEvent: () => ({}),

  ReleaseEvent: (event) => ({
    action: event.payload.action,
    releaseName: event.payload.release?.name,
    tagName: event.payload.release?.tag_name
  })
};

/**
 * Formats the details of a GitHub event based on its type
 * @param {Object} event - The GitHub event to format
 * @returns {Object} Formatted event details
 */
function formatEventDetails(event) {
  const formatter = EVENT_FORMATTERS[event.type];
  return formatter ? formatter(event) : {};
}

app.get('/api/changes', async (req, res) => {
    try {
        const { username, page = 1 } = req.query;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const perPage = 15;
        const currentPage = parseInt(page);
        
        const headers = {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-Activity-Tracker'
        };

        try {
            // First check if user exists
            await axios.get(`${GITHUB_API}/users/${username}`, { headers });
        } catch (error) {
            // If user doesn't exist, return empty results instead of error
            return res.json({
                events: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    totalItems: 0,
                    itemsPerPage: perPage
                }
            });
        }

        // Fetch events for the current page directly from GitHub API
        const response = await axios.get(`${GITHUB_API}/users/${username}/events`, {
            headers,
            params: {
                per_page: perPage,
                page: currentPage
            }
        });

        // Parse the Link header to get pagination info
        const linkHeader = response.headers.link || '';
        const links = linkHeader.split(',').reduce((acc, link) => {
            const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);
            if (match) {
                acc[match[2]] = match[1];
            }
            return acc;
        }, {});

        // Calculate total pages from the last link
        let totalPages = currentPage;
        if (links.last) {
            const lastPageMatch = links.last.match(/[?&]page=(\d+)/);
            if (lastPageMatch) {
                totalPages = parseInt(lastPageMatch[1]);
            }
        }

        const formattedEvents = response.data.map(event => ({
            id: event.id,
            type: event.type,
            repo: event.repo,
            created_at: event.created_at,
            details: formatEventDetails(event),
            isReadLater: readLater.has(event.id),
            isFavorite: favorites.has(event.id)
        }));

        res.json({
            events: formattedEvents,
            pagination: {
                currentPage,
                totalPages,
                hasNextPage: Boolean(links.next),
                hasPreviousPage: Boolean(links.prev),
                totalItems: totalPages * perPage,
                itemsPerPage: perPage
            }
        });

    } catch (error) {
        // Return empty results for any other errors
        res.json({
            events: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
                totalItems: 0,
                itemsPerPage: 15
            }
        });
    }
});

// Get read later items
app.get('/api/read-later', (req, res) => {
    const items = Array.from(readLater.values());
    res.json(items);
});

// Add to read later
app.post('/api/read-later', (req, res) => {
    const activity = req.body;
    if (!activity || !activity.id) {
        return res.status(400).json({ error: 'Invalid activity data' });
    }
    readLater.set(activity.id, activity);
    res.json({ success: true, activity });
});

// Remove from read later
app.delete('/api/read-later/:id', (req, res) => {
    const { id } = req.params;
    readLater.delete(id);
    res.json({ success: true });
});

// Get favorites
app.get('/api/favorites', (req, res) => {
    const items = Array.from(favorites.values());
    res.json(items);
});

// Add to favorites
app.post('/api/favorites', (req, res) => {
    const activity = req.body;
    if (!activity || !activity.id) {
        return res.status(400).json({ error: 'Invalid activity data' });
    }
    favorites.set(activity.id, activity);
    res.json({ success: true, activity });
});

// Remove from favorites
app.delete('/api/favorites/:id', (req, res) => {
    const { id } = req.params;
    favorites.delete(id);
    res.json({ success: true });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment check:', {
        tokenExists: !!process.env.GITHUB_TOKEN,
        tokenLength: process.env.GITHUB_TOKEN?.length
    });
}); 