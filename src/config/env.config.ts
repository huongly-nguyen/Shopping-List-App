import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
});

export const ENV = envSchema.parse(process.env);
export type EnvType = typeof ENV;
