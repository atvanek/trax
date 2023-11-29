'use client';

import React, { SetStateAction } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Collapse,
	Alert,
	Button,
} from '@mui/material';
import createCustomColumns from '@/utils/createCustomColumns';
import GridContext from '@/context/GridContext';
import { GridColDef } from '@mui/x-data-grid';

export default function AddColumnDialog({
	setColumns,
}: {
	setColumns: React.Dispatch<SetStateAction<GridColDef[]>>;
}) {
	const [newColumnTitle, setNewColumnTitle] = React.useState('');
	const [error, setError] = React.useState(false);
	const { setCustomColumns, addingColumn, setAddingColumn } =
		React.useContext(GridContext);

	const handleAddColumn = React.useCallback(() => {
		fetch('/api/user/column', {
			method: 'POST',
			body: JSON.stringify(newColumnTitle),
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					setError(true);
					setTimeout(() => {
						setError(false);
					}, 6000);
					return;
				}
			})
			.then((data: { customColumns: string[] }) => {
				const newCustomColumns = createCustomColumns(data.customColumns);

				setColumns((prev) => {
					//filter out all previous custom columns
					const oldColumns = prev.filter((column) => {
						if (column.headerName) {
							return !data.customColumns.includes(column.headerName);
						}
						return true;
					});
					//replace with new customColumns
					const newColumns = [...oldColumns, ...newCustomColumns];
					localStorage.setItem(
						'separatorsOrder',
						JSON.stringify(newColumns.map((column) => column.field))
					);
					return newColumns;
				});

				setAddingColumn(false);
				setCustomColumns(data.customColumns);
			})
			.catch((err) =>
				setTimeout(() => {
					setError(false);
				}, 6000)
			)
			.finally(() => setNewColumnTitle(''));
	}, [newColumnTitle, setAddingColumn, setCustomColumns, setColumns]);

	return (
		<Dialog open={addingColumn} onClose={() => setAddingColumn(false)}>
			<DialogTitle>New Column</DialogTitle>
			<DialogContent>
				<TextField
					label='Column Title'
					sx={{ my: 3 }}
					value={newColumnTitle}
					onChange={(e) => setNewColumnTitle(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setAddingColumn(false)}>Cancel</Button>
				<Button onClick={handleAddColumn} variant='contained'>
					Add Column
				</Button>
			</DialogActions>
			<Collapse in={error}>
				<Alert severity='error'>Add column error.</Alert>
			</Collapse>
		</Dialog>
	);
}
