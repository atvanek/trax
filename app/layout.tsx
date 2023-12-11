import type { Metadata } from 'next';
import '../styles/globals.css';
import ThemeRegistry from '@/theme/ThemeRegistry';
import { Roboto } from 'next/font/google';

export const metadata: Metadata = {
	title: 'Trax',
	description: 'Job Tracking App',
};

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
	display: 'swap',
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<ThemeRegistry>
				<body className={roboto.className}>{children}</body>
			</ThemeRegistry>
		</html>
	);
}
