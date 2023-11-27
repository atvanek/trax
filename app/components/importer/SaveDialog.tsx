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
import Link from 'next/link';
import { SaveStatus } from '@/types';

export default function SaveDialog({
	saveStatus,
	confirmFinish,
	setSaveStatus,
	rows,
}: {
	saveStatus: SaveStatus;
	confirmFinish: boolean;
	setConfirmFinish: Dispatch<SetStateAction<boolean>>;
	setSaveStatus: Dispatch<SetStateAction<SaveStatus>>;
	rows: Omit<IJob, 'userId'>[];
}) {
	const handleSave = () => {
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
						<Link href='/' passHref>
							<Button variant='contained' color='secondary'>
								Discard
							</Button>
						</Link>

						<Button
							variant='contained'
							color='primary'
							onClick={handleSave}
							disabled={saveStatus === 'pending'}>
							Save
						</Button>
					</>
				) : (
					<Link href='/dashboard'>
						<Button
							variant='contained'
							color='primary'
							disabled={saveStatus === 'pending'}>
							Return to Dashboard
						</Button>
					</Link>
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
