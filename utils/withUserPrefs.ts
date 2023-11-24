import { GridColDef } from '@mui/x-data-grid';

export default function withUserPrefs(
	newColumns: GridColDef[],
	userOrder?: string | null,
	columnWidths?: string | null
): GridColDef[] {

	if (userOrder) {
		const userOrderArr: string[] = JSON.parse(userOrder);

		//sort based on user column order array
		newColumns.sort(
			(a, b) => userOrderArr.indexOf(a.field) - userOrderArr.indexOf(b.field)
		);
	}
	if (columnWidths) {
		const parsedColumnWidths: { [key: string]: number } =
			JSON.parse(columnWidths);

		return newColumns.map((column) => {
			return {
				...column,
				width: parsedColumnWidths[column.field],
			};
		});
	}
	return newColumns;
}
