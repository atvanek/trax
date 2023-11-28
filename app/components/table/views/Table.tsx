'use client';

import React from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import EditToolbar from '../../toolbar/EditToolbar';
import StyledTable from './StyledDataGrid';
import DeleteConfirm from '../../DeleteConfirm';
import { TableProps } from '@/types';
import ColumnResizeBarContainer from '../containers/ColumnResizeBarContainer';
import AddColumnDialog from './AddColumnDialog';

export default function Table({
	rows,
	columns,
	setColumns,
	resizing,
	setResizing,
	handleProcessRowUpdate,
	rowModesModel,
	handleRowModesModelChange,
	handleRowEditStop,
	deleteConfirmOpen,
	setDeleteConfirmOpen,
	handleDeleteClick,
	error,
	setError,
	apiRef,
	initialState,
	newNodesRendered
}: TableProps) {
	return (
		<>
			<Box
				sx={{
					width: '100%',
					'& .actions': {
						color: 'text.secondary',
					},
					'& .textPrimary': {
						color: 'text.primary',
					},
				}}>
				<ColumnResizeBarContainer
					resizing={resizing}
					setResizing={setResizing}
					apiRef={apiRef}
					newNodesRendered={newNodesRendered}
				/>

				<StyledTable
					autoHeight
					apiRef={apiRef}
					sx={{
						pointerEvents: resizing ? 'none' : 'auto',
					}}
					processRowUpdate={handleProcessRowUpdate}
					rows={rows}
					columns={columns}
					editMode='row'
					density='compact'
					rowModesModel={rowModesModel}
					disableRowSelectionOnClick
					onRowModesModelChange={handleRowModesModelChange}
					onRowEditStop={handleRowEditStop}
					pageSizeOptions={[25, 50, 100]}
					slots={{
						toolbar: EditToolbar,
					}}
					initialState={initialState}
				/>
			</Box>
			<DeleteConfirm
				deleteConfirmOpen={deleteConfirmOpen}
				setDeleteConfirmOpen={setDeleteConfirmOpen}
				handleDeleteClick={handleDeleteClick}
				confirmationMessage='All job details will be permanently lost.'
			/>
			<AddColumnDialog setColumns={setColumns} />
			<Snackbar
				open={error}
				autoHideDuration={6000}
				onClose={() => setError(false)}>
				<Alert severity='error' sx={{ width: '100%' }}>
					Error updating data. Please try again.
				</Alert>
			</Snackbar>
		</>
	);
}
