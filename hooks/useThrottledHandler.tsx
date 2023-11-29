import { useState, useCallback } from 'react';

const useThrottledHandler = (
	handler: () => void,
	initialCount = 0,
	throttleDuration = 1000
) => {
	const [clickCount, setClickCount] = useState(initialCount);
	const [isThrottled, setIsThrottled] = useState(false);

	const throttledHandler = useCallback(() => {
		if (!isThrottled) {
			setClickCount((prevCount) => prevCount + 1);
			setIsThrottled(true);
			handler();
			// Reset the throttling after the specified duration
			setTimeout(() => {
				setIsThrottled(false);
			}, throttleDuration);
		}
	}, [handler, isThrottled, throttleDuration]);

	return {
		clickCount,
		isThrottled,
		throttledHandler,
	};
};

export default useThrottledHandler;
