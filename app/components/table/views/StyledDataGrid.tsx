import { DataGrid } from '@mui/x-data-grid';
import { styled, Theme } from '@mui/material/styles';
import { mangoFusionPalette } from '@mui/x-charts';
import statuses from '@/utils/statuses';
import { GridCellParams } from '@mui/x-data-grid';
import toCamelCase from '@/utils/toCamelCase';

const getColors = (mode: 'light' | 'dark') => mangoFusionPalette(mode);
const getCellClassName = (string: string) =>
	string.replaceAll(/\/| /g, '') + '-cell';

const styles = (theme: Theme) => {
	const colors = getColors(theme.palette.mode);
	return statuses.map((status, index) => {
		const color = colors[index % colors.length];
		return {
			[`.${getCellClassName(status)}`]: {
				backgroundColor: color,
				color: theme.palette.getContrastText(color),
			},
			[`.${toCamelCase(status)}-select`]: {
				backgroundColor: color,
				color: theme.palette.getContrastText(color),
			},
			[`.${getCellClassName(status)} .MuiSelect-select`]: {
				backgroundColor: color,
				color: theme.palette.getContrastText(color),
			},
			'.MuiDataGrid-columnHeaders': {
				backgroundColor: theme.palette.action.selected,
			},
		};
	});
};

const StyledDataGrid = styled(DataGrid)(({ theme }) => {
	return styles(theme);
});
export default function StyledTable(props: any) {
	return (
		<StyledDataGrid
			{...props}
			getCellClassName={(params: GridCellParams<any, any, number>) => {
				if (statuses.includes(params.value)) {
					return getCellClassName(params.value);
				} else return '';
			}}
		/>
	);
}
