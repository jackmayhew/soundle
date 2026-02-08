<div align="center">
 <img src="docs/assets/soundle.png" alt="Soundle" width="150" height="210">

 ##

 [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
 [![GitHub stars](https://img.shields.io/github/stars/jackmayhew/soundle)](https://github.com/jackmayhew/soundle)

*A daily audio puzzle. Can you guess the sound?*

[🌐 Website](https://soundle.game/) | [💬 Support](https://github.com/jackmayhew/soundle/issues)

<img src="docs/assets/grid.gif" alt="grid animation">
</div>

## About

Soundle serves one shared puzzle per day. Players listen to a short audio clip and submit guesses. Each guess is evaluated by an LLM, which returns feedback on how close the guess is to the correct answer.

Stats and streaks are stored so players can track progress over time.

## Features

- Daily rotating puzzle
- 6 guesses per game
- LLM-based guess evaluation
- Per-player stats and streak tracking
- Result sharing

## Tech stack

### Frontend (this repo)

- Nuxt 4
- TypeScript
- Zod
- Tailwind CSS
- GSAP

### Backend (separate repo)

- Fastify
- PostgreSQL
- TypeScript
- LLM integration

## Development

Install dependencies:

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The app runs at http://localhost:3000

## Environment

Create a `.env` file and set:

NUXT_PUBLIC_API_URL=your_backend_url

## Contributing

Issues and pull requests are welcome.

## License

MIT
