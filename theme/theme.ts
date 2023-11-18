import { createTheme, Theme, Components } from '@mui/material/styles';

interface CustomTheme extends Theme {
	components?: Components & {
		MuiDataGrid?: {
			styleOverrides?: {
				columnHeader?: {
					':hover'?: {
						cursor?: string;
					};
				};
			};
		};
	};
}

export default function theme(mode: 'light' | 'dark') {
	return createTheme({
		palette: {
			mode,
			...(mode === 'light'
				? {
						// palette values for light mode
						primary: {
							main: '#763DF0',
							dark: '#522AA8',
							light: '#9163F3',
						},
						// ... other palette values
				  }
				: {
						primary: {
							main: '#c57fff',
						},
						// ... other palette values
				  }),
		},
		components: {
			MuiDataGrid: {
				styleOverrides: {
					columnHeader: {
						':hover': {
							cursor: 'grab',
						},
					},
				},
			},
			MuiInputBase: {
				styleOverrides: {
					root: {
						'input[type="date"]::-webkit-calendar-picker-indicator': {
							filter: mode === 'dark' ? 'invert(100%)' : '',
						},
						fontSize: '.875rem',
					},
				},
			},
			MuiSelect: {
				styleOverrides: {
					select: {
						fontSize: '.875rem',
					},
				},
			},
		} as CustomTheme['components'], // Cast to CustomTheme['components']
	});
}
