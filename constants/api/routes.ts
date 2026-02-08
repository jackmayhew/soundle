// Client-side routes (hits Nuxt server routes proxy)
export const NUXT_API_ROUTES = {
  PUZZLE: (date: string) => `/api/puzzle/${date}`,
  GUESS: '/api/user-guess/guess',
  CONTACT: '/api/contact/contact',
  SUBMIT_RESULTS: '/api/puzzle-results/submit-results',
  GLOBAL_RESULTS: (date: string) => `/api/puzzle-results/${date}`,
  CREATE_REMINDER: '/api/reminders',
  REMINDER_SETTINGS: (userId: string) => `/api/reminders/${userId}`, // user id
  REMINDER_SETTINGS_BY_ID: (id: string) => `/api/reminders/subscription/${id}`, // reminder id
  UPDATE_REMINDER_SETTINGS: (userId: string) => `/api/reminders/${userId}`,
  UPDATE_REMINDER_SETTINGS_BY_ID: (id: string) => `/api/reminders/subscription/${id}`,
  UNSUBSCRIBE: '/api/reminders/unsubscribe',
}

// Backend endpoints (used in server routes)
export const FASTIFY_API_ROUTES = {
  PUZZLE: (date: string) => `/puzzle/${date}`,
  GUESS: '/guess',
  CONTACT: '/contact',
  SOUND: (date: string) => `/audio/${date}`,
  SUBMIT_RESULTS: '/submit-results',
  GLOBAL_RESULTS: (date: string) => `/global-results/${date}`,
  CREATE_REMINDER: '/reminders',
  REMINDER_SETTINGS: (userId: string) => `/reminders/${userId}`, // user id
  REMINDER_SETTINGS_BY_ID: (id: string) => `/reminders/settings/${id}`, // reminder id
  UPDATE_REMINDER_SETTINGS: (userId: string) => `/reminders/${userId}`,
  UPDATE_REMINDER_SETTINGS_BY_ID: (id: string) => `/reminders/settings/${id}`,
  UNSUBSCRIBE: '/unsubscribe',
}
