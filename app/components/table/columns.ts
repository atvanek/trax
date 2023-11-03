import { GridColDef } from '@mui/x-data-grid';
import statuses from '@/utils/statuses';

const columns: GridColDef[] = [
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
		minWidth: 175,
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
		minWidth: 175,
	},
];

export default columns;
