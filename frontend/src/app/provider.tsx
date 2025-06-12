import type { ReactNode } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

interface AppProviderProps {
  children: ReactNode;
}

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
});

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      {children}
    </MantineProvider>
  );
}; 