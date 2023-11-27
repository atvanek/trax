'use client';

import React from 'react';
import { EditToolbarProps } from '@/types';
import { GridToolbarContainer } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ViewColumn } from '@mui/icons-material';
import {
	GridToolbarExport,
	GridRowModes,
	GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import AddColumnDialog from './AddColumnDialog';

export default function EditToolbar(props: EditToolbarProps) {
	const { setRows, setRowModesModel, setColumns } = props;
	const [addingColumn, setAddingColumn] = React.useState(false);

	const handleClick = React.useCallback(() => {
		const newRowId = crypto.randomUUID();
		setRows((oldRows) => [
			{ id: newRowId, isNew: true, date: new Date() },
			...oldRows,
		]);
		setRowModesModel((oldModel) => ({
			[newRowId]: { mode: GridRowModes.Edit, fieldToFocus: 'date' },
			...oldModel,
		}));
	}, [setRowModesModel, setRows]);

	return (
		<GridToolbarContainer sx={{ justifyContent: 'space-between', px: 1 }}>
			<div className='flex items-center'>
				<Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
					Add Job
				</Button>
				<Button
					color='primary'
					startIcon={<ViewColumn />}
					onClick={() => setAddingColumn(true)}>
					Add Column
				</Button>
				<GridToolbarExport />
			</div>
			<div>
				<GridToolbarQuickFilter />
			</div>

			<AddColumnDialog
				addingColumn={addingColumn}
				setAddingColumn={setAddingColumn}
				setColumns={setColumns}
			/>
		</GridToolbarContainer>
	);
}
