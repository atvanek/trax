import type { Metadata } from 'next';
import '../styles/globals.css';
import ThemeRegistry from '@/theme/ThemeRegistry';

export const metadata: Metadata = {
	title: 'Trax',
	description: 'Job Tracking App',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<ThemeRegistry>
				<body>{children}</body>
			</ThemeRegistry>
		</html>
	);
}
