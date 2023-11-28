import { Tooltip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useTheme } from '@mui/material';

export default function LinkCell(params: GridRenderCellParams) {
	const theme = useTheme()
	return (
		<Tooltip
			title={
				<a href={params.value} target='_blank'>
					Open Link in New Window
				</a>
			}>
			<span className='underline' style={{color: theme.palette.primary.main}}>{params.formattedValue}</span>
		</Tooltip>
	);
}
