export const IS_DEV = import.meta.env.DEV

export const SITE_URL = IS_DEV
  ? 'http://localhost:3000'
  : 'https://soundle.game'
