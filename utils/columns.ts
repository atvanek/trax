import { GridColDef } from '@mui/x-data-grid';
import statuses from '@/utils/statuses';

export const columns: GridColDef[] = [
	{
		field: 'date',
		headerName: 'Date',
		editable: true,
		type: 'date',
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
		field: 'status',
		headerName: 'Status',
		editable: true,
		type: 'singleSelect',
		valueOptions: statuses,
	},
	{
		field: 'jobURL',
		headerName: 'Job Posting URL',
		editable: true,
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
	},
].map((column) => ({ ...column, headerClassName: 'table-header' }));

export const defaultColumnWidths = () => {
	const defaultWidths: { [key: string]: null | number } = {};
	columns.forEach((column) => {
		defaultWidths[column.field] = column.width || null;
	});
	return defaultWidths;
};
