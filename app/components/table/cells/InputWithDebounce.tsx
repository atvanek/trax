'use client';

import React from 'react';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import { TextField } from '@mui/material';

export default function InputWithDebounce(props: GridRenderEditCellParams) {
	console.log(props);
	const { id, value: valueProp, field, hasFocus } = props;
	const [value, setValue] = React.useState(valueProp);
	const apiRef = useGridApiContext();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value; // The new value entered by the user

		apiRef.current.setEditCellValue({
			id,
			field,
			value: newValue,
			debounceMs: 300,
		});
		setValue(newValue);
	};

	React.useEffect(() => {
		setValue(valueProp);
	}, [valueProp]);

	return (
		<TextField
			autoFocus={hasFocus}
			sx={{ fontSize: 'inherit', border: 'none', outline: 'none' }}
			type='text'
			value={value}
			onChange={handleChange}
		/>
	);
}
