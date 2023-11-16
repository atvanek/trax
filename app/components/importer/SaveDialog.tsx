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

export default function SaveDialog({
	saveStatus,
	confirmFinish,
	setConfirmFinish,
	setSaveStatus,
	rows,
}: {
	saveStatus: 'success' | 'error' | null;
	confirmFinish: boolean;
	setConfirmFinish: Dispatch<SetStateAction<boolean>>;
	setSaveStatus: Dispatch<SetStateAction<'success' | 'error' | null>>;
	rows: Omit<IJob, 'userId'>[];
}) {
	const handleSave = () => {
		fetch('/api/jobs', {
			method: 'POST',
			body: JSON.stringify(rows),
		}).then((res) => {
			if (res.ok) {
				setSaveStatus('success');
			} else {
				setSaveStatus('error');
			}
		});
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

						<Button variant='contained' color='primary' onClick={handleSave}>
							Save
						</Button>
					</>
				) : (
					<Link href='/dashboard' passHref>
						<Button variant='contained' color='primary'>
							Return to Dashboard
						</Button>
					</Link>
				)}
			</DialogActions>
			<Collapse in={!!saveStatus}>
				<Alert severity={saveStatus || undefined}>
					{saveStatus === 'success'
						? `Data successfully added.`
						: `Error while saving data. Please try again later.`}
				</Alert>
			</Collapse>
		</Dialog>
	);
}
