'use client';

import React from 'react';
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
import { GridColDef } from '@mui/x-data-grid';

export default function AddColumnDialog({
	addingColumn,
	setAddingColumn,
	setColumns,
}: {
	addingColumn: boolean;
	setAddingColumn: React.Dispatch<React.SetStateAction<boolean>>;
	setColumns: React.Dispatch<React.SetStateAction<GridColDef[]>>;
}) {
	const [newColumnTitle, setNewColumnTitle] = React.useState('');
	const [error, setError] = React.useState(false);

	const handleAddColumn = React.useCallback(() => {
		fetch('/api/user/column', {
			method: 'POST',
			body: JSON.stringify(newColumnTitle),
		})
			.then((res) => {
				console.log(res.ok);
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
			.then((data) => {
				const newCustomColumns = createCustomColumns(data.customColumns);
				setColumns((prev) => {
					return [...prev, ...newCustomColumns];
				});
				setAddingColumn(false);
			})
			.catch((err) =>
				setTimeout(() => {
					setError(false);
				}, 6000)
			)
			.finally(() => setNewColumnTitle(''));
	}, [newColumnTitle, setColumns, setAddingColumn]);

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
