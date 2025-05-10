import { createTheme, responsiveFontSizes, Theme, ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}

// Base theme settings
const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    h1: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h5: {
      fontSize: '0.875rem',
      fontWeight: 600
    },
    h6: {
      fontSize: '0.75rem',
      fontWeight: 600
    },
    body1: {
      fontSize: '0.8125rem',
      letterSpacing: '0.01em'
    },
    body2: {
      fontSize: '0.75rem',
      letterSpacing: '0.01em'
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.02em',
      fontSize: '0.8125rem'
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small'
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '6px',
          padding: '4px 12px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }
        }),
        outlinedInherit: ({ theme }) => ({
          color: theme.palette.text.primary,
          borderColor: 'rgba(0, 0, 0, 0.23)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            borderColor: 'rgba(0, 0, 0, 0.23)'
          }
        }),
        text: ({ theme }) => ({
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.04)'
          }
        }),
        contained: ({ theme }) => ({
          color: '#fff',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark
          }
        }),
        outlined: ({ theme }) => ({
          color: theme.palette.text.primary,
          borderColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.04)'
          }
        })
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(8px)',
          background: 'rgba(255, 255, 255, 0.9)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '12px',
          '&:last-child': {
            paddingBottom: '12px'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 12px',
          fontSize: '0.8125rem',
          borderBottom: '1px solid rgba(0, 0, 0, 0.04)'
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(0, 0, 0, 0.01)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          padding: '4px 8px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            transform: 'translateX(2px)'
          }
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          padding: '6px 12px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.08)'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          height: '20px',
          fontSize: '0.75rem',
          fontWeight: 500
        },
        label: {
          padding: '0 8px'
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
          fontSize: '0.875rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          background: 'rgba(255, 255, 255, 0.9)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: 'none',
          height: 56
        }
      }
    },
    MuiToolbar: {
      defaultProps: {
        variant: 'dense'
      },
      styleOverrides: {
        dense: {
          height: 56,
          minHeight: 56
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            transform: 'translateY(-1px)'
          }
        }),
        colorInherit: ({ theme }) => ({
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        })
      }
    }
  },
  spacing: 4
};

// Light theme
const lightTheme = createTheme(deepmerge(baseTheme, {
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
    },
    divider: 'rgba(0, 0, 0, 0.06)',
  },
}));

// Dark theme
const darkTheme = createTheme(deepmerge(baseTheme, {
  palette: {
    mode: 'dark',
    primary: {
      main: '#818CF8',
      light: '#A5B4FC',
      dark: '#6366F1',
    },
    secondary: {
      main: '#34D399',
      light: '#6EE7B7',
      dark: '#10B981',
    },
    success: {
      main: '#34D399',
      light: '#6EE7B7',
      dark: '#10B981',
    },
    warning: {
      main: '#FBBF24',
      light: '#FCD34D',
      dark: '#F59E0B',
    },
    error: {
      main: '#F87171',
      light: '#FCA5A5',
      dark: '#EF4444',
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(31, 41, 55, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(31, 41, 55, 0.9)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)'
          }
        }),
        colorInherit: ({ theme }: { theme: Theme }) => ({
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)'
          }
        })
      }
    },
    MuiButton: {
      styleOverrides: {
        outlinedInherit: ({ theme }: { theme: Theme }) => ({
          color: theme.palette.text.primary,
          borderColor: 'rgba(255, 255, 255, 0.23)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'rgba(255, 255, 255, 0.23)'
          }
        })
      }
    }
  }
}));

// Apply responsive font sizes
export const theme = {
  light: responsiveFontSizes(lightTheme),
  dark: responsiveFontSizes(darkTheme),
};
