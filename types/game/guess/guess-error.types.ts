export type GuessValidationError = 'empty' | 'tooLong' | 'schemaError'
export type GuessServerError = 'serverInvalid' | 'serverError'
export type GuessError = GuessValidationError | GuessServerError
