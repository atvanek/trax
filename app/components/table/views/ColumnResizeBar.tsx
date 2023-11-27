import { useTheme } from '@mui/material/styles';
import React from 'react';

export default function ColumnResizeBar({
	resizing,
	barTop,
	resizeBarX,
}: {
	resizing: boolean;
	barTop: number;
	resizeBarX: number;
}) {
	const theme = useTheme();
	return (
		<div
			id='column-resize-bar'
			style={{
				visibility: resizing ? 'visible' : 'hidden',
				top: barTop,
				left: resizeBarX,
				position: 'absolute',
				width: '1px',
				backgroundColor: theme.palette.secondary.main,
				height: '100%',
			}}></div>
	);
}
