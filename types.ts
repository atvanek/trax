import { IJob } from './db/models/job';

import {
	GridRowsProp,
	GridRowModesModel,
	GridSortModel,
	GridColDef,
	GridEventListener,
	GridCellParams,
	GridInitialState,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';

export interface Row extends IJob {
	isNew: boolean;
}

export interface HeadCell {
	disablePadding: boolean;
	id: keyof IJob;
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

export interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	currentTabIndex: number;
}

export type ChartData = {
	id: number;
	value: number;
	label: Status;
	color: string;
	visible: boolean;
};

export type TableProps = {
	rows: Row[];
	setRows: React.Dispatch<React.SetStateAction<Row[]>>;
	columns: GridColDef[];
	setColumns: React.Dispatch<React.SetStateAction<GridColDef[]>>;
	resizing: boolean;
	setResizing: React.Dispatch<React.SetStateAction<boolean>>;
	handleProcessRowUpdate: (updatedRow: Row) => void;
	rowModesModel: GridRowModesModel;
	setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
	handleRowModesModelChange: (newRowModesModel: GridRowModesModel) => void;
	handleRowEditStop: GridEventListener<'rowEditStop'>;
	deleteConfirmOpen: boolean;
	setDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleDeleteClick: () => void;
	error: boolean;
	setError: React.Dispatch<React.SetStateAction<boolean>>;
	apiRef: React.MutableRefObject<GridApiCommunity> | null;
	initialState: GridInitialState;
	newNodesRendered: boolean;
};

export type SaveStatus = 'success' | 'error' | 'pending' | null;
