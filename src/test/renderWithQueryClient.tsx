import { render } from 'vitest-browser-react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function renderWithQueryClient(ui: ReactNode) {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}
