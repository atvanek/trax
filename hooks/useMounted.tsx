'use client';

import React from 'react';

export default function useMounted() {
	const [mounted, setMounted] = React.useState(false);
	return { mounted, setMounted };
}
