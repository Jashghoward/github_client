# GitHub Activity Tracker

A modern web application that tracks and displays GitHub user activities, including commits, pull requests, issues, and more.

## Features

- Real-time GitHub activity tracking
- Filter activities by type or repository
- Mark activities for later reading
- Favorite important activities
- Pagination support
- Modern, clean UI

## Project Structure

```
github-activity-tracker/
├── backend/               # Backend Node.js server
│   ├── node_modules/     # Backend dependencies
│   ├── .env             # Environment variables (git-ignored)
│   ├── package.json     # Backend dependencies and scripts
│   └── server.js        # Express server implementation
│
└── frontend/             # React frontend application
    ├── node_modules/     # Frontend dependencies
    ├── public/          # Static files
    ├── src/             # Source code
    │   ├── App.js       # Main App component
    │   ├── GitHubClient.js # GitHub client component
    │   └── index.js     # Entry point
    └── package.json     # Frontend dependencies and scripts
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- GitHub Personal Access Token

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/github-activity-tracker.git
cd github-activity-tracker
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Configure backend:
- Create a `.env` file in the backend directory
- Add your GitHub token: `GITHUB_TOKEN=your_token_here`

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

5. Start the application:
- Backend: `cd backend && npm start`
- Frontend: `cd frontend && npm start`

The application will be available at `http://localhost:3000`

## Environment Variables

Backend `.env` file:
```
GITHUB_TOKEN=your_github_token_here
PORT=5001
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
