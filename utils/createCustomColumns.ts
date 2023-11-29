import { GridColDef } from '@mui/x-data-grid';
import toCamelCase from './toCamelCase';

export default function createCustomColumns(columns: string[]): GridColDef[] {
	return columns.map((column) => {
		return { field: toCamelCase(column), headerName: column, editable: true };
	}) as GridColDef[];
}
