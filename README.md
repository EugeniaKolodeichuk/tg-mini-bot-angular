# tg-mini-bot-angular

Telegram Mini App — Telegram bot backend + Angular 17 web app as a Mini App interface.

## Project Structure

```
tg-mini-bot-angular/
├── bot/                  # Telegram bot (Node.js + Telegraf)
│   ├── main.js
│   ├── .env              # secrets (not committed)
│   ├── .env.example      # env template
│   └── package.json
├── webapp/               # Angular 17 frontend (Mini App UI)
│   ├── src/
│   │   ├── app/
│   │   ├── index.html
│   │   └── styles.css
│   ├── angular.json
│   └── package.json
├── .gitignore
└── package.json          # npm workspaces root
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure the bot environment:
   ```bash
   cp bot/.env.example bot/.env
   ```
   Fill in `BOT_TOKEN` and `WEBAPP_URL` in `bot/.env`.

## Commands

| Command | Description |
|---|---|
| `npm run dev:bot` | Run bot in watch mode |
| `npm run start:bot` | Run bot |
| `npm run start:webapp` | Run Angular dev server |
| `npm run build:webapp` | Build Angular for production |
