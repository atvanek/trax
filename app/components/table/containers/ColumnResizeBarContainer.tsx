import { useTheme } from '@mui/material/styles';
import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import ColumnResizeBar from '../views/ColumnResizeBar';

export default function ColumnResizeBarContainer({
	tableRendered,
	resizing,
	setResizing,
	setColumns,
}: {
	tableRendered: boolean;
	resizing: boolean;
	setResizing: React.Dispatch<React.SetStateAction<boolean>>;
	setColumns: React.Dispatch<React.SetStateAction<GridColDef[] | null>>;
}) {
	const [currentColumnRight, setCurrentColumnRight] = React.useState<number>(0);
	const [currentField, setCurrentField] = React.useState<null | string>(null);
	const [barTop, setBarTop] = React.useState(0);
	const [resizeBarX, setResizeBarX] = React.useState<number>(0);

	const handleListenForResizeStart = React.useCallback(
		(e: MouseEvent) => {
			const seperator = e.currentTarget as SVGElement;
			const seperatorContainer = seperator.parentNode as HTMLDivElement;
			let column = seperatorContainer.parentNode as HTMLDivElement; //capture column header container for x and width properties
			setResizing(true); //resizing event is now occuring
			const { field } = column.dataset; //name of column field currently being resized
			setCurrentColumnRight(e.clientX); //x coordinate of selected column seperator
			setResizeBarX(e.clientX); //sets current x coordinate of column resizing bar indicator
			setBarTop(column.getBoundingClientRect().height + 2); //sets top coordinate of column resizing bar indicator
			if (field) {
				setCurrentField(field);
			}
		},
		[setResizing]
	);

	//resize column resizing bar indicator on mouse move when resizing event is occuring
	const handleListenForResize = React.useCallback(
		(e: MouseEvent) => {
			if (!resizing) return;
			setResizeBarX(e.clientX);
		},
		[resizing]
	);

	const handleListenForResizeEnd = React.useCallback(
		(e: MouseEvent) => {
			if (!resizing) return;
			const diff = e.clientX - currentColumnRight; //difference between initial x and current x

			if (currentField) {
				setColumns((prevColumns) => {
					if (prevColumns) {
						const newColumns = prevColumns.map((prevColumn) => {
							if (prevColumn.field === currentField) {
								return { ...prevColumn, width: (prevColumn.width || 0) + diff }; //add difference to current column width
							} else {
								return prevColumn;
							}
						});

						const userColumnWidths =
							localStorage.getItem('columnWidths') || '{}';

						const parsedUserColumnWidths: {
							[key: string]: number | undefined;
						} = JSON.parse(userColumnWidths);

						newColumns.forEach((column) => {
							parsedUserColumnWidths[column.field] = column.width;
						});
						localStorage.setItem(
							'columnWidths',
							JSON.stringify(parsedUserColumnWidths)
						);

						return newColumns;
					}
					return prevColumns;
				});
			}
			setResizing(false); //resizing over
			setCurrentColumnRight(0);
		},
		[currentColumnRight, currentField, resizing, setColumns, setResizing]
	);

	//add event handlers to window mousemove and mouseup event handlers to window
	React.useEffect(() => {
		if (tableRendered) {
			const seperators: NodeListOf<SVGElement> = document.querySelectorAll(
				'.MuiDataGrid-iconSeparator'
			);
			seperators.forEach((seperator) => {
				seperator.addEventListener('mousedown', handleListenForResizeStart); //listener for initiating resizing event
			});
			addEventListener('mousemove', handleListenForResize);
			addEventListener('mouseup', handleListenForResizeEnd);
			return () => {
				//clean up all event handlers
				removeEventListener('mousemove', handleListenForResize);
				removeEventListener('mouseup', handleListenForResizeEnd);
				const seperators: NodeListOf<SVGElement> = document.querySelectorAll(
					'.MuiDataGrid-iconSeparator'
				);
				seperators.forEach((seperator) => {
					seperator.removeEventListener(
						'mousedown',
						handleListenForResizeStart
					);
				});
			};
		}
	}, [
		tableRendered,
		handleListenForResize,
		handleListenForResizeEnd,
		handleListenForResizeStart,
	]);
	return (
		<ColumnResizeBar
			resizing={resizing}
			barTop={barTop}
			resizeBarX={resizeBarX}
		/>
	);
}
