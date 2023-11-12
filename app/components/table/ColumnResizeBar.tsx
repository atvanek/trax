import { useTheme } from '@mui/material/styles';
import React, { Dispatch, SetStateAction } from 'react';
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
	const [resizeX, setResizeX] = React.useState<number>(0);

	const theme = useTheme();

	const handleListenForResizeStart = React.useCallback(
		(e: MouseEvent) => {
			//grab currently selected column header based on what element is clicked
			let column: HTMLElement;
			if (
				e.target instanceof SVGElement &&
				e.target?.classList?.contains('MuiDataGrid-iconSeparator')
			) {
				column = e.target.parentNode?.parentNode as HTMLElement;
			} else if (
				e.target instanceof SVGPathElement &&
				e.target.parentNode instanceof SVGElement &&
				e.target.parentNode.classList.contains('MuiDataGrid-iconSeparator')
			) {
				column = e.target.parentNode?.parentNode?.parentNode as HTMLElement;
			} else {
				return;
			}
			const { field } = column.dataset;
			setResizing(true);
			const columnRight = e.clientX;
			console.log('current column right', currentColumnRight);
			setCurrentColumnRight(columnRight);
			//x position of current column
			setResizeX(e.clientX);
			const { width } = column.getBoundingClientRect();
			setBarTop(column.getBoundingClientRect().height + 2);
			if (field) {
				setCurrentField(field);
				setColumns((prevColumns) => {
					return prevColumns.map((prevColumn) => {
						if (prevColumn.field === field) {
							return { ...prevColumn, width };
						} else {
							return prevColumn;
						}
					});
				});
			}
		},
		[currentColumnRight, setColumns, setResizing]
	);

	const handleListenForResize = React.useCallback(
		(e: MouseEvent) => {
			if (!resizing) return;
			setResizeX(e.clientX);
		},
		[resizing]
	);

	const handleListenForResizeEnd = React.useCallback(
		(e: MouseEvent) => {
			if (!resizing) return;

			const diff = e.clientX - currentColumnRight;
			console.log(diff);
			console.log(currentField);
			if (currentField) {
				setColumns((prevColumns) => {
					return prevColumns.map((prevColumn) => {
						if (prevColumn.field === currentField) {
							return { ...prevColumn, width: (prevColumn.width || 0) + diff };
						} else {
							return prevColumn;
						}
					});
				});
			}
			setResizing(false);
			setCurrentColumnRight(0);
		},
		[currentField, resizing, setColumns, setResizing, currentColumnRight]
	);

	React.useEffect(() => {
		addEventListener('mousedown', handleListenForResizeStart);
		addEventListener('mousemove', handleListenForResize);
		addEventListener('mouseup', handleListenForResizeEnd);
		return () => {
			removeEventListener('mousedown', handleListenForResizeStart);
			removeEventListener('mousemove', handleListenForResize);
			removeEventListener('mouseup', handleListenForResizeEnd);
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
				left: resizeX,
				position: 'absolute',
				width: '1px',
				backgroundColor: theme.palette.secondary.main,
				height: '100%',
			}}></div>
	);
}
