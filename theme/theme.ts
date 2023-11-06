import { createTheme } from '@mui/material/styles';

export default function theme(mode: 'light' | 'dark') {
	return createTheme({
		palette: {
			mode,
		},
	});
}
