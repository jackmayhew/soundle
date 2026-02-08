<div align="center">
 <img src="docs/assets/soundle.png" alt="Soundle" width="300">

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

- New daily puzzle
- Play any past puzzle from the archive
- LLM-powered guess evaluation
- Player stats and streak tracking
- Share results and stats as text or an image
- Optional email reminders for new puzzles

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
# Clone repository
git clone https://github.com/jackmayhew/loon.git

# Install dependencies
pnpm install

# Run development server
pnpm dev  # Note: Full functionality requires a backend connection
```

The app runs at http://localhost:3000

## Contributing

Issues and pull requests are welcome.

## License

MIT License - see [LICENSE](LICENSE) file for details
