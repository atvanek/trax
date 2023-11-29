import React from 'react';
import ColumnResizeBar from '../views/ColumnResizeBar';
import { GridApiCommunity } from '@mui/x-data-grid/internals';

export default function ColumnResizeBarContainer({
	resizing,
	setResizing,
	apiRef,
	newNodesRendered,
}: {
	resizing: boolean;
	setResizing: React.Dispatch<React.SetStateAction<boolean>>;
	apiRef: React.MutableRefObject<GridApiCommunity> | null;
	newNodesRendered: boolean;
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
			setBarTop(column.getBoundingClientRect().top); //sets top coordinate of column resizing bar indicator
			const { width } = column.getBoundingClientRect();
			if (field) {
				setCurrentField(field);
				apiRef?.current.setColumnWidth(field, width);
			}
		},
		[setResizing, apiRef]
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
				const currentColumnWidth =
					apiRef?.current.getColumn(currentField).width;
				currentColumnWidth &&
					apiRef?.current.setColumnWidth(
						currentField,
						currentColumnWidth + diff
					);
			}
			setResizing(false); //resizing over
			setCurrentColumnRight(0);
		},
		[currentColumnRight, currentField, resizing, setResizing, apiRef]
	);

	const addResizeEventListeners = React.useCallback(() => {
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
				seperator.removeEventListener('mousedown', handleListenForResizeStart);
			});
		};
	}, [
		handleListenForResize,
		handleListenForResizeEnd,
		handleListenForResizeStart,
	]);

	//calls addResizeEventHandlers
	//and runs event listener cleanup on unmount
	React.useEffect(() => {
		//this will be the cleanup function once table is rendered

		const cleanup = addResizeEventListeners();

		return () => {
			cleanup();
		};
	}, [addResizeEventListeners, newNodesRendered]);

	return (
		<ColumnResizeBar
			resizing={resizing}
			barTop={barTop}
			resizeBarX={resizeBarX}
		/>
	);
}
