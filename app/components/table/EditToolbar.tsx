'use client';

import React from 'react';
import { EditToolbarProps } from '@/types';
import { GridToolbarContainer } from '@mui/x-data-grid';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Alert,
	Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ViewColumn } from '@mui/icons-material';
import { GridToolbarExport, GridRowModes } from '@mui/x-data-grid';
import useThrottledHandler from '@/hooks/useThrottledHandler';
import createCustomColumns from '@/utils/createCustomColumns';

export default function EditToolbar(props: EditToolbarProps) {
	const { setRows, setSortModel, setRowModesModel, setColumns } = props;
	const [addingColumn, setAddingColumn] = React.useState(false);
	const [newColumnTitle, setNewColumnTitle] = React.useState('');
	const [error, setError] = React.useState(false);

	const handleClick = React.useCallback(() => {
		setSortModel([{ field: 'date', sort: 'desc' }]);
		const newRowId = crypto.randomUUID();
		setRows((oldRows) => [
			{ id: newRowId, isNew: true, date: new Date() },
			...oldRows,
		]);
		setRowModesModel((oldModel) => ({
			[newRowId]: { mode: GridRowModes.Edit, fieldToFocus: 'date' },
			...oldModel,
		}));
	}, [setRowModesModel, setRows, setSortModel]);

	const { throttledHandler } = useThrottledHandler(handleClick);

	const handleAddColumn = () => {
		fetch('/api/user/column', {
			method: 'POST',
			body: JSON.stringify(newColumnTitle),
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					setError(true);
				}
			})
			.then((data) => {
				const newCustomColumns = createCustomColumns(data.customColumns);
				setColumns((prevColumns) => {
					return [...prevColumns, ...newCustomColumns];
				});
			})
			.catch((err) => setError(true));
	};

	return (
		<GridToolbarContainer sx={{ justifyContent: 'space-between', px: 1 }}>
			<Button
				color='primary'
				startIcon={<AddIcon />}
				onClick={throttledHandler}>
				Add Job
			</Button>
			<div className='flex items-center'>
				<Button
					color='primary'
					startIcon={<ViewColumn />}
					onClick={() => setAddingColumn(true)}>
					Add Column
				</Button>
				<GridToolbarExport />
			</div>
			<Dialog open={addingColumn}>
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
			</Dialog>
			<Snackbar open={error} autoHideDuration={6000}>
				<Alert severity='error'>
					Error adding column. Please try again later.
				</Alert>
			</Snackbar>
		</GridToolbarContainer>
	);
}
