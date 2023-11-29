import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	Button,
	DialogActions,
	Alert,
	Collapse,
} from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import { IJob } from '@/db/models/job';
import { SaveStatus } from '@/types';
import GridContext from '@/context/GridContext';

export default function SaveDialog({
	saveStatus,
	confirmFinish,
	setSaveStatus,
	rows,
	resetImporter,
}: {
	saveStatus: SaveStatus;
	confirmFinish: boolean;
	setConfirmFinish: Dispatch<SetStateAction<boolean>>;
	setSaveStatus: Dispatch<SetStateAction<SaveStatus>>;
	rows: Omit<IJob, 'userId'>[];
	resetImporter: () => void;
}) {
	const { setCurrentTabIndex, apiRef } = React.useContext(GridContext);

	const handleSave = () => {
		rows.forEach((row) => {
			apiRef?.current.updateRows([row]);
		});

		fetch('/api/jobs', {
			method: 'POST',
			body: JSON.stringify(rows),
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					setSaveStatus('error');
				}
			})
			.then((parsed) => {
				setSaveStatus('success');
			})
			.catch((err) => setSaveStatus('error'));
	};

	const handleReset = () => {
		resetImporter();
		setCurrentTabIndex(0);
	};

	return (
		<Dialog open={confirmFinish}>
			<DialogTitle>Save Imported Data</DialogTitle>

			{!saveStatus && (
				<DialogContent>
					<DialogContentText>
						Save imported data to your job listings?
					</DialogContentText>
				</DialogContent>
			)}

			<DialogActions>
				{!saveStatus ? (
					<>
						<Button variant='contained' color='secondary' onClick={handleReset}>
							Discard
						</Button>

						<Button
							variant='contained'
							color='primary'
							onClick={handleSave}
							disabled={saveStatus === 'pending'}>
							Save
						</Button>
					</>
				) : (
					<Button
						onClick={handleReset}
						variant='contained'
						color='primary'
						disabled={saveStatus === 'pending'}>
						Return to Dashboard
					</Button>
				)}
			</DialogActions>
			<Collapse in={!!saveStatus}>
				<Alert
					severity={
						saveStatus === 'success' || saveStatus === 'error'
							? saveStatus
							: undefined
					}>
					{saveStatus === 'success'
						? `Data successfully added.`
						: `Error while saving data. Please try again later.`}
				</Alert>
			</Collapse>
		</Dialog>
	);
}
