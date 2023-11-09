import { createTheme } from '@mui/material/styles';

export default function theme(mode: 'light' | 'dark') {
	return createTheme({
		palette: {
			mode: mode,
		},

		components: {
			MuiInputBase: {
				styleOverrides: {
					root: {
						'input[type="date"]::-webkit-calendar-picker-indicator': {
							filter: mode === 'dark' ? 'invert(100%)' : '',
						},
					},
				},
			},
			MuiSelect: {
				styleOverrides: {
					select: {
						fontSize: '0.875rem',
					},
				},
			},
		},
	});
}
