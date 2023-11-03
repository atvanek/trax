'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import columns from './columns';
import { RawJobData } from '@/types';

export default function DataGridDemo({ data }: { data: RawJobData[] }) {
	const rows = data;
	return (
		<Box sx={{ width: '100%' }}>
			<DataGrid
				rows={rows}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 5,
						},
					},
				}}
				pageSizeOptions={[5, 10, 15, 20]}
				checkboxSelection
				disableRowSelectionOnClick
			/>
		</Box>
	);
}
