import { z } from 'zod'
import { DATE_FORMAT_REGEX } from '~/constants/app/validation'

export const DateParamSchema = z.string().regex(DATE_FORMAT_REGEX)
