import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		mode: 'light',
	},
	typography: {
		allVariants: {
			fontFamily: ['Inter', 'sans-serif'].join(','),
		},
	},
});

export default theme;
