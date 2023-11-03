export interface TableJobData {
	date: Date;
	company: string;
	jobTitle: string;
	compensation: string;
	location: string;
	status: Status;
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
export type Status =
	| 'ready to apply'
	| 'applied'
	| 'followed-up'
	| 'phone-screen'
	| 'technical'
	| 'final round/onsite'
	| 'offer'
	| 'negotiation'
	| 'signed'
	| 'rejected'
	| 'declined'
	| 'lost contact'
	| 'no-response';

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
