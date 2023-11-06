'use client';

import React from 'react';

export default function useLoaded() {
	const [loaded, setLoaded] = React.useState(false);
	return { loaded, setLoaded };
}
