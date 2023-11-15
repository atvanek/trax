'use client';

import defaultColumnValues from '@/utils/defaultColumnValues';
import toCamelCase from '@/utils/toCamelCase';
import { Importer, ImporterField } from 'react-csv-importer';

import 'react-csv-importer/dist/index.css';

export default function Page() {
	// in your component code:
	return (
		<Importer
			dataHandler={async (rows, { startIndex }) => {
				// required, may be called several times
				// receives a list of parsed objects based on defined fields and user column mapping;
				// (if this callback returns a promise, the widget will wait for it before parsing more data)
				// for (const row of rows) {
				//   await myAppMethod(row);
				// }
			}}
			defaultNoHeader={false} // optional, keeps "data has headers" checkbox off by default
			restartable={false} // optional, lets user choose to upload another file when import is complete
			onStart={({ file, preview, fields, columnFields }) => {
				// optional, invoked when user has mapped columns and started import
				// prepMyAppForIncomingData();
			}}
			onComplete={({ file, preview, fields, columnFields }) => {
				// optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
				// showMyAppToastNotification();
				console.log(preview);
			}}
			onClose={({ file, preview, fields, columnFields }) => {
				// optional, if this is specified the user will see a "Finish" button after import is done,
				// which will call this when clicked
				// goToMyAppNextPage();
			}}

			// CSV options passed directly to PapaParse if specified:
			// delimiter={...}
			// newline={...}
			// quoteChar={...}
			// escapeChar={...}
			// comments={...}
			// skipEmptyLines={...}
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
	);
}
