'use client';

import React from 'react';
import { Job, Row } from '@/types';
import { Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import CancelIcon from '@mui/icons-material/CloseOutlined';
import { columns, defaultColumnWidths } from '../../../utils/columns';
import {
	GridRowModesModel,
	GridRowModes,
	GridColDef,
	GridActionsCellItem,
	GridEventListener,
	GridRowId,
	GridRowEditStopReasons,
	GridSortModel,
	GridCellModesModel,
	GridCellParams,
	GridRowModel,
} from '@mui/x-data-grid';
import EditToolbar from './EditToolbar';
import ColumnResizeBar from './ColumnResizeBar';
import StyledTable from './StyledDataGrid';
import DeleteConfirm from '../DeleteConfirm';

export default function Table({
	data,
	setMounted,
}: {
	data: Job[];
	setMounted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [rows, setRows] = React.useState<Row[]>(
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
	const [deleteConfirmOpen, setDeleteConfirmOpen] =
		React.useState<boolean>(false);
	const [deleteId, setDeleteId] = React.useState<GridRowId | null>(null);

	//notifies container that table is rendered
	React.useLayoutEffect(() => {
		setMounted(true);
	}, [setMounted]);

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

	const handleSaveClick = React.useCallback(
		(id: GridRowId) => () => {
			//save row to database
			setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
		},
		[rowModesModel]
	);

	const handleDeleteClick = () => {
		//delete row from database
		setRows(rows.filter((row) => row.id !== deleteId));
		setDeleteConfirmOpen(false);
	};

	const handleCancelClick = React.useCallback(
		(id: GridRowId) => () => {
			setRowModesModel({
				...rowModesModel,
				[id]: { mode: GridRowModes.View, ignoreModifications: true },
			});
			const currentRow = rows.find((row) => row.id === id);
			if (currentRow?.isNew) {
				setRows(rows.filter((row) => row.id !== id));
			}
		},
		[rowModesModel, rows]
	);

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

	const columnsWithWidth = columns.map((column) => ({
		...column,
		width: columnWidths[column.field],
	})) as GridColDef[];

	const handleRequestDelete = (id: GridRowId): void => {
		setDeleteId(id);
		setDeleteConfirmOpen(true);
	};

	const columnsWithEdit: GridColDef[] = React.useMemo(() => {
		return [
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
							onClick={() => handleRequestDelete(id)}
							color='inherit'
							key={'delete-' + id}
						/>,
					];
				},
			},
		];
	}, [columnsWithWidth, handleCancelClick, handleSaveClick, rowModesModel]);
	const handleProcessRowUpdate = (
		updatedRow: GridRowModel,
		originalRow: GridRowModel
	) => {
		const { isNew, __v, _id, ...updatedJob } = updatedRow;

		fetch('/api/jobs', {
			method: 'POST',
			body: JSON.stringify(updatedJob),
		});
		const newRow = { ...updatedRow, isNew: false } as Row;
		setRows((prevRows) =>
			prevRows.map((row) => (row.id === newRow.id ? newRow : row))
		);
		return updatedRow;
	};
	return (
		<>
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
				<StyledTable
					autoHeight
					sx={{
						pointerEvents: resizing ? 'none' : 'auto',
					}}
					processRowUpdate={handleProcessRowUpdate}
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
			<DeleteConfirm
				deleteConfirmOpen={deleteConfirmOpen}
				setDeleteConfirmOpen={setDeleteConfirmOpen}
				handleDeleteClick={handleDeleteClick}
			/>
		</>
	);
}
