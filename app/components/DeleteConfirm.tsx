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
	confirmationMessage,
}: {
	deleteConfirmOpen: boolean;
	setDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleDeleteClick: () => void;
	confirmationMessage: string;
}) {
	return (
		<Dialog open={deleteConfirmOpen}>
			<DialogTitle>Delete?</DialogTitle>
			<DialogContent>
				<DialogContentText>{confirmationMessage}</DialogContentText>
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
