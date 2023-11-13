'use client';

import React from 'react';
import { Row } from '@/types';
import { Box } from '@mui/material';
import defaultColumns from './defaultColumns';
import {
	GridRowModesModel,
	GridRowModes,
	GridColDef,
	GridEventListener,
	GridRowId,
	GridRowEditStopReasons,
	GridSortModel,
	GridCellParams,
} from '@mui/x-data-grid';
import EditToolbar from './EditToolbar';
import ColumnResizeBar from './ColumnResizeBar';
import StyledTable from './StyledDataGrid';
import DeleteConfirm from '../DeleteConfirm';

export default function Table({
	rows,
	setRows,
	setMounted,
}: {
	rows: Row[];
	setRows: React.Dispatch<React.SetStateAction<Row[]>>;
	setMounted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
		{}
	);
	const [sortModel, setSortModel] = React.useState<GridSortModel>([
		{ field: 'date', sort: 'asc' },
	]);
	const [resizing, setResizing] = React.useState<boolean>(false); //column resizing event state
	const [deleteConfirmOpen, setDeleteConfirmOpen] =
		React.useState<boolean>(false);
	const [deleteId, setDeleteId] = React.useState<GridRowId | null>(null); //id of item requested to delete
	const [columnsDraggable, setColumnsDraggable] = React.useState(false); //columns made draggable after client hydration

	//notifies tab container that table is rendered
	React.useLayoutEffect(() => {
		setMounted(true);
	}, [setMounted]);

	//handles delete confirm pop-up
	const handleRequestDelete = (id: GridRowId): void => {
		setDeleteId(id);
		setDeleteConfirmOpen(true);
	};

	const [columns, setColumns] = React.useState(
		defaultColumns(handleRequestDelete)
	);

	//redefines columns based on new order
	const handleReorderColumns = React.useCallback(
		(e: DragEvent, index: number) => {
			if (index === 0) return; //actions column must be first
			const data = e.dataTransfer?.getData('text/plain');

			const draggedColumn = columns.find(
				(column) => column.headerName === data
			);
			const restOfColumns = columns.filter(
				(column) => column.headerName !== data
			);
			const newColumns = [
				...restOfColumns.slice(0, index),
				draggedColumn,
				...restOfColumns.slice(index),
			] as GridColDef[];
			setColumns(newColumns);
		},
		[columns]
	);

	//adds event handlers to all column headers and seperators
	const addDragEventHandlers = React.useCallback(
		(
			headers: NodeListOf<HTMLDivElement>,
			seperators: NodeListOf<SVGElement>
		) => {
			seperators.forEach((seperator, index) => {
				seperator.setAttribute('droppable', 'true');
				seperator.addEventListener('dragover', (event) => {
					event.preventDefault();
				});

				seperator.addEventListener('drop', (e) => {
					handleReorderColumns(e, index);
				});
			});

			headers.forEach((header, index) => {
				header.setAttribute('draggable', 'true');

				header.addEventListener('dragstart', (e) => {
					const target = e.target as HTMLDivElement;
					e.dataTransfer?.setData('text/plain', target.innerText);
				});

				header.addEventListener('dragenter', (event) => {
					event.preventDefault();
				});

				header.addEventListener('dragover', (event) => {
					event.preventDefault();
				});
			});

			setColumnsDraggable(true);
		},
		[handleReorderColumns]
	);

	//makes all column headers draggable elements
	const makeColumnsDraggable = React.useCallback(() => {
		const headers: NodeListOf<HTMLDivElement> = document.querySelectorAll(
			'.MuiDataGrid-columnHeaderDraggableContainer'
		);
		const seperators: NodeListOf<SVGElement> = document.querySelectorAll(
			'.MuiDataGrid-iconSeparator'
		);
		//adds event handlers if nodes have been rendered to DOM
		if (headers.length && seperators.length) {
			addDragEventHandlers(headers, seperators);
		}
	}, [addDragEventHandlers]);

	//checks whether columns have been made draggable on every render
	if (!columnsDraggable) {
		makeColumnsDraggable();
	}

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

	//updates row changes optimistically and to database
	//fetches updated data from database and updates rows
	const handleProcessRowUpdate = (updatedRow: Row) => {
		//optimistic render
		const newRow = { ...updatedRow, isNew: false } as Row;
		setRows((prevRows) =>
			prevRows.map((row) => (row.id === newRow.id ? newRow : row))
		);
		fetch('/api/job', {
			method: 'POST',
			body: JSON.stringify(newRow),
		})
			.then((res) => res.json())
			.then((rows: Row[]) => {
				setRows(rows);
			});

		return updatedRow;
	};

	//deletes row optimistically and in database
	//fetches updated data from database and updates rows
	const handleDeleteClick = () => {
		setRows(rows.filter((row) => row.id !== deleteId));
		setDeleteConfirmOpen(false);
		fetch('/api/jobs', {
			method: 'DELETE',
			body: JSON.stringify({ id: deleteId }),
		})
			.then((res) => res.json())
			.then((rows: Row[]) => {
				const newRows = rows.map((row) => ({
					...row,
					date: new Date(row.date),
				})) as Row[];
				setRows(newRows);
			});
	};

	// const handleCancelClick = React.useCallback(
	// 	(id: GridRowId) => () => {
	// 		setRowModesModel({
	// 			...rowModesModel,
	// 			[id]: { mode: GridRowModes.View, ignoreModifications: true },
	// 		});
	// 		const currentRow = rows.find((row) => row.id === id);
	// 		if (currentRow?.isNew) {
	// 			setRows(rows.filter((row) => row.id !== id));
	// 		}
	// 	},
	// 	[rowModesModel, rows, setRows]
	// );

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const handleSortModelChange = React.useCallback(
		(newSortModel: GridSortModel) => {
			setSortModel(newSortModel);
		},
		[]
	);

	const handleCellClick = (params: GridCellParams, event: React.MouseEvent) => {
		console.log(params);
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
					setColumns={setColumns}
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
					columns={columns}
					editMode='row'
					density='compact'
					rowModesModel={rowModesModel}
					disableRowSelectionOnClick
					onRowModesModelChange={handleRowModesModelChange}
					onRowEditStop={handleRowEditStop}
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
							setSortModel,
							setRowModesModel,
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
