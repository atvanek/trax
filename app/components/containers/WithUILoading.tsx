'use client';

import React from 'react';
import useLoaded from '../../../hooks/useLoaded';

export default function WithUILoading({
	component,
	fallback,
	componentProps,
	fallbackProps,
}: {
	component: (props: any) => JSX.Element;
	fallback: (props: any) => JSX.Element;
	componentProps: any;
	fallbackProps: any;
}) {
	const { loaded, setLoaded } = useLoaded();

	return (
		<>
			{fallback({ ...fallbackProps, loaded })}
			{component({ ...componentProps, setLoaded })}
		</>
	);
}
