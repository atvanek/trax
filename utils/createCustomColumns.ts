import { GridColDef } from '@mui/x-data-grid';

export default function createCustomColumns(columns: string[]): GridColDef[] {
	return columns.map((column) => {
		return { field: column, headerName: column, editable: true };
	}) as GridColDef[];
}
