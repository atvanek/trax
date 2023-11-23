'use client';

import React from 'react';
import { Row } from '@/types';
import { Box, Snackbar, Alert } from '@mui/material';
import createDefaultColumns from './defaultColumns';
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
import EditToolbar from '../toolbar/EditToolbar';
import ColumnResizeBar from './ColumnResizeBar';
import StyledTable from './StyledDataGrid';
import DeleteConfirm from '../DeleteConfirm';
import createCustomColumns from '@/utils/createCustomColumns';
import Context from '@/context/customColumnContext';
import withUserOrder from '@/utils/withUserOrder';

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
	const [error, setError] = React.useState(false);
	const [tableRendered, setTableRendered] = React.useState(false);
	const observerRef = React.useRef<MutationObserver | null>(null);
	const { customColumns, setCustomColumns } = React.useContext(Context);

	//handles row delete and delete confirmation pop-up
	const handleRequestDelete = (id: GridRowId): void => {
		setDeleteId(id);
		setDeleteConfirmOpen(true);
	};

	const [columns, setColumns] = React.useState<GridColDef[] | null>(null);

	//notifies parent container that table is rendered with columns
	React.useLayoutEffect(() => {
		if (columns) setMounted(true);
	}, [setMounted, columns]);

	//adds user's custom columns to default columns
	const columnsWithCustomFields = React.useMemo(() => {
		return [
			...createDefaultColumns(handleRequestDelete),
			...createCustomColumns(customColumns),
		];
	}, [customColumns]);

	//get user order from localStorage and set columns with saved order
	React.useEffect(() => {
		const newColumns = withUserOrder(
			columnsWithCustomFields,
			localStorage.getItem('separatorsOrder')
		);
		setColumns(newColumns);
	}, [customColumns, setColumns, columnsWithCustomFields]);

	//redefines columns based on new order
	const handleReorderColumns = React.useCallback(
		(separator: SVGElement) => {
			if (columns) {
				const draggedField = localStorage.getItem('draggedField');
				const draggedOverField = getField(separator);

				if (draggedField === draggedOverField) return; //do not reorder on dropping into own separator to avoid flickering

				const separatorsOrder = localStorage.getItem(
					'separatorsOrder'
				) as string;
				const separatorsOrderParsed = separatorsOrder
					? JSON.parse(separatorsOrder)
					: [];
				const index = separatorsOrderParsed.indexOf(draggedOverField);

				if (index === 0) return; //actions column must always be first

				const draggedColumn = columns.find(
					(column) => column.field === draggedField
				);
				const restOfColumns = columns.filter(
					(column) => column.field !== draggedField
				);

				const newColumns = [
					...restOfColumns.slice(0, index),
					draggedColumn,
					...restOfColumns.slice(index),
				] as GridColDef[];

				const newSeparatorsOrder = newColumns.map((column) => column?.field);
				localStorage.setItem(
					'separatorsOrder',
					JSON.stringify(newSeparatorsOrder)
				);
				setColumns(newColumns);
			}
		},
		[columns]
	);

	//adds event listeners to all column headers and separators
	const addDragEventListeners = React.useCallback(
		(
			headers: NodeListOf<HTMLDivElement>,
			separators: NodeListOf<SVGElement>
		) => {
			const separatorsOrder: string[] = []; // initial order to persist in localStorage

			const handleDragOver = (event: Event) => {
				event.preventDefault();
			};

			const handleDragEnter = function (this: SVGElement) {
				handleReorderColumns(this); // reorders columns as the user drags to a new position
			};

			const handleDrop = function (this: SVGElement) {
				handleReorderColumns(this); // reorders columns on drop
			};
			const handleDragStart = function (this: HTMLDivElement) {
				const headerContainer = this.parentNode as HTMLDivElement;
				const draggedField = headerContainer.getAttribute(
					'data-field'
				) as string;
				localStorage.setItem('draggedField', draggedField); // persist dragged item field to use on dragenter event
			};

			const handleDragEnterHeader = (event: Event) => {
				event.preventDefault();
			};

			const handleDragOverHeader = (event: Event) => {
				event.preventDefault();
			};

			separators.forEach((separator) => {
				const draggedOverField = getField(separator);
				separatorsOrder.push(draggedOverField);
				separator.setAttribute('droppable', 'true');
				separator.addEventListener('dragover', handleDragOver);
				separator.addEventListener('dragenter', handleDragEnter);
				separator.addEventListener('drop', handleDrop);
			});

			if (!localStorage.getItem('separatorsOrder')) {
				localStorage.setItem(
					'separatorsOrder',
					JSON.stringify(separatorsOrder)
				);
			} // save to localStorage if order has not already been saved

			headers.forEach((header) => {
				header.setAttribute('draggable', 'true');
				header.addEventListener('dragstart', handleDragStart);
				header.addEventListener('dragenter', handleDragEnterHeader);
				header.addEventListener('dragover', handleDragOverHeader);
			});

			// Return a cleanup function
			return () => {
				separators.forEach((separator) => {
					separator.removeEventListener('dragover', handleDragOver);
					separator.removeEventListener('dragenter', handleDragEnter);
					separator.removeEventListener('drop', handleDrop);
				});

				headers.forEach((header) => {
					header.removeEventListener('dragstart', handleDragStart);
					header.removeEventListener('dragenter', handleDragEnterHeader);
					header.removeEventListener('dragover', handleDragOverHeader);
				});
			};
		},

		[handleReorderColumns]
	);

	//add mutation observer to check when data grid has been rendered
	React.useEffect(() => {
		//runs on every mutation of the document body
		const handleElementAdded = (mutationsList: MutationRecord[]) => {
			for (const mutation of mutationsList) {
				if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
					const addedNode = mutation.addedNodes[0];
					// Check if the added node is the data grid
					if (
						addedNode instanceof Element &&
						addedNode.classList.contains('MuiDataGrid-root')
					) {
						setTableRendered(true);
					}
				}
			}
		};

		const config = { childList: true, subtree: true };

		// Create a new observer
		const observer = new MutationObserver(handleElementAdded);
		observer.observe(document.body, config);

		// Save the observer in the ref to disconnect it later
		observerRef.current = observer;

		// Clean up the observer on component unmount
		return () => {
			observer.disconnect();
		};
	}, [addDragEventListeners]);

	//calls addDragEventHandlers once table is rendered
	//and runs event listener cleanup on unmount
	React.useEffect(() => {
		//this will be the cleanup function once table is rendered
		let cleanup: () => void = () => {};
		if (tableRendered) {
			//grab all headers and column separators to add event listeners
			const headers: NodeListOf<HTMLDivElement> = document.querySelectorAll(
				'.MuiDataGrid-columnHeaderDraggableContainer'
			);
			const separators: NodeListOf<SVGElement> = document.querySelectorAll(
				'.MuiDataGrid-iconSeparator'
			);
			cleanup = addDragEventListeners(headers, separators);
		}
		return () => {
			console.log('cleaning up');
			cleanup();
		};
	});

	//helper that gets header name from column separator svg
	const getField = (separator: SVGElement): string => {
		const separatorContainer = separator.parentNode as HTMLDivElement; //type SVG container
		const headerContainer = separatorContainer.parentNode as HTMLDivElement; //type header container
		const columnField = headerContainer.getAttribute('data-field') as string; //header field name
		return columnField;
	};

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

	//updates single row in database
	const updateRow = (updatedRow: Row) => {
		fetch('/api/job', {
			method: 'POST',
			body: JSON.stringify(updatedRow),
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					setError(true);
					return;
				}
			})
			.then((data) => {
				setRows(data.rows);
			})
			.catch((err) => setError(true));
	};

	const requestUpdateManyRows = (updatedRow: Row) => {
		//check if there is currently a row being edited
		const anyRowInEditMode = Object.values(rowModesModel).some(
			(row) => row.mode === 'edit'
		);

		if (!anyRowInEditMode) {
			//get all new rows plus the updated value of the current row
			const newRows = rows
				.filter((row) => row.isNew)
				.map((row) => (row.id === updatedRow.id ? updatedRow : row));

			//udpdate rows in databse
			fetch('/api/jobs', {
				method: 'POST',
				body: JSON.stringify(newRows),
			})
				.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						setError(true);
						return;
					}
				})
				.then((data) => {
					setRows(data.rows);
				})
				.catch((err) => setError(true));
		}
	};

	const handleProcessRowUpdate = (updatedRow: Row) => {
		//is there are other rows that haven't been updated, request to update multiple rows
		if (rows.some((row) => row.isNew)) {
			requestUpdateManyRows(updatedRow);
		} else {
			//otherwise just updated the single row
			updateRow(updatedRow);
		}
		//optimistically update UI
		const newRows = rows.map((row) =>
			row.id === updatedRow.id ? updatedRow : row
		);
		setRows(newRows);
		return updatedRow;
	};

	//deletes row optimistically and in database
	//fetches updated data from database and updates rows
	const handleDeleteClick = () => {
		setError(false);
		setRows(rows.filter((row) => row.id !== deleteId));
		setDeleteConfirmOpen(false);
		fetch('/api/job', {
			method: 'DELETE',
			body: JSON.stringify({ id: deleteId }),
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					setError(true);
				}
			})
			.then((data: { rows: Row[] }) => {
				const newRows = data.rows.map((row) => ({
					...row,
					date: row.date ? new Date(row.date) : new Date(),
				})) as Row[];
				setRows(newRows);
			})
			.catch((err) => {
				console.log(err);
				setError(true);
			});
	};

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
		columns && (
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
						tableRendered={tableRendered}
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
								setColumns,
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
					confirmationMessage='All job details will be permanently lost.'
				/>
				<Snackbar
					open={error}
					autoHideDuration={6000}
					onClose={() => setError(false)}>
					<Alert severity='error' sx={{ width: '100%' }}>
						Error updating data. Please try again.
					</Alert>
				</Snackbar>
			</>
		)
	);
}
