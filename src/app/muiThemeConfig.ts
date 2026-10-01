import { createTheme } from '@mui/material/styles';

export const muiGlobalTheme = createTheme({
  cssVariables: {
    nativeColor: true,
  },
  palette: {
    primary: {
      main: 'var(--color-brand-primary-500)',
      dark: 'var(--color-brand-primary-600)',
      contrastText: 'var(--color-neutral-white)',
    },
    secondary: {
      main: 'var(--color-brand-primary-25)',
      dark: 'var(--color-brand-primary-600)',
      contrastText: 'var(--color-neutral-white)',
    },
    action: {
      active: 'var(--icon-dark)',
    },
  },
  typography: {
    fontFamily: 'var(--font-family)',
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'var(--color-brand-primary-500)',
          color: 'var(--color-neutral-white)',
          fontSize: '0.75rem',
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 24,
          height: 24,
          backgroundColor: 'var(--color-brand-primary-500)',
          color: 'var(--color-neutral-white)',
        },
      },
    },
    MuiFab: {
      defaultProps: {
        color: 'secondary',
      }
    },
    MuiIconButton: {
      defaultProps: {
        disableFocusRipple: true,
      },
      styleOverrides: {
        root: {
          transition: 'all 0.25s ease-in-out',
          '&:hover': {
            backgroundColor: 'var(--color-brand-primary-25)',
          },
          '&.Mui-focusVisible': {
            outline: '2px solid var(--color-brand-primary-500)',
            outlineOffset: 2,
          },
        },
      },
    },
  }
});
