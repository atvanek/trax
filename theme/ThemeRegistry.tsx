'use client';
import * as React from 'react';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import ToggleColorMode from './ToggleColorMode';
import { CssBaseline } from '@mui/material';

export default function ThemeRegistry({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
			<ToggleColorMode>
				<CssBaseline />
				{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
				{children}
			</ToggleColorMode>
		</NextAppDirEmotionCacheProvider>
	);
}
