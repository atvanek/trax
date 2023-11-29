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
	AlertTitle,
} from '@mui/material';
import createCustomColumns from '@/utils/createCustomColumns';
import GridContext from '@/context/GridContext';
import { GridColDef } from '@mui/x-data-grid';
import toCamelCase from '@/utils/toCamelCase';

export default function AddColumnDialog({
	columns,
	setColumns,
}: {
	columns: GridColDef[];
	setColumns: React.Dispatch<SetStateAction<GridColDef[]>>;
}) {
	const [newColumnTitle, setNewColumnTitle] = React.useState('');
	const [error, setError] = React.useState({ status: false, message: '' });
	const { setCustomColumns, addingColumn, setAddingColumn } =
		React.useContext(GridContext);

	const handleAddColumn = React.useCallback(() => {
		if (
			columns.some((column) => column.field === toCamelCase(newColumnTitle))
		) {
			setError({
				status: true,
				message: `<span>Column with name <strong>${newColumnTitle}</strong> already exists</span>. <br>
				\n Please choose unique column name.`,
			});
			setTimeout(() => {
				setError({ status: false, message: '' });
			}, 6000);
			return;
		}
		fetch('/api/user/column', {
			method: 'POST',
			body: JSON.stringify(newColumnTitle),
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					setError({
						status: true,
						message: `Error adding column. Please try again.`,
					});
					setTimeout(() => {
						setError({ status: false, message: '' });
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
			.catch((err) => {
				setError({
					status: true,
					message: `Error adding column. Please try again.`,
				});
				setTimeout(() => {
					setError({ status: false, message: '' });
				}, 6000);
				return;
			})
			.finally(() => setNewColumnTitle(''));
	}, [newColumnTitle, setAddingColumn, setCustomColumns, setColumns, columns]);

	return (
		<Dialog
			open={addingColumn}
			onClose={() => setAddingColumn(false)}
			fullWidth
			maxWidth='xs'>
			<DialogTitle>New Column</DialogTitle>
			<DialogContent>
				<TextField
					fullWidth
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
			<Collapse in={error.status}>
				<Alert severity='error' sx={{ width: 'inherit' }}>
					<AlertTitle>Error</AlertTitle>
					<p dangerouslySetInnerHTML={{ __html: error.message }}></p>
				</Alert>
			</Collapse>
		</Dialog>
	);
}
