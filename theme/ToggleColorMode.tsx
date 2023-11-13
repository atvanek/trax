'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import ColorModeContext from './ColorModeContext';
export default function ToggleColorMode({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mode, setMode] = React.useState<'light' | 'dark'>('light');
	const colorMode = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
			},
		}),
		[]
	);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme(mode)}>{children}</ThemeProvider>
		</ColorModeContext.Provider>
	);
}
