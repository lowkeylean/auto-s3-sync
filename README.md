Instagram Comment Likes Leaderboard – Automation Script

This repository contains a modular Node.js + TypeScript automation script designed to generate a leaderboard of users ranked by the total likes received on their Instagram comments across all posts.

The project is structured for scalability, API integration, and compatibility with a no/low-code workflow using n8n, Google Apps Script, or external CRON triggers.

Key features:
- Fetches Instagram post data via API or webhooks
- Aggregates total likes per commenter
- Generates a ranked leaderboard
- Exports results to JSON, Google Sheets, or a database
- Fully typed codebase in TypeScript

Ready for integration with:
- n8n workflows
- Google Cloud functions
- Local cron/PM2
- Future mobile/web apps

root/
│── src/
│    ├── index.ts        # Main entry point
│    ├── instagram.ts    # API wrapper / request logic
│    ├── utils.ts        # Helper functions
│    └── types.ts        # Type definitions and interfaces
│
│── dist/                 # Auto-generated compiled JS files
│── package.json
│── tsconfig.json
│── README.md


Technologies used:
- Node.js
- TypeScript
- Axios (API calls)
- dotenv (environment variables)
- Google APIs / Graph APIs (optional)
- n8n for workflow automation
- Apps Script experience for webhook + sheet automation


Installation:
git clone https://github.com/lowkeylean/auto-s3-sync.git
cd auto-s3-sync
npm install

Development Mode in TS:
npx ts-node src/index.ts

Build to JS:
npm run build

Run JS Output:
node dist/index.js


Env variables after creating a new file:
{{ACCESS TOKENS:}}

This project serves as a demonstration of:
- Node.js automation capability
- API integration skill
- Background in Google workflow automation
- Clean TypeScript architecture