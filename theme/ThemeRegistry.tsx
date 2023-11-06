'use client';
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import theme from './theme';
import ToggleColorMode from './ToggleColorMode';

export default function ThemeRegistry({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
			<ToggleColorMode>
				{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
			
				{children}
			</ToggleColorMode>
		</NextAppDirEmotionCacheProvider>
	);
}
