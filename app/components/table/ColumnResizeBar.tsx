import React from 'react';
import { Dispatch, SetStateAction } from 'react';

export default function ColumnResizeBar({
	setColumnWidths,
}: {
	setColumnWidths: Dispatch<SetStateAction<{ [key: string]: number | null }>>;
}) {
	const [resizing, setResizing] = React.useState<boolean>(false);
	const [currentColumnRight, setCurrentColumnRight] = React.useState<number>(0);
	const [currentField, setCurrentField] = React.useState<null | string>(null);
	const [resizeX, setResizeX] = React.useState<number>(0);

	const handleListenForResizeStart = React.useCallback(
		(e: MouseEvent) => {
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
			// else if (  e.target.parentNode instanceof SVGElement)
			console.log('resize start');
			const { field } = column.dataset;
			setResizing(true);
			setCurrentColumnRight(column.getBoundingClientRect().right);
			setResizeX(e.clientX);
			setCurrentField(field || null);
			if (field) {
				setCurrentField(field || null);
				setColumnWidths((prev) => {
					return {
						...prev,
						[field]: column.getBoundingClientRect().width,
					};
				});
			}
		},
		[setColumnWidths]
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
			console.log('resize end');
			const diff = e.clientX - currentColumnRight;
			if (currentField) {
				setColumnWidths((prev) => {
					return {
						...prev,
						[currentField]: (prev[currentField] || 0) + diff,
					};
				});
			}
			setResizing(false);
			setCurrentColumnRight(0);
		},
		[currentColumnRight, currentField, resizing, setColumnWidths]
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
				left: resizeX,
				zIndex: 2,
			}}></div>
	);
}
