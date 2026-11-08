import { z } from 'zod';

export const createFlagSchema = z.object({
  key: z
    .string()
    .min(2, 'Key must be at least 2 characters')
    .max(100, 'Key must be at most 100 characters')
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      'Key must be lowercase alphanumeric with hyphens (e.g. new-checkout-flow)'
    ),
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  environment: z.enum(['dev', 'staging', 'prod'], {
    errorMap: () => ({ message: "Environment must be 'dev', 'staging', or 'prod'" }),
  }),
  enabled: z.boolean().optional().default(false),
});

export const filterFlagsSchema = z.object({
  environment: z.enum(['dev', 'staging', 'prod']).optional(),
  status: z.enum(['enabled', 'disabled']).optional(),
  search: z.string().optional(),
});

