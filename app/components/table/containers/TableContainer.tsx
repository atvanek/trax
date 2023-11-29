'use client';

import React from 'react';
import { Row } from '@/types';
import createDefaultColumns from '../defaultColumns';
import {
	GridRowModesModel,
	GridRowModes,
	GridColDef,
	GridEventListener,
	GridRowId,
	GridRowEditStopReasons,
	GridInitialState,
} from '@mui/x-data-grid';
import createCustomColumns from '@/utils/createCustomColumns';
import Context from '@/context/GridContext';
import Table from '../views/Table';
import { useTheme } from '@mui/material';

export default function TableContainer({
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
	); //dictates whether rows are currently being viewed or edited
	const [resizing, setResizing] = React.useState<boolean>(false); //reflects whether column is currently being resized
	const [deleteConfirmOpen, setDeleteConfirmOpen] =
		React.useState<boolean>(false); //row delete confirmation diaglog
	const [deleteId, setDeleteId] = React.useState<GridRowId | null>(null); //id of item requested to delete
	const [error, setError] = React.useState(false); //error snackbar open state
	const observerRef = React.useRef<MutationObserver | null>(null); //observer ref that watches for mutation in the DOM to add event listeners
	const { customColumns, apiRef, setAddingColumn } = React.useContext(Context);
	const [initialState, setInitialState] = React.useState<GridInitialState>(); //initial state retrieved from localStorage
	const theme = useTheme();
	const [newNodesRendered, setNewNodesRendered] = React.useState(false); //toggles value to indicate to resize bar to cleanup and add event listeners

	//handles row delete and delete confirmation pop-up
	const handleRequestDelete = (id: GridRowId): void => {
		setDeleteId(id);
		setDeleteConfirmOpen(true);
	};

	//adds user's custom columns to default columns
	const columnsWithCustomFields = React.useMemo(() => {
		return [
			...createDefaultColumns(handleRequestDelete, setAddingColumn),
			...createCustomColumns(customColumns),
		];
	}, [customColumns, setAddingColumn]);

	const [columns, setColumns] = React.useState<GridColDef[]>(
		columnsWithCustomFields
	);

	//notifies parent container that table is rendered with columns
	React.useLayoutEffect(() => {
		setMounted(true);
	}, [setMounted]);

	//saves current grid state to localStorage
	const saveSnapshot = React.useCallback(() => {
		if (apiRef?.current?.exportState && localStorage) {
			const currentState = apiRef.current.exportState();
			localStorage.setItem('dataGridState', JSON.stringify(currentState));
		}
	}, [apiRef]);

	//gets previous grid state from localStorage
	React.useLayoutEffect(() => {
		const stateFromLocalStorage = localStorage?.getItem('dataGridState');
		setInitialState(
			stateFromLocalStorage ? JSON.parse(stateFromLocalStorage) : {}
		);

		// handle refresh and navigating away/refreshing
		window.addEventListener('beforeunload', saveSnapshot);

		return () => {
			// in case of a SPA remove the event-listener
			window.removeEventListener('beforeunload', saveSnapshot);
			saveSnapshot();
		};
	}, [saveSnapshot]);

	//redefines columns based on new order
	const handleReorderColumns = React.useCallback((separator: SVGElement) => {
		const draggedField = localStorage.getItem('draggedField');
		const draggedOverField = getField(separator);

		if (draggedField === draggedOverField) return; //do not reorder on dropping into own separator to avoid flickering

		const separatorsOrder = localStorage.getItem('separatorsOrder') as string;
		const separatorsOrderParsed = separatorsOrder
			? JSON.parse(separatorsOrder)
			: [];
		const index = separatorsOrderParsed.indexOf(draggedOverField);

		if (index === 0) return; //actions column must always be first

		setColumns((prev) => {
			const draggedColumn = prev.find(
				(column) => column.field === draggedField
			);
			const restOfColumns = prev.filter(
				(column) => column.field !== draggedField
			);

			//define new order of columns
			const newColumns = [
				...restOfColumns.slice(0, index),
				draggedColumn,
				...restOfColumns.slice(index),
			] as GridColDef[];

			//update order in localStorage
			const newSeparatorsOrder = newColumns.map((column) => column.field);
			localStorage.setItem(
				'separatorsOrder',
				JSON.stringify(newSeparatorsOrder)
			);

			//update state
			return newColumns;
		});
	}, []);

	//adds event listeners to all column headers and separators
	const addDragEventListeners = React.useCallback(() => {
		const headers: NodeListOf<HTMLDivElement> = document.querySelectorAll(
			'.MuiDataGrid-columnHeaderDraggableContainer'
		);
		const separators: NodeListOf<SVGElement> = document.querySelectorAll(
			'.MuiDataGrid-iconSeparator'
		);

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
			headerContainer.style.backgroundColor = theme.palette.action.selected;

			const draggedField = headerContainer.getAttribute('data-field') as string;

			localStorage.setItem('draggedField', draggedField); // persist dragged item field to use on dragenter event
		};
		const handleDragEnd = function (this: HTMLDivElement) {
			const headerContainer = this.parentNode as HTMLDivElement;
			headerContainer.style.backgroundColor = 'inherit';
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
			localStorage.setItem('separatorsOrder', JSON.stringify(separatorsOrder));
		} // save to localStorage if order has not already been saved

		headers.forEach((header, index) => {
			if (index > 0) {
				//prevents actions columns from being reordered
				header.setAttribute('draggable', 'true');
				header.addEventListener('dragstart', handleDragStart);
				header.addEventListener('dragenter', handleDragEnterHeader);
				header.addEventListener('dragover', handleDragOverHeader);
				header.addEventListener('dragend', handleDragEnd);
			}
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
				header.removeEventListener('dragend', handleDragEnd);
			});
		};
	}, [handleReorderColumns, theme.palette.action.selected]);

	//add mutation observer to check when data grid has been rendered
	//or when new columns have been added
	React.useEffect(() => {
		//this will be the cleanup function to remove listeners
		let cleanup: () => void = () => {};
		//runs on every mutation of the document body
		const handleElementAdded = (mutationsList: MutationRecord[]) => {
			for (const mutation of mutationsList) {
				if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
					const addedNode = mutation.addedNodes[0];
					// Check if the added node is the data grid
					if (
						addedNode instanceof Element &&
						(addedNode.classList.contains('MuiDataGrid-root') || //if the mutation is the table being initially rendered
							addedNode.classList.contains('MuiDataGrid-columnHeader')) // or a new column being added
					) {
						//add all event listeners and save cleanup function definition to 'cleanup'
						cleanup();
						cleanup = addDragEventListeners();
						//toggles value so that column resize event listeners are cleaned up and added again
						setNewNodesRendered((prev) => !prev);
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
			cleanup();
			observer.disconnect();
		};
	}, [addDragEventListeners]);

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
		console.log('processing');
		if (rows.some((row) => row.isNew)) {
			requestUpdateManyRows(updatedRow);
		} else {
			//otherwise just updated the single row
			updateRow(updatedRow);
		}
		console.log(updatedRow);
		//optimistically update UI
		const newRows = rows.map((row) =>
			row.id === updatedRow.id ? updatedRow : row
		);
		apiRef?.current.updateRows(newRows);
		return updatedRow;
	};

	//deletes row optimistically and in database
	//fetches updated data from database and updates rows
	const handleDeleteClick = () => {
		setError(false);
		apiRef?.current.updateRows(rows.filter((row) => row.id !== deleteId));
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

	return (
		initialState && (
			<Table
				rows={rows}
				setRows={setRows}
				columns={columns}
				setColumns={setColumns}
				resizing={resizing}
				setResizing={setResizing}
				handleProcessRowUpdate={handleProcessRowUpdate}
				rowModesModel={rowModesModel}
				setRowModesModel={setRowModesModel}
				handleRowModesModelChange={handleRowModesModelChange}
				handleRowEditStop={handleRowEditStop}
				deleteConfirmOpen={deleteConfirmOpen}
				setDeleteConfirmOpen={setDeleteConfirmOpen}
				handleDeleteClick={handleDeleteClick}
				error={error}
				setError={setError}
				apiRef={apiRef}
				initialState={initialState}
				newNodesRendered={newNodesRendered}
			/>
		)
	);
}
