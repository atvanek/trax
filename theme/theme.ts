import { createTheme, Theme, Components } from '@mui/material/styles';

export interface CustomTheme extends Theme {
	components?: Components & {
		nav?: {
			height?: number;
		};
		drawer?: {
			width?: number;
		};
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
const navHeight = 64;
export default function theme(mode: 'light' | 'dark') {
	return createTheme({
		palette: {
			mode,
			...(mode === 'light'
				? {
						primary: {
							main: '#763DF0',
							dark: '#522AA8',
							light: '#9163F3',
						},
						action: {
							hover: '#BB9EF80A',
							selected: '#763DF014',
							focus: '#BB9EF81F',
						},
				  }
				: {
						primary: {
							main: '#c57fff',
						},
				  }),
		},
		typography: {
			allVariants: {
				fontFamily: 'inherit',
			},
		},

		components: {
			nav: {
				height: 64,
			},
			drawer: {
				width: 90,
			},
			MuiDataGrid: {
				styleOverrides: {
					columnHeader: {
						'.MuiDataGrid-columnHeaderTitle': {
							'font-weight': '600 !important',
						},
						'.MuiDataGrid-columnSeparator svg': {
							fontSize: '1.75em !important',
						},

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
			MuiAppBar: {
				styleOverrides: {
					root: {
						position: 'fixed',
						zIndex: 3,
					},
				},
			},
			MuiDrawer: {
				styleOverrides: {
					paper: {
						paddingTop: navHeight,
						zIndex: 1,
					},
				},
			},
		} as CustomTheme['components'], // Cast to CustomTheme['components']
	});
}
