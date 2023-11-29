'use client';

import React from 'react';
import useMounted from '@/hooks/useMounted';

export default function WithUILoading({
	component,
	fallback,
	componentProps,
	fallbackProps,
}: {
	component: (props: any) => JSX.Element | null | undefined;
	fallback: (props: any) => JSX.Element | null;
	componentProps: any;
	fallbackProps: any;
}) {
	const { mounted, setMounted } = useMounted();
	return (
		<>
			{fallback({ ...fallbackProps, mounted })}
			{component({ ...componentProps, setMounted })}
		</>
	);
}
