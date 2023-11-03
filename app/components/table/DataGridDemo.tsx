'use client';

import * as React from 'react';
import { RawJobData } from '@/types';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import columns from '../../../utils/columns';
import {
	GridRowModesModel,
	GridRowModes,
	DataGrid,
	GridColDef,
	GridActionsCellItem,
	GridEventListener,
	GridRowId,
	GridRowModel,
	GridRowEditStopReasons,
} from '@mui/x-data-grid';
import EditToolbar from './EditToolbar';

export default function DataGridDemo({ data }: { data: RawJobData[] }) {
	const [rows, setRows] = React.useState(data);
	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
		{}
	);
	// const [resizing, setResizing] = React.useState(false);
	// const [colR, setColR] = React.useState(null);
	// const [width, setWidth] = React.useState(50);

	// const handleListenForResizeStart = (e) => {
	// 	if (e.target?.classList?.contains('MuiDataGrid-iconSeparator')) {
	// 		console.log('resize start');
	// 		const column = e.target.parentNode.parentNode;
	// 		setResizing(true);
	// 		setColR(column.getBoundingClientRect().right);
	// 	}
	// };
	// const handleListenForResizeEnd = (e) => {
	// 	console.log(resizing);
	// 	if (!resizing) return;
	// 	console.log('resize end');
	// 	setResizing(false);
	// 	setColR(null);
	// };

	// const handleListenForResize = (e) => {
	// 	if (!resizing) return;
	// 	const diff = e.clientX - colR;
	// 	setWidth((prev) => prev + diff);
	// };

	// React.useEffect(() => {
	// 	addEventListener('mousedown', handleListenForResizeStart);
	// 	addEventListener('mousemove', handleListenForResize);
	// 	addEventListener('mouseup', handleListenForResizeEnd);
	// 	return () => {
	// 		removeEventListener('mousedown', handleListenForResizeStart);
	// 		removeEventListener('mousemove', handleListenForResize);
	// 		removeEventListener('mouseup', handleListenForResizeEnd);
	// 	};
	// }, [handleListenForResizeEnd, handleListenForResize]);

	//
	const handleRowEditStop: GridEventListener<'rowEditStop'> = (
		params,
		event
	) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const handleEditClick = (id: GridRowId) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (id: GridRowId) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};

	const handleDeleteClick = (id: GridRowId) => () => {
		setRows(rows.filter((row) => row.id !== id));
	};

	const handleCancelClick = (id: GridRowId) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});

		// const editedRow = rows.find((row) => row.id === id);
		// if (editedRow!.isNew) {
		// 	setRows(rows.filter((row) => row.id !== id));
		// }
	};

	const processRowUpdate = (newRow: GridRowModel) => {
		// const updatedRow = { ...newRow, isNew: false };
		// setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		// return updatedRow;
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const columnsWithEdit: GridColDef[] = [
		...columns,
		// {
		// 	field: 'resize',
		// 	headerName: 'Resize',
		// 	editable: true,
		// 	minWidth: 80,
		// 	maxWidth: 200,
		// 	// width: width,
		// },
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			width: 100,
			cellClassName: 'actions',
			getActions: ({ id }) => {
				const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

				if (isInEditMode) {
					return [
						<GridActionsCellItem
							icon={<SaveIcon />}
							label='Save'
							sx={{
								color: 'primary.main',
							}}
							onClick={handleSaveClick(id)}
							key={'save-' + id}
						/>,
						<GridActionsCellItem
							icon={<CancelIcon />}
							label='Cancel'
							className='textPrimary'
							onClick={handleCancelClick(id)}
							color='inherit'
							key={'cancel-' + id}
						/>,
					];
				}
				return [
					<GridActionsCellItem
						icon={<EditIcon />}
						label='Edit'
						className='textPrimary'
						onClick={handleEditClick(id)}
						color='inherit'
						key={'edit-' + id}
					/>,
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label='Delete'
						onClick={handleDeleteClick(id)}
						color='inherit'
						key={'delete-' + id}
					/>,
				];
			},
		},
	];

	return (
		<Box
			sx={{
				height: 500,
				width: '100%',
				'& .actions': {
					color: 'text.secondary',
				},
				'& .textPrimary': {
					color: 'text.primary',
				},
			}}>
			<DataGrid
				rows={rows}
				columns={columnsWithEdit}
				editMode='row'
				rowModesModel={rowModesModel}
				onRowModesModelChange={handleRowModesModelChange}
				onRowEditStop={handleRowEditStop}
				// processRowUpdate={processRowUpdate}
				slots={{
					toolbar: EditToolbar,
				}}
				slotProps={{
					toolbar: { setRows, setRowModesModel },
				}}
				initialState={{
					sorting: {
						sortModel: [{ field: 'date', sort: 'asc' }],
					},
				}}
			/>
		</Box>
	);
}
