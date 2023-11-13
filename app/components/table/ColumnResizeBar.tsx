import { useTheme } from '@mui/material/styles';
import React from 'react';
import { GridColDef } from '@mui/x-data-grid';

export default function ColumnResizeBar({
	resizing,
	setResizing,
	setColumns,
}: {
	resizing: boolean;
	setResizing: React.Dispatch<React.SetStateAction<boolean>>;
	setColumns: React.Dispatch<React.SetStateAction<GridColDef[]>>;
}) {
	const [currentColumnRight, setCurrentColumnRight] = React.useState<number>(0);
	const [currentField, setCurrentField] = React.useState<null | string>(null);
	const [barTop, setBarTop] = React.useState(0);
	const [resizeBarX, setResizeBarX] = React.useState<number>(0);
	const [columnsResizable, setColumnsResizable] = React.useState(false);

	const theme = useTheme();

	const handleListenForResizeStart = (e: MouseEvent) => {
		const seperator = e.currentTarget as SVGElement;
		console.log(seperator);
		const seperatorContainer = seperator.parentNode as HTMLDivElement;
		let column = seperatorContainer.parentNode as HTMLDivElement; //capture column header container for x and width properties
		setResizing(true); //resizing event is now occuring
		const { field } = column.dataset; //name of column field currently being resized
		setCurrentColumnRight(e.clientX); //x coordinate of selected column seperator
		setResizeBarX(e.clientX); //sets current x coordinate of column resizing bar indicator
		const { width } = column.getBoundingClientRect();
		setBarTop(column.getBoundingClientRect().height + 2); //sets top coordinate of column resizing bar indicator
		if (field) {
			setCurrentField(field);
			setColumns((prevColumns) => {
				return prevColumns.map((prevColumn) => {
					if (prevColumn.field === field) {
						return { ...prevColumn, width }; //sets width of current column to its current width to handle no default width
					} else {
						return prevColumn;
					}
				});
			});
		}
	};

	//resize column resizing bar indicator on mouse move when resizing event is occuring
	const handleListenForResize = (e: MouseEvent) => {
		if (!resizing) return;
		setResizeBarX(e.clientX);
	};

	const handleListenForResizeEnd = (e: MouseEvent) => {
		if (!resizing) return;
		const diff = e.clientX - currentColumnRight; //difference between initial x and current x
		if (currentField) {
			setColumns((prevColumns) => {
				return prevColumns.map((prevColumn) => {
					if (prevColumn.field === currentField) {
						return { ...prevColumn, width: (prevColumn.width || 0) + diff }; //add difference to current column width
					} else {
						return prevColumn;
					}
				});
			});
		}
		setResizing(false); //resizing over
		setCurrentColumnRight(0);
	};

	const makeColumnsResizable = () => {
		const seperators: NodeListOf<SVGElement> = document.querySelectorAll(
			'.MuiDataGrid-iconSeparator'
		);
		if (!seperators.length) {
			return;
		}
		seperators.forEach((seperator) => {
			seperator.addEventListener('mousedown', handleListenForResizeStart); //listener for initiating resizing event
		});
		setColumnsResizable(true);
	};

	if (!columnsResizable) {
		makeColumnsResizable();
	}

	//add event handlers to window mousemove and mouseup event handlers to window
	React.useEffect(() => {
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
				seperator.removeEventListener('mousedown', handleListenForResizeStart);
			});
		};
	}, [
		handleListenForResizeStart,
		handleListenForResizeEnd,
		handleListenForResize,
	]);
	return (
		<div
			id='column-resize-bar'
			style={{
				display: resizing ? 'inline' : 'none',
				top: barTop,
				left: resizeBarX,
				position: 'absolute',
				width: '1px',
				backgroundColor: theme.palette.secondary.main,
				height: '100%',
			}}></div>
	);
}
