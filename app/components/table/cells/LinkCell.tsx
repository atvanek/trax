import { Tooltip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';

export default function LinkCell(params: GridRenderCellParams) {
	return (
		<Tooltip
			title={
				<a href={params.value} target='_blank'>
					Open Link in New Window
				</a>
			}>
			<span className='underline'>{params.formattedValue}</span>
		</Tooltip>
	);
}
