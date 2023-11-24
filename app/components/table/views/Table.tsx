'use client';

import React from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import EditToolbar from '../../toolbar/EditToolbar';
import StyledTable from './StyledDataGrid';
import DeleteConfirm from '../../DeleteConfirm';
import { TableProps } from '@/types';
import ColumnResizeBarContainer from '../containers/ColumnResizeBarContainer';

export default function Table({
	rows,
	setRows,
	columns,
	setColumns,
	tableRendered,
	resizing,
	setResizing,
	handleProcessRowUpdate,
	rowModesModel,
	setRowModesModel,
	handleRowModesModelChange,
	handleRowEditStop,
	handleCellClick,
	sortModel,
	setSortModel,
	handleSortModelChange,
	deleteConfirmOpen,
	setDeleteConfirmOpen,
	handleDeleteClick,
	error,
	setError,
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
					tableRendered={tableRendered}
					setColumns={setColumns}
					resizing={resizing}
					setResizing={setResizing}
				/>

				<StyledTable
					autoHeight
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
					onCellClick={handleCellClick}
					sortModel={sortModel}
					onSortModelChange={handleSortModelChange}
					pageSizeOptions={[25, 50, 100]}
					slots={{
						toolbar: EditToolbar,
					}}
					slotProps={{
						toolbar: {
							setRows,
							setSortModel,
							setRowModesModel,
							setColumns,
						},
					}}
					initialState={{
						sorting: { sortModel },
					}}
				/>
			</Box>
			<DeleteConfirm
				deleteConfirmOpen={deleteConfirmOpen}
				setDeleteConfirmOpen={setDeleteConfirmOpen}
				handleDeleteClick={handleDeleteClick}
				confirmationMessage='All job details will be permanently lost.'
			/>
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
