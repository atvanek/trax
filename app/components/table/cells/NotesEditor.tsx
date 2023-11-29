import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
	TextField,
	Button,
} from '@mui/material';
import React from 'react';
import { GridRenderEditCellParams } from '@mui/x-data-grid';

export default function NotesEditor(params: GridRenderEditCellParams) {
	const { formattedValue, hasFocus, api, id, field, row } = params;
	const [value, setValue] = React.useState(formattedValue);
	const [open, setOpen] = React.useState(hasFocus);

	React.useEffect(() => {
		setOpen(hasFocus);
	}, [hasFocus]);

	const handleSave = (
		e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>
	) => {
		e.preventDefault();
		setOpen(false);
		api.setEditCellValue({ id, field, value });
		api.stopRowEditMode({ id: row.id });
	};
	const handleCancel = () => {
		setOpen(false);
		api.stopRowEditMode({ id: row.id, field, ignoreModifications: true });
	};
	return (
		<>
			{formattedValue}
			{open && (
				<Dialog
					open={open}
					transitionDuration={0}
					onClose={() => setOpen(false)}
					fullWidth>
					<DialogTitle>Notes</DialogTitle>
					<DialogContent>
						<TextField
							fullWidth
							multiline
							value={value}
							onChange={(e) => setValue(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSave(e);
								}
							}}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleSave} variant='contained'>
							Save
						</Button>
						<Button onClick={handleCancel}>Cancel</Button>
					</DialogActions>
				</Dialog>
			)}
		</>
	);
}
