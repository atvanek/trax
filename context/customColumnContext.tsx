'use client';

import React, { createContext, ReactNode, SetStateAction } from 'react';

interface ContextProps {
	customColumns: string[];
	setCustomColumns: React.Dispatch<SetStateAction<string[]>>;
}

interface ContextProviderProps {
	fetchedCustomColumns: string[];
	children: ReactNode;
}

const DefaultContextValues: ContextProps = {
	customColumns: [],
	setCustomColumns: () => {},
};

const CustomColumnContext = createContext<ContextProps>(DefaultContextValues);

export const CustomColumnContextProvider: React.FC<ContextProviderProps> = ({
	fetchedCustomColumns,
	children,
}): JSX.Element => {
	const [customColumns, setCustomColumns] =
		React.useState(fetchedCustomColumns);

	return (
		<CustomColumnContext.Provider value={{ customColumns, setCustomColumns }}>
			{children}
		</CustomColumnContext.Provider>
	);
};

export default CustomColumnContext;
