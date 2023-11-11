import { EditToolbarProps } from '@/types';
import { GridToolbarContainer, GridRowModes } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import { GridToolbarExport } from '@mui/x-data-grid';

export default function EditToolbar(props: EditToolbarProps) {
	const { setRows, setRowModesModel, setSortModel, editing, setEditing } =
		props;

	const handleClick = () => {
		if (!editing) {
			setSortModel([{ field: 'date', sort: 'asc' }]);
			const id = crypto.randomUUID();
			setRows((oldRows) => [{ id, isNew: true }, ...oldRows]);
			setRowModesModel((oldModel) => ({
				[id]: { mode: GridRowModes.Edit, fieldToFocus: 'date' },
				...oldModel,
			}));
			setEditing(true);
		} else {
			setEditing(false);
		}
	};

	return (
		<GridToolbarContainer sx={{ justifyContent: 'space-between', px: 1 }}>
			<Button
				color='primary'
				startIcon={editing ? <SaveIcon /> : <AddIcon />}
				onClick={handleClick}>
				{editing ? 'Save' : 'Add Job'}
			</Button>
			<GridToolbarExport />
		</GridToolbarContainer>
	);
}
