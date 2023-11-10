import { EditToolbarProps } from '@/types';
import { GridToolbarContainer, GridRowModes } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GridToolbarExport } from '@mui/x-data-grid';

export default function EditToolbar(props: EditToolbarProps) {
	const { setRows, setRowModesModel, setSortModel } = props;

	const handleClick = () => {
		setSortModel([{ field: 'date', sort: 'asc' }]);
		const id = crypto.randomUUID();
		setRows((oldRows) => [...oldRows, { id, isNew: true }]);
		setRowModesModel((oldModel) => ({
			...oldModel,
			[id]: { mode: GridRowModes.Edit, fieldToFocus: 'date' },
		}));
	};

	return (
		<GridToolbarContainer sx={{ justifyContent: 'space-between', px: 1 }}>
			<Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
				Add Job
			</Button>
			<GridToolbarExport />
		</GridToolbarContainer>
	);
}
