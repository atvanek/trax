import { createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';
export const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
});
const theme = createTheme({
	palette: {
		mode: 'light',
	},
});

export default theme;
