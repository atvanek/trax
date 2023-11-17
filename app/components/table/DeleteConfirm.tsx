import {
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	DialogActions,
	Button,
} from '@mui/material';

export default function DeleteConfirm({
	deleteConfirmOpen,
	setDeleteConfirmOpen,
	handleDeleteClick,
}: {
	deleteConfirmOpen: boolean;
	setDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleDeleteClick: () => void;
}) {
	return (
		<Dialog open={deleteConfirmOpen}>
			<DialogTitle>Delete job listing?</DialogTitle>
			<DialogContent>
				<DialogContentText>
					All job details will be permanently lost.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					color='primary'
					autoFocus
					onClick={() => setDeleteConfirmOpen(false)}>
					Cancel
				</Button>
				<Button variant='contained' color='error' onClick={handleDeleteClick}>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}
