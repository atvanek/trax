'use client';

import * as React from 'react';
import { RawJobData } from '@/types';
import { Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import CancelIcon from '@mui/icons-material/CloseOutlined';
import { columns, defaultColumnWidths } from '../../../utils/columns';
import {
	GridRowModesModel,
	GridRowModes,
	DataGrid,
	GridColDef,
	GridActionsCellItem,
	GridEventListener,
	GridRowId,
	GridRowEditStopReasons,
	GridSortModel,
	GridCellModesModel,
	GridCellParams,
} from '@mui/x-data-grid';
import EditToolbar from './EditToolbar';
import ColumnResizeBar from './ColumnResizeBar';

export default function Table({
	data,
	setLoaded,
}: {
	data: RawJobData[];
	setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [rows, setRows] = React.useState(
		data.map((row) => ({ ...row, isNew: false }))
	);
	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
		{}
	);
	const [sortModel, setSortModel] = React.useState<GridSortModel>([
		{ field: 'date', sort: 'asc' },
	]);
	const [columnWidths, setColumnWidths] = React.useState<{
		[key: string]: number | null;
	}>(defaultColumnWidths());
	const [cellModesModel, setCellModesModel] =
		React.useState<GridCellModesModel>({});
	const [resizing, setResizing] = React.useState<boolean>(false);

	//notifies container that table is rendered
	React.useLayoutEffect(() => {
		setLoaded(true);
	}, [setLoaded]);

	const handleRowEditStop: GridEventListener<'rowEditStop'> = (
		params,
		event
	) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
		setRowModesModel({
			...rowModesModel,
			[params.id]: { mode: GridRowModes.View },
		});
	};

	const handleSaveClick = (id: GridRowId) => () => {
		//save row to database
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};

	const handleDeleteClick = (id: GridRowId) => () => {
		//popup confirmation
		//delete row from database
		setRows(rows.filter((row) => row.id !== id));
	};

	const handleCancelClick = (id: GridRowId) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});
		const currentRow = rows.find((row) => row.id === id);
		if (currentRow?.isNew) {
			setRows(rows.filter((row) => row.id !== id));
		}
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const handleSortModelChange = (newSortModel: GridSortModel) => {
		setSortModel(newSortModel);
	};

	const handleCellClick = React.useCallback(
		(params: GridCellParams, event: React.MouseEvent) => {
			if (!params.isEditable) {
				return;
			}

			// Ignore portal
			if (!event.currentTarget.contains(event.target as Element)) {
				return;
			}

			setRowModesModel({
				...rowModesModel,
				[params.id]: { mode: GridRowModes.Edit },
			});
		},
		[rowModesModel]
	);

	const handleCellModesModelChange = React.useCallback(
		(newModel: GridCellModesModel) => {
			setCellModesModel(newModel);
		},
		[]
	);

	// const processRowUpdate = (newRow, oldRow) => {
	// 	console.log(newRow);
	// 	console.log(oldRow);
	// };

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
			headerClassName: 'table-header',
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
		<div>
			<Box
				sx={{
					width: '100%',
					'& .actions': {
						color: 'text.secondary',
					},
					'& .textPrimary': {
						color: 'text.primary',
					},
				}}>
				<ColumnResizeBar
					setColumnWidths={setColumnWidths}
					resizing={resizing}
					setResizing={setResizing}
				/>
				<DataGrid
					sx={{ height: '80vh', pointerEvents: resizing ? 'none' : 'auto' }}
					rows={rows}
					columns={columnsWithEdit}
					editMode='row'
					density='compact'
					rowModesModel={rowModesModel}
					disableRowSelectionOnClick
					onRowModesModelChange={handleRowModesModelChange}
					onRowEditStop={handleRowEditStop}
					cellModesModel={cellModesModel}
					onCellModesModelChange={handleCellModesModelChange}
					onCellClick={handleCellClick}
					sortModel={sortModel}
					onSortModelChange={handleSortModelChange}
					pageSizeOptions={[25, 50, 100]}
					slots={{
						toolbar: EditToolbar,
					}}
					slotProps={{
						toolbar: {
							setRows,
							setRowModesModel,
							setSortModel,
						},
					}}
					initialState={{
						sorting: { sortModel },
					}}
				/>
			</Box>
		</div>
	);
}
