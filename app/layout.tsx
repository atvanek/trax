import type { Metadata } from 'next';
import './globals.css';
import ThemeRegistry from '@/theme/ThemeRegistry';
import Nav from './components/Nav';
import { UserProvider } from '@auth0/nextjs-auth0/client';

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
				<UserProvider>
					<body>
						<Nav />
						{children}
					</body>
				</UserProvider>
			</ThemeRegistry>
		</html>
	);
}
