import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const SimulationCreateSchema = z.object({
  title: z.string().min(1).max(200),
  scenarioPrompt: z.string().min(10).max(5000),
  domain: z.string().min(1).max(100),
  agentCount: z.number().int().min(10).max(100).default(30),
  totalRounds: z.number().int().min(1).max(20).default(5),
  parameters: z.object({
    volatility: z.number().min(0.1).max(1.0).default(0.35),
    clusteringCoefficient: z.number().min(0.1).max(1.0).default(0.6),
    polarizationThreshold: z.number().min(0.1).max(1.0).default(0.5),
  }).default({}),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type SimulationCreateInput = z.infer<typeof SimulationCreateSchema>;
