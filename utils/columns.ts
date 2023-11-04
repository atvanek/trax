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
];

export const defaultColumnWidths = () => {
	const defaultWidths: { [key: string]: null | number } = {};
	columns.forEach((column) => {
		defaultWidths[column.field] = column.width || null;
	});
	return defaultWidths;
};
