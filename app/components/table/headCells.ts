import { HeadCell } from '@/types';

const headCells: readonly HeadCell[] = [
	{
		id: 'date',
		numeric: false,
		disablePadding: false,
		label: 'Date',
	},
	{
		id: 'company',
		numeric: false,
		disablePadding: false,
		label: 'Company',
	},
	{
		id: 'jobTitle',
		numeric: false,
		disablePadding: false,
		label: 'Job Title',
	},
	{
		id: 'compensation',
		numeric: true,
		disablePadding: false,
		label: 'Compensation',
	},
	{
		id: 'location',
		numeric: false,
		disablePadding: false,
		label: 'Location',
	},
	{
		id: 'jobURL',
		numeric: false,
		disablePadding: false,
		label: 'Job Posting URL',
	},
];

export default headCells;
