import { z } from 'zod';

export const ROUTES = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  profile: '/profile',
  statistics: '/profile/statistics',
  error: '/error',
} as const;

export const errorRouteStateSchema = z.object({
  retryPath: z.string().nonempty(),
});

export type ErrorRouteState = z.infer<typeof errorRouteStateSchema>;
