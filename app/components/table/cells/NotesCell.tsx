import { Tooltip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';

export default function NotesCell(params: GridRenderCellParams) {
	return (
		<Tooltip title={params.formattedValue}>{params.formattedValue}</Tooltip>
	);
}
