import { render } from 'vitest-browser-react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { StyledEngineProvider } from '@mui/material/styles';

export function renderWithRouterAndMuiStyles(ui: ReactNode) {
  return render(ui, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <StyledEngineProvider injectFirst>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </StyledEngineProvider>
    ),
  });
}
