'use client';

import statuses from '@/utils/statuses';
import NotesEditor from '@/app/components/table/cells/NotesEditor';
import NotesCell from '@/app/components/table/cells/NotesCell';
import {
	GridColDef,
	GridRenderEditCellParams,
	GridRenderCellParams,
} from '@mui/x-data-grid';
import LinkCell from '@/app/components/table/cells/LinkCell';
import { GridValueGetterParams } from '@mui/x-data-grid';

export const defaultColumns: GridColDef[] = [
	{
		field: 'date',
		headerName: 'Date',
		editable: true,
		headerClassName: 'table-header',
		type: 'date',
		valueGetter: (params: GridValueGetterParams) => {
			return params?.value && new Date(params.value);
		},
	},
	{
		field: 'company',
		headerName: 'Company',
		editable: true,
		headerClassName: 'table-header',
	},
	{
		field: 'jobTitle',
		headerName: 'Job Title',
		editable: true,
		headerClassName: 'table-header',
	},
	{
		field: 'compensation',
		headerName: 'Compensation',
		editable: true,
		headerClassName: 'table-header',
		width: 175,
	},
	{
		field: 'location',
		headerName: 'Location',
		editable: true,
		headerClassName: 'table-header',
	},
	{
		field: 'jobStatus',
		headerName: 'Status',
		editable: true,
		headerClassName: 'table-header',
		type: 'singleSelect',
		valueOptions: statuses,
	},
	{
		field: 'jobURL',
		headerName: 'Job Posting URL',
		editable: true,
		headerClassName: 'table-header',
		renderCell: (params: GridRenderCellParams) => <LinkCell {...params} />,
	},
	{
		field: 'contactName',
		headerName: 'Contact Name',
		editable: true,
		headerClassName: 'table-header',
		type: 'string',
	},
	{
		field: 'notes',
		headerName: 'Notes',
		editable: true,
		headerClassName: 'table-header',
		type: 'string',
		renderCell: (params: GridRenderCellParams) => <NotesCell {...params} />,
		renderEditCell: (params: GridRenderEditCellParams) => (
			<NotesEditor {...params} />
		),
	},
];

export const defaultColumnWidths = () => {
	const defaultWidths: { [key: string]: null | number } = {};
	defaultColumns.forEach((column) => {
		defaultWidths[column.field] = column.width || null;
	});
	return defaultWidths;
};

export const defaultColumnOrder = defaultColumns.map((column, index) => ({
	[column.field]: index,
}));
