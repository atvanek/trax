import toCamelCase from './toCamelCase';
import { GridColDef } from '@mui/x-data-grid';

export default function createCustomColumns(columns: string[]): GridColDef[] {
	return columns.map((column) => {
		return { field: toCamelCase(column), headerName: column };
	}) as GridColDef[];
}
