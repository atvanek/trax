'use client';
import StyledTable from '../table/StyledDataGrid';
import defaultColumnValues from '@/utils/defaultColumnValues';
import toCamelCase from '@/utils/toCamelCase';
import { Importer, ImporterField } from 'react-csv-importer';
import defaultColumns from '../table/defaultColumns';
import 'react-csv-importer/dist/index.css';
import React from 'react';
import SaveDialog from './SaveDialog';
import { useTheme } from '@mui/material/styles';
import { IJob } from '@/db/models/job';
export default function ImporterDialog({}: {}) {
	// in your component code:
	const [newRows, setNewRows] = React.useState<Omit<IJob, 'userId'>[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [started, setStarted] = React.useState(false);
	const [completed, setCompleted] = React.useState(false);
	const [confirmFinish, setConfirmFinish] = React.useState(false);
	const [saveStatus, setSaveStatus] = React.useState<
		'success' | 'error' | null
	>(null);

	const theme = useTheme();
	const resetImporter = () => {
		setNewRows([]);
		setLoading(false);
		setStarted(false);
		setCompleted(false);
		setConfirmFinish(false);
		setSaveStatus(null);
	};
	React.useEffect(() => {
		resetImporter();
		return () => {
			resetImporter();
		};
	}, []);
	return (
		<div className='m-5'>
			{completed && (
				<StyledTable
					loading={loading}
					rows={newRows}
					columns={defaultColumns(() => {})}
					editMode='row'
					density='compact'
					height={400}
				/>
			)}

			<Importer
				dataHandler={async (rows, { startIndex }) => {
					// required, may be called several times
					// receives a list of parsed objects based on defined fields and user column mapping;
					// (if this callback returns a promise, the widget will wait for it before parsing more data)
					for (const row of rows) {
						if (Object.values(row).every((value) => value === '')) return; //ignore empty rows
						setNewRows((prev) => {
							const newRowWithId = { ...row, id: crypto.randomUUID() } as Omit<
								IJob,
								'userId'
							>;
							return [...prev, newRowWithId];
						});
					}
				}}
				defaultNoHeader={false} // optional, keeps "data has headers" checkbox off by default
				restartable={false} // optional, lets user choose to upload another file when import is complete
				onStart={({ file, preview, fields, columnFields }) => {
					// optional, invoked when user has mapped columns and started import
					// prepMyAppForIncomingData();
					setStarted(true);
					setLoading(true);
				}}
				onComplete={({ file, preview, fields, columnFields }) => {
					// optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
					// showMyAppToastNotification();
					setCompleted(true);
					setLoading(false);
				}}
				onClose={({ file, preview, fields, columnFields }) => {
					// optional, if this is specified the user will see a "Finish" button after import is done,
					// which will call this when clicked
					// goToMyAppNextPage();
					setConfirmFinish(true);
				}}
				theme={theme}
				// CSV options passed directly to PapaParse if specified:
				// delimiter={...}
				// newline={...}
				// quoteChar={...}
				// escapeChar={...}
				// comments={...}
				skipEmptyLines={true}
				// delimitersToGuess={...}
				// chunkSize={...} // defaults to 10000
				// encoding={...} // defaults to utf-8, see FileReader API
			>
				{defaultColumnValues.map((field) => (
					<ImporterField
						name={toCamelCase(field)}
						label={field}
						key={toCamelCase(field)}
						optional
					/>
				))}
			</Importer>
			<SaveDialog
				saveStatus={saveStatus}
				confirmFinish={confirmFinish}
				setConfirmFinish={setConfirmFinish}
				setSaveStatus={setSaveStatus}
				rows={newRows}
			/>
		</div>
	);
}
