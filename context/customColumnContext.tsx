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

const Context = createContext<ContextProps>(DefaultContextValues);

export const ContextProvider: React.FC<ContextProviderProps> = ({
	fetchedCustomColumns,
	children,
}): JSX.Element => {
	const [customColumns, setCustomColumns] =
		React.useState(fetchedCustomColumns);

	return (
		<Context.Provider value={{ customColumns, setCustomColumns }}>
			{children}
		</Context.Provider>
	);
};

export default Context;
