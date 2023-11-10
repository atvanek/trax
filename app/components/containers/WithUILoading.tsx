'use client';

import React from 'react';
import useMounted from '@/hooks/useMounted';

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
	const { mounted, setMounted } = useMounted();
	return (
		<>
			{fallback({ ...fallbackProps, mounted })}
			{component({ ...componentProps, setMounted })}
		</>
	);
}
