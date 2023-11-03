import type { Metadata } from 'next';
import './globals.css';
import ThemeRegistry from '@/theme/ThemeRegistry';
import Nav from './components/Nav';

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
				<body>
					<Nav />
					{children}
				</body>
			</ThemeRegistry>
		</html>
	);
}
