import { GridColDef } from '@mui/x-data-grid';

export default function withUserOrder(
	newColumns: GridColDef[],
	userOrder?: string | null
) {
	if (userOrder) {
		const userOrderArr = JSON.parse(userOrder);
		return newColumns.sort(
			(a, b) => userOrderArr.indexOf(a.field) - userOrderArr.indexOf(b.field)
		);
	} else return newColumns;
}
