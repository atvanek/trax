import { createTheme } from '@mui/material/styles';

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
						secondary: {
							main: '#C010DD',
							dark: '#860B9A',
							light: '#CC3FE3',
						},
						background: {
							paper: '#FAFAFA',
						},
						action: {
							hover: '#763DF014',
							selected: '#763DF014',
							focus: '#BB9EF81F',
		
						},
						error: {
							main: '#DC1E1E',
							dark: '#9A1515',
							light: '#E34B4B',
						},
						warning: {
							main: '#BD6808',
							dark: '#995302',
							light: '#F09228',
						},
				  }
				: {
						primary: {
							main: '#c57fff',
						},
						action: {
							hover: '#763DF014',
							selected: '#763DF014',
							focus: '#BB9EF81F',
						},
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
		},
	});
}
