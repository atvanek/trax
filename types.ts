import { IJob } from './db/models/job';

import {
	GridRowsProp,
	GridRowModesModel,
	GridSortModel,
} from '@mui/x-data-grid';

export interface Job {
	date: Date;
	company: string;
	jobTitle: string;
	compensation: string;
	location: string;
	status: Status;
	rating: number;
	jobURL: string;
	contactName: string;
	notes: string;
	id: string;
}

export interface Row extends IJob {
	isNew: boolean;
}

export interface HeadCell {
	disablePadding: boolean;
	id: keyof Job;
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
	setSortModel: (value: React.SetStateAction<GridSortModel>) => void;
}

export interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}
