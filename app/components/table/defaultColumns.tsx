'use client';

import statuses from '@/utils/statuses';
import NotesEditor from '@/app/components/table/cells/NotesEditor';
import NotesCell from '@/app/components/table/cells/NotesCell';
import {
	GridColDef,
	GridRenderEditCellParams,
	GridRenderCellParams,
	GridActionsCellItem,
	GridRowId,
	GridValueGetterParams,
} from '@mui/x-data-grid';
import LinkCell from '@/app/components/table/cells/LinkCell';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import InputWithDebounce from './cells/InputWithDebounce';

export const createDefaultColumns = (
	handleRequestDelete: (id: GridRowId) => void
): GridColDef[] => {
	return [
		{
			field: 'actions',
			type: 'actions',
			width: 50,
			cellClassName: 'actions',
			headerClassName: 'table-header',
			getActions: ({ id }) => {
				return [
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label='Delete'
						onClick={() => handleRequestDelete(id)}
						color='inherit'
						key={'delete-' + id}
					/>,
				];
			},
		},
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
			renderEditCell: (params: GridRenderEditCellParams) => (
				<InputWithDebounce {...params} />
			),
		},
		{
			field: 'jobTitle',
			headerName: 'Job Title',
			editable: true,
			headerClassName: 'table-header',
			renderEditCell: (params: GridRenderEditCellParams) => (
				<InputWithDebounce {...params} />
			),
		},
		{
			field: 'compensation',
			headerName: 'Compensation',
			editable: true,
			headerClassName: 'table-header',
			width: 175,
			renderEditCell: (params: GridRenderEditCellParams) => (
				<InputWithDebounce {...params} />
			),
		},
		{
			field: 'location',
			headerName: 'Location',
			editable: true,
			headerClassName: 'table-header',
			renderEditCell: (params: GridRenderEditCellParams) => (
				<InputWithDebounce {...params} />
			),
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
			renderEditCell: (params: GridRenderEditCellParams) => (
				<InputWithDebounce {...params} />
			),
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
};

export default createDefaultColumns;
