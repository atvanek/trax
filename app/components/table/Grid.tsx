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
import ColumnResizeBar from './ColumnResizeBar';

export default function Grid({ data }: { data: RawJobData[] }) {
	const [rows, setRows] = React.useState(data);
	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
		{}
	);
	const [columnWidths, setColumnWidths] = React.useState<{
		[key: string]: number | null;
	}>({});

	React.useEffect(() => {
		const defaultColumnWidths: { [key: string]: null | number } = {};
		columns.forEach((column) => {
			defaultColumnWidths[column.field] =
				defaultColumnWidths[column.field] || null;
		});
		setColumnWidths(defaultColumnWidths);
	}, []);

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
	console.log(columnWidths);
	const processRowUpdate = (newRow: GridRowModel) => {
		// const updatedRow = { ...newRow, isNew: false };
		// setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		// return updatedRow;
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const columnsWithWidth = columns.map((column) => ({
		...column,
		width: columnWidths[column.field],
	})) as GridColDef[];

	const columnsWithEdit: GridColDef[] = [
		...columnsWithWidth,
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
		<>
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
				<ColumnResizeBar setColumnWidths={setColumnWidths} />
				<DataGrid
					sx={{ height: 'auto' }}
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
		</>
	);
}
