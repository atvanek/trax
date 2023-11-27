import { Select } from '@mui/material';
import statuses from '@/utils/statuses';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import { SelectChangeEvent } from '@mui/material';
import toCamelCase from '@/utils/toCamelCase';

export default function StatusSelect(params: GridRenderEditCellParams) {
	const { id, value, field } = params;
	const apiRef = useGridApiContext();

	const handleChange = async (event: SelectChangeEvent) => {
		await apiRef.current.setEditCellValue({
			id,
			field,
			value: event.target.value,
		});
		apiRef.current.stopRowEditMode({ id, field });
	};

	return (
    <Select
      fullWidth
			label={field}
			native
			value={value}
			onChange={handleChange}
			className={toCamelCase(value) + '-select'}>
			{field}
			{statuses.map((status) => {
				return <option key={status}>{status}</option>;
			})}
		</Select>
	);
}
