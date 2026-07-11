<div align="center">
<img src="docs/assets/soundle.png" alt="Soundle" width="200">

 ##

 [![CC BY-NC-SA 4.0](https://img.shields.io/badge/license-CC_BY--NC--SA_4.0-blue.svg)](LICENSE)
 [![GitHub stars](https://img.shields.io/github/stars/jackmayhew/soundle)](https://github.com/jackmayhew/soundle)

*A daily audio puzzle. Can you guess the sound?*

[🌐 Website](https://soundle.game/) | [💬 Support](https://github.com/jackmayhew/soundle/issues)

<img src="docs/assets/grid.gif" alt="grid animation">
</div>

## About

Players listen to a short audio clip and try to guess what the sound is. Guesses are evaluated by an LLM, and a hint is returned for incorrect guesses.

Stats and streaks are saved locally so players can track their progress over time.

## Features

- New daily puzzle
- Play any past puzzle from the archive
- LLM-powered guess evaluation
- Player stats and streak tracking
- Share results and stats as an image or text
- Optional email reminders for new puzzles

## Tech stack

### Frontend (this repo)

- Nuxt 4
- TypeScript
- Pinia
- Zod
- Tailwind CSS
- GSAP

### Backend (separate repo)

- Fastify
- TypeScript
- PostgreSQL
- LLM integration

## Development

Install dependencies:

```bash
# Clone repository
git clone https://github.com/jackmayhew/soundle.git

# Install dependencies
pnpm install

# Create your local environment file and fill in the required values
cp .env.example .env

# Run development server
pnpm dev  # Note: Full functionality requires a backend connection
```

The app runs at http://localhost:3000

## Contributing

Issues and pull requests are welcome.

## License

This project is licensed under CC BY-NC-SA 4.0. See [LICENSE](LICENSE) for details.
