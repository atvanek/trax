import { EditToolbarProps } from '@/types';
import { GridToolbarContainer } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GridToolbarExport, GridRowModes } from '@mui/x-data-grid';

export default function EditToolbar(props: EditToolbarProps) {
	const { setRows, setSortModel, setRowModesModel } = props;

	const handleClick = () => {
		setSortModel([{ field: 'date', sort: 'desc' }]);
		const newRowId = crypto.randomUUID();
		setRows((oldRows) => [
			{ id: newRowId, isNew: true, date: new Date() },
			...oldRows,
		]);
		setRowModesModel((oldModel) => ({
			[newRowId]: { mode: GridRowModes.Edit, fieldToFocus: 'date' },
			...oldModel,
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
