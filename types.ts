import { GridRowsProp, GridRowModesModel } from '@mui/x-data-grid';

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

export interface EditToolbarProps {
	setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
	setRowModesModel: (
		newModel: (oldModel: GridRowModesModel) => GridRowModesModel
	) => void;
}
