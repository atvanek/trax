import statuses from '@/utils/statuses';
import NotesEditor from '@/app/components/table/cells/NotesEditor';
import NotesCell from '@/app/components/table/cells/NotesCell';
import {
	GridColDef,
	GridRenderEditCellParams,
	GridRenderCellParams,
} from '@mui/x-data-grid';
import LinkCell from '@/app/components/table/cells/LinkCell';
import { Rating } from '@mui/material';
import { GridValueGetterParams } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
	{
		field: 'date',
		headerName: 'Date',
		editable: true,
		type: 'date',
		valueGetter: (params: GridValueGetterParams) => {
			console.log(typeof params.value);
			return params?.value && new Date(params.value);
		},
	},
	{
		field: 'company',
		headerName: 'Company',
		editable: true,
	},
	{
		field: 'jobTitle',
		headerName: 'Job Title',
		editable: true,
	},
	{
		field: 'compensation',
		headerName: 'Compensation',
		editable: true,
		width: 175,
	},
	{
		field: 'location',
		headerName: 'Location',
		editable: true,
	},
	{
		field: 'jobStatus',
		headerName: 'Status',
		editable: true,
		type: 'singleSelect',
		valueOptions: statuses,
	},
	{
		field: 'rating',
		headerName: 'Rating',
		renderCell: (params: GridRenderCellParams) => (
			<Rating precision={0.5} size='small' value={params.value} />
		),
	},
	{
		field: 'jobURL',
		headerName: 'Job Posting URL',
		editable: true,
		renderCell: (params: GridRenderCellParams) => <LinkCell {...params} />,
	},
	{
		field: 'contactName',
		headerName: 'Contact Name',
		editable: true,
		type: 'string',
	},
	{
		field: 'notes',
		headerName: 'Notes',
		editable: true,
		type: 'string',
		renderCell: (params: GridRenderCellParams) => <NotesCell {...params} />,
		renderEditCell: (params: GridRenderEditCellParams) => (
			<NotesEditor {...params} />
		),
	},
].map((column) => ({ ...column, headerClassName: 'table-header' }));

export const defaultColumnWidths = () => {
	const defaultWidths: { [key: string]: null | number } = {};
	columns.forEach((column) => {
		defaultWidths[column.field] = column.width || null;
	});
	return defaultWidths;
};
