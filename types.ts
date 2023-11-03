export interface TableJobData {
	date: string;
	company: string;
	jobTitle: string;
	compensation: number;
	location: string;
	jobURL: string;
}

export interface RawJobData extends TableJobData {
	id: number;
}

export interface HeadCell {
	disablePadding: boolean;
	id: keyof TableJobData;
	label: string;
	numeric: boolean;
}

export type Order = 'asc' | 'desc';

export interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (
		event: React.MouseEvent<unknown>,
		property: keyof TableJobData
	) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

export interface EnhancedTableToolbarProps {
	numSelected: number;
}
