const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for read later and favorites
const readLater = new Set();
const favorites = new Set();

// GitHub API endpoint
const GITHUB_API = 'https://api.github.com';

app.get('/api/changes', async (req, res) => {
    try {
        const { username, page = 1 } = req.query;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        console.log(`Fetching events for user: ${username}, page: ${page}`);
        
        const perPage = 15;
        const headers = {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-Activity-Tracker'
        };

        // Get user's events directly from GitHub API
        const response = await axios.get(`${GITHUB_API}/users/${username}/events`, {
            headers,
            params: {
                per_page: perPage,
                page: page
            }
        });

        console.log('Events received:', response.data.map(event => event.type));

        const formattedEvents = response.data.map(event => ({
            id: event.id,
            type: event.type,
            repo: event.repo,
            created_at: event.created_at,
            isReadLater: readLater.has(event.id),
            isFavorite: favorites.has(event.id),
            details: formatEventDetails(event)
        }));

        // Check if there are more pages
        const hasMore = response.data.length === perPage;

        res.json({
            events: formattedEvents,
            pagination: {
                page: parseInt(page),
                hasMore,
                totalEvents: formattedEvents.length
            }
        });

    } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch changes' });
    }
});

function formatEventDetails(event) {
    switch (event.type) {
        case 'PushEvent':
            return {
                commits: event.payload.commits?.map(commit => ({
                    message: commit.message,
                    sha: commit.sha.substring(0, 7)
                })) || [],
                branch: event.payload.ref?.replace('refs/heads/', ''),
                commitCount: event.payload.size || 0
            };

        case 'CreateEvent':
            return {
                refType: event.payload.ref_type,
                ref: event.payload.ref,
                description: event.payload.description
            };

        case 'PullRequestEvent':
            return {
                action: event.payload.action,
                title: event.payload.pull_request?.title,
                number: event.payload.pull_request?.number,
                state: event.payload.pull_request?.state
            };

        case 'IssuesEvent':
            return {
                action: event.payload.action,
                title: event.payload.issue?.title,
                number: event.payload.issue?.number,
                state: event.payload.issue?.state
            };

        case 'IssueCommentEvent':
            return {
                action: event.payload.action,
                issueTitle: event.payload.issue?.title,
                issueNumber: event.payload.issue?.number,
                commentBody: event.payload.comment?.body?.substring(0, 100) + '...'
            };

        case 'WatchEvent':
            return {
                action: event.payload.action
            };

        case 'ForkEvent':
            return {
                forkee: event.payload.forkee?.full_name
            };

        default:
            return event.payload;
    }
}

app.post('/api/read-later', (req, res) => {
    const { id } = req.body;
    readLater.add(id);
    res.json({ success: true });
});

app.post('/api/favourites', (req, res) => {
    const { id } = req.body;
    favorites.add(id);
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