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
	const [mouseDownOnSeparator, setMouseDownOnSeparator] = React.useState(false);

	const handleListenForResizeStart = React.useCallback(
		(e: MouseEvent) => {
			const seperator = e.currentTarget as SVGElement;
			const seperatorContainer = seperator.parentNode as HTMLDivElement;
			let column = seperatorContainer.parentNode as HTMLDivElement; //capture column header container for x and width properties
			setMouseDownOnSeparator(true); //mouse is currently being held on separator
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
		[setMouseDownOnSeparator, apiRef]
	);

	//resize column resizing bar indicator on mouse move when resizing event is occuring
	const handleListenForResize = React.useCallback(
		(e: MouseEvent) => {
			if (!mouseDownOnSeparator) return;

			//if mouseDownOnSeparator during mousemove, resizing event is occuring
			if (!resizing) {
				setResizing(true);
			}
			setResizeBarX(e.clientX);
		},
		[resizing, setResizing, mouseDownOnSeparator]
	);

	const handleListenForResizeEnd = React.useCallback(
		(e: MouseEvent) => {
			if (!mouseDownOnSeparator) return;

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
			setMouseDownOnSeparator(false); //mouseup event resets mouseDownOnSeparator value
			setResizing(false); //resizing over
			setCurrentColumnRight(0);
		},
		[
			mouseDownOnSeparator,
			currentColumnRight,
			currentField,
			setResizing,
			apiRef,
			setMouseDownOnSeparator,
		]
	);

	const handleDoubleClick = React.useCallback(() => {
		//capture test element
		const test = document.getElementById('test');

		if (!apiRef?.current || !currentField || !test) return;

		const allRowIds: string[] = Array.from(
			apiRef.current.getRowModels().values()
		).map((row) => row.id);

		const formattedValues = allRowIds.map(
			(id) => apiRef.current.getCellParams(id, currentField).formattedValue
		);

		//will keep track of longest formatted value
		let longest: string = '';

		formattedValues.forEach((value) => {
			value &&
				typeof value === 'string' &&
				value.length > longest.length &&
				(longest = value);
		});

		//set innerText of test element to longest formatted value
		test.innerText = longest;

		//set column width to test width
		apiRef.current.setColumnWidth(currentField, test.clientWidth + 20); //20 is 10px paddingX on each side from DataGrid
	}, [apiRef, currentField]);

	const addResizeEventListeners = React.useCallback(() => {
		const seperators: NodeListOf<SVGElement> = document.querySelectorAll(
			'.MuiDataGrid-iconSeparator'
		);
		seperators.forEach((seperator) => {
			seperator.addEventListener('dblclick', handleDoubleClick);
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
				seperator.removeEventListener('dblclick', handleDoubleClick);
			});
		};
	}, [
		handleListenForResize,
		handleListenForResizeEnd,
		handleListenForResizeStart,
		handleDoubleClick,
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

	//add hidden element to test element width based on characters
	React.useEffect(() => {
		const test = document.createElement('div');
		test.setAttribute('id', 'test');
		test.style.position = 'absolute';
		test.style.visibility = 'hidden';
		test.style.height = 'auto';
		test.style.width = 'auto';
		test.style.whiteSpace = 'nowrap';
		document.body.append(test);
		return () => {
			document.getElementById('test')?.remove();
		};
	});

	return (
		<ColumnResizeBar
			resizing={resizing}
			barTop={barTop}
			resizeBarX={resizeBarX}
		/>
	);
}
