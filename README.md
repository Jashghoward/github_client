# GitHub Activity Feed

A React application that displays GitHub user activities with the ability to save favorites and read later items.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A GitHub Personal Access Token

## Setup

1. Clone the repository:
```bash
git clone [your-repository-url]
cd github_client
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the backend directory:
```bash
# backend/.env
GITHUB_TOKEN=your_github_personal_access_token
```

## Running the Application

1. Start the backend server:
```bash
# In the backend directory
npm node server.js
```
The backend will run on http://localhost:5001

2. Start the frontend (in a new terminal):
```bash
# In the frontend directory
npm start
```
The frontend will run on http://localhost:3000

## Using the Application

1. Open http://localhost:3000 in your browser
2. Enter a GitHub username in the search box
3. View their GitHub activities
4. Use the bookmark icon to save items to read later
5. Use the star icon to favorite items

## Features

- View GitHub user activities
- Search through activities
- Save items for later reading
- Favorite items

## Troubleshooting

- If you see a "Failed to fetch" error, make sure both backend and frontend servers are running
- If no activities show up, verify your GitHub token has the correct permissions
