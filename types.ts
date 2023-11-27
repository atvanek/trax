import { IJob } from './db/models/job';

import {
	GridRowsProp,
	GridRowModesModel,
	GridSortModel,
	GridColDef,
	GridEventListener,
	GridCellParams,
} from '@mui/x-data-grid';

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

export interface EditToolbarProps {
	setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
	setRowModesModel: (
		newModel: (oldModel: GridRowModesModel) => GridRowModesModel
	) => void;
	setSortModel: (value: React.SetStateAction<GridSortModel>) => void;
	setColumns: (value: React.SetStateAction<GridColDef[]>) => void;
}

export interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
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
	columns: GridColDef[] | null;
	setColumns: React.Dispatch<React.SetStateAction<GridColDef[] | null>>;
	tableRendered: boolean;
	resizing: boolean;
	setResizing: React.Dispatch<React.SetStateAction<boolean>>;
	handleProcessRowUpdate: (updatedRow: Row) => void;
	rowModesModel: GridRowModesModel;
	setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
	handleRowModesModelChange: (newRowModesModel: GridRowModesModel) => void;
	handleRowEditStop: GridEventListener<'rowEditStop'>;
	handleCellClick: (params: GridCellParams, event: React.MouseEvent) => void;
	sortModel: GridSortModel;
	setSortModel: React.Dispatch<React.SetStateAction<GridSortModel>>;
	handleSortModelChange: (newSortModel: GridSortModel) => void;
	deleteConfirmOpen: boolean;
	setDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleDeleteClick: () => void;
	error: boolean;
	setError: React.Dispatch<React.SetStateAction<boolean>>;
};

export type SaveStatus = 'success' | 'error' | 'pending' | null;
