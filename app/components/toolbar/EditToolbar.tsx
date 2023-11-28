'use client';

import React from 'react';
import {
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarColumnsButton,
	GridToolbarFilterButton,
} from '@mui/x-data-grid';

import { GridToolbarQuickFilter } from '@mui/x-data-grid';

export default function EditToolbar() {
	return (
		<GridToolbarContainer sx={{ justifyContent: 'space-between', px: 1 }}>
			<div className='flex items-center ml-3'>
				<GridToolbarColumnsButton />
				<GridToolbarDensitySelector />
				<GridToolbarFilterButton />
			</div>

			<div>
				<GridToolbarQuickFilter size='medium' />
			</div>
		</GridToolbarContainer>
	);
}
