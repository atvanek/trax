'use client';

import React, { createContext, ReactNode, SetStateAction } from 'react';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useGridApiRef } from '@mui/x-data-grid';

interface ContextProps {
	customColumns: string[];
	setCustomColumns: React.Dispatch<SetStateAction<string[]>>;
	apiRef: React.MutableRefObject<GridApiCommunity> | null;
	addingColumn: boolean;
	setAddingColumn: React.Dispatch<SetStateAction<boolean>>;
	currentTabIndex: number;
	setCurrentTabIndex: React.Dispatch<SetStateAction<number>>;
}

interface ContextProviderProps {
	fetchedCustomColumns: string[];
	children: ReactNode;
}

const DefaultContextValues: ContextProps = {
	customColumns: [],
	setCustomColumns: () => {},
	apiRef: null,
	addingColumn: false,
	setAddingColumn: () => {},
	currentTabIndex: 0,
	setCurrentTabIndex: () => {},
};

const GridContext = createContext<ContextProps>(DefaultContextValues);

export const GridContextProvider: React.FC<ContextProviderProps> = ({
	fetchedCustomColumns,
	children,
}): JSX.Element => {
	const [customColumns, setCustomColumns] =
		React.useState(fetchedCustomColumns);
	const apiRef = useGridApiRef();
	const [addingColumn, setAddingColumn] = React.useState(
		DefaultContextValues.addingColumn
	);
	const [currentTabIndex, setCurrentTabIndex] = React.useState(
		DefaultContextValues.currentTabIndex
	);

	return (
		<GridContext.Provider
			value={{
				customColumns,
				setCustomColumns,
				apiRef,
				addingColumn,
				setAddingColumn,
				currentTabIndex,
				setCurrentTabIndex
			}}>
			{children}
		</GridContext.Provider>
	);
};

export default GridContext;
